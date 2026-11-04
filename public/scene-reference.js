// Public references are derived from immutable scene IDs, never their position.
export function sceneCode(id){
  let hash=2166136261;
  for(const char of id){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}
  return 'SS-'+(hash>>>0).toString(36).toUpperCase().padStart(7,'0');
}
export function resolveSceneReference(nodes,reference){
  if(Object.hasOwn(nodes,reference))return reference;
  const code=String(reference||'').trim().toUpperCase();
  return Object.keys(nodes).find(id=>sceneCode(id)===code)||null;
}
export function sceneLink(id,base){
  const url=new URL(base);url.search='';url.hash='';url.searchParams.set('scene',sceneCode(id));return url.href;
}
