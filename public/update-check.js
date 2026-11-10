// Only a newer numeric release can prompt an update; offline failures are silent.
export function isNewerVersion(candidate, current) {
 const parse=value=>/^\d+\.\d+\.\d+$/.test(value)?value.split('.').map(Number):null;
 const next=parse(candidate),now=parse(current);if(!next||!now)return false;
 for(let i=0;i<3;i++){if(next[i]!==now[i])return next[i]>now[i];}
 return false;
}
export async function latestVersion(fetcher=fetch, clock=Date.now, {url='./release.js',parse}={}) {
 try {
  const response=await fetcher(`${url}${url.includes('?')?'&':'?'}update-check=${clock()}`,{cache:'no-store'});
  if(!response.ok)return null;
  const source=await response.text();
  return parse?parse(source):(/\bAPP_VERSION\s*=\s*['"](\d+\.\d+\.\d+)['"]/.exec(source)?.[1]??null);
 } catch {return null;}
}
export function startUpdateChecks({current,onUpdate,document:doc=document,window:win=window,fetcher=fetch,interval=300000,source}) {
 let checking=false,offered=null;
 const check=async()=>{
  if(checking||doc.hidden)return;
  checking=true;
  try {const version=await latestVersion(fetcher,Date.now,source);if(version&&version!==offered&&isNewerVersion(version,current)){offered=version;onUpdate(version);}}
  finally {checking=false;}
 };
 const visible=()=>{if(!doc.hidden)check();};
 doc.addEventListener('visibilitychange',visible);win.addEventListener('online',check);win.addEventListener('pageshow',visible);
 const timer=win.setInterval(check,interval);check();
 return ()=>{doc.removeEventListener('visibilitychange',visible);win.removeEventListener('online',check);win.removeEventListener('pageshow',visible);win.clearInterval(timer);};
}
