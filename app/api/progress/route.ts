import {env} from 'cloudflare:workers';
import {getAccount} from '../../../lib/accounts.js';
import {handleProgress} from '../../../lib/progress-api.js';
export const dynamic='force-dynamic';
async function handle(request:Request) {
  const user=env.DB?await getAccount(request,env.DB):null;
  if(!user)return Response.json({error:'Для синхронизации нужно войти.'},{status:401,headers:{'Cache-Control':'private, no-store'}});
  if(!env.DB)return Response.json({error:'Хранилище временно недоступно.'},{status:503,headers:{'Cache-Control':'private, no-store'}});
  return handleProgress(request,env.DB,user.userId);
}
export const GET=handle;export const PUT=handle;
