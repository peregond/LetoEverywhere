import {normalizeProgress} from './save-format.js';
const headers={'Cache-Control':'private, no-store','Vary':'Cookie'};
const json=(data,status=200)=>Response.json(data,{status,headers});
export async function readProgress(db,userId) {
  const row=await db.prepare('SELECT save_json, revision, updated_at FROM game_progress WHERE user_id = ?').bind(userId).first();
  return row?{progress:JSON.parse(row.save_json),revision:row.revision,syncedAt:row.updated_at}:{progress:null,revision:null,syncedAt:null};
}
export async function handleProgress(request,db,userId) {
  if(!userId)return json({error:'Для синхронизации нужно войти.'},401);
  if(request.method==='GET')return json(await readProgress(db,userId));
  if(request.method!=='PUT')return json({error:'Метод недоступен.'},405);
  if(request.headers.get('X-Game-Account')&&request.headers.get('X-Game-Account')!==userId)return json({error:'Аккаунт изменился. Войди снова.'},401);
  if(request.headers.get('Origin')!==new URL(request.url).origin)return json({error:'Недопустимый источник запроса.'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'Ожидается JSON.'},415);
  const reader=request.body?.getReader();let size=0;const chunks=[];if(reader){while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>500000){await reader.cancel();return json({error:'Сохранение слишком велико.'},413);}chunks.push(part.value);}}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  const text=new TextDecoder().decode(bytes);if(text.length>500000)return json({error:'Сохранение слишком велико.'},413);
  let progress,baseRevision;
  try{const body=JSON.parse(text);progress=normalizeProgress(body.progress);baseRevision=body.baseRevision;if(baseRevision!==null&&(!Number.isInteger(baseRevision)||baseRevision<1))throw Error('Некорректная версия.');}
  catch(error){return json({error:error instanceof Error?error.message:'Повреждено сохранение.'},400);}
  const now=Date.now(),data=JSON.stringify(progress);
  const row=baseRevision===null
    ? await db.prepare('INSERT INTO game_progress (user_id, save_json, revision, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(user_id) DO NOTHING RETURNING revision').bind(userId,data,now).first()
    : await db.prepare('UPDATE game_progress SET save_json = ?, revision = revision + 1, updated_at = ? WHERE user_id = ? AND revision = ? RETURNING revision').bind(data,now,userId,baseRevision).first();
  if(!row)return json({error:'Сохранение уже изменилось на другом устройстве.',...await readProgress(db,userId)},409);
  return json({revision:row.revision,syncedAt:now});
}
