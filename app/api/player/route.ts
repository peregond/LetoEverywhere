import {env} from 'cloudflare:workers';
import {getAccount} from '../../../lib/accounts.js';
export const dynamic='force-dynamic';
export async function GET(request:Request){
  const user=env.DB?await getAccount(request,env.DB):null;
  const legacyId=request.headers.get('oai-authenticated-user-email')?request.headers.get('oai-authenticated-user-id'):null;
  const legacy=env.DB&&legacyId?await env.DB.prepare('SELECT revision FROM game_progress WHERE user_id = ?').bind(legacyId).first():null;
  return Response.json({user:user?{id:user.userId,displayName:user.displayName}:null,legacyAvailable:!!legacy,auth:'local'},{headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});
}
