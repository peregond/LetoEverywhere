import {scrypt,randomBytes,randomUUID,createHash,timingSafeEqual} from 'node:crypto';
const MAX_AGE=30*24*60*60;
const WINDOW=15*60*1000;
const hash=text=>createHash('sha256').update(text).digest('hex');
const json=(body,status=200,extra={})=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie',...extra}});
const local=request=>['localhost','127.0.0.1','[::1]'].includes(new URL(request.url).hostname)&&new URL(request.url).protocol==='http:';
const cookieName=request=>local(request)?'ss_session_dev':'__Host-ss_session';
const cookie=(request,token,age=MAX_AGE)=>`${cookieName(request)}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${age}${local(request)?'':'; Secure'}`;
function tokenFrom(request){return request.headers.get('Cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName(request)+'='))?.slice(cookieName(request).length+1)??null;}
const derive=(password,salt)=>new Promise((resolve,reject)=>scrypt(password,salt,32,{N:16384,r:8,p:5,maxmem:32*1024*1024},(error,result)=>error?reject(error):resolve(result)));
export async function hashPassword(password,salt=randomBytes(16).toString('hex')){const key=await derive(password,salt);return `scrypt$16384$8$5$${salt}$${key.toString('hex')}`;}
export async function checkPassword(password,encoded){
  const parts=encoded.split('$');if(parts.length!==6||parts.slice(0,4).join('$')!=='scrypt$16384$8$5')return false;
  const derived=await derive(password,parts[4]),expected=Buffer.from(parts[5],'hex');return expected.length===derived.length&&timingSafeEqual(expected,derived);
}
const dummyHash='scrypt$16384$8$5$00000000000000000000000000000000$'+'00'.repeat(32);
function credentials(body){
  const login=typeof body.login==='string'?body.login.normalize('NFKC').trim():'';
  if(!/^[\p{L}\p{N}_.-]{3,32}$/u.test(login))throw Error('Логин: 3–32 буквы или цифры. Можно _ . -');
  const password=body.password;
  if(typeof password!=='string'||password.length<10||password.length>128)throw Error('Пароль: от 10 до 128 символов.');
  return {login,loginKey:login.toLowerCase(),password};
}
export async function getAccount(request,db){
  const token=tokenFrom(request);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
  const row=await db.prepare('SELECT a.id, a.display_name FROM account_sessions s JOIN accounts a ON a.id = s.account_id WHERE s.token_hash = ? AND s.expires_at > ?').bind(hash(token),Date.now()).first();
  return row?{userId:row.id,displayName:row.display_name}:null;
}
async function limit(db,key,max){
  const now=Date.now();
  const row=await db.prepare('INSERT INTO auth_limits (key, attempts, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN ? - window_start >= ? THEN 1 ELSE attempts + 1 END, window_start = CASE WHEN ? - window_start >= ? THEN ? ELSE window_start END RETURNING attempts').bind(hash(key),now,now,WINDOW,now,WINDOW,now).first();
  return row.attempts<=max;
}
async function newSession(db,request,id){
  const token=randomBytes(32).toString('hex');
  await db.prepare('INSERT INTO account_sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)').bind(hash(token),id,Date.now()+MAX_AGE*1000).run();
  return cookie(request,token);
}
export async function handleAccount(request,db,legacyId=null){
  if(request.method!=='POST')return json({error:'Метод недоступен.'},405);
  if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'Недопустимый источник запроса.'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'Ожидается JSON.'},415);
  let body;
  try{const length=Number(request.headers.get('Content-Length'));if(length>4096)return json({error:'Слишком большой запрос.'},413);const reader=request.body?.getReader();const chunks=[];let size=0;if(reader){while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>4096){await reader.cancel();return json({error:'Слишком большой запрос.'},413);}chunks.push(part.value);}}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}body=JSON.parse(new TextDecoder().decode(bytes));}catch{return json({error:'Не удалось прочитать запрос.'},400);}
  if(body.action==='logout'){
    const token=tokenFrom(request);if(token)await db.prepare('DELETE FROM account_sessions WHERE token_hash = ?').bind(hash(token)).run();
    return json({ok:true},200,{'Set-Cookie':cookie(request,'',0)});
  }
  if(!['register','login','recover'].includes(body.action))return json({error:'Неизвестное действие.'},400);
  let input;try{input=credentials(body);}catch(error){return json({error:error.message},400);}
  const ip=request.headers.get('CF-Connecting-IP')??request.headers.get('X-Forwarded-For')?.split(',')[0]??'unknown';
  if(!await limit(db,'ip:'+ip,30)||!await limit(db,'login:'+input.loginKey,8))return json({error:'Слишком много попыток. Попробуй через 15 минут.'},429,{'Retry-After':'900'});
  let row=await db.prepare('SELECT * FROM accounts WHERE login_key = ?').bind(input.loginKey).first();
  let recoveryCode=null;
  if(body.action==='register'){
    if(row)return json({error:'Этот логин уже занят. Попробуй другой.'},409);
    const passwordHash=await hashPassword(input.password);
    const id='account_'+randomUUID();recoveryCode=randomBytes(24).toString('hex');
    try{await db.prepare('INSERT INTO accounts (id, login_key, display_name, password_hash, recovery_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id,input.loginKey,input.login,passwordHash,hash(recoveryCode),Date.now()).run();}
    catch{return json({error:'Этот логин уже занят. Попробуй другой.'},409);}
    if(body.migrateLegacy===true&&legacyId)await db.prepare('INSERT INTO game_progress (user_id, save_json, revision, updated_at) SELECT ?, save_json, 1, ? FROM game_progress WHERE user_id = ? ON CONFLICT(user_id) DO NOTHING').bind(id,Date.now(),legacyId).run();
    row={id,display_name:input.login};
  }else if(body.action==='recover'){
    const code=typeof body.recoveryCode==='string'?body.recoveryCode.replace(/\s/g,''):'';
    if(!row||!code||!timingSafeEqual(Buffer.from(hash(code),'hex'),Buffer.from(row.recovery_hash,'hex')))return json({error:'Логин или код восстановления не подошёл.'},401);
    recoveryCode=randomBytes(24).toString('hex');
    const passwordHash=await hashPassword(input.password);
    await db.batch([db.prepare('UPDATE accounts SET password_hash = ?, recovery_hash = ? WHERE id = ?').bind(passwordHash,hash(recoveryCode),row.id),db.prepare('DELETE FROM account_sessions WHERE account_id = ?').bind(row.id)]);
  }else{
    const valid=await checkPassword(input.password,row?.password_hash??dummyHash);
    if(!row||!valid)return json({error:'Логин или пароль не подошёл.'},401);
  }
  await db.prepare('DELETE FROM auth_limits WHERE key = ?').bind(hash('login:'+input.loginKey)).run();
  const sessionCookie=await newSession(db,request,row.id);
  return json({user:{id:row.id,displayName:row.display_name},...(recoveryCode?{recoveryCode}:{})},200,{'Set-Cookie':sessionCookie});
}
