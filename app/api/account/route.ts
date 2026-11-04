import {env} from 'cloudflare:workers';
import {handleAccount} from '../../../lib/accounts.js';
export const dynamic='force-dynamic';
export async function POST(request:Request){
  if(!env.DB)return Response.json({error:'Хранилище временно недоступно.'},{status:503});
  const legacyId=request.headers.get('oai-authenticated-user-email')?request.headers.get('oai-authenticated-user-id'):null;
  return handleAccount(request,env.DB,legacyId);
}
