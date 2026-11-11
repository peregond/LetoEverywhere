import {STORY_VERSION} from './story-version.js?v=0.17.2';
import {readLocal,writeLocal} from './storage.js';
const fingerprint=save=>save?JSON.stringify([save.storyVersion,save.profile,save.node,save.index,save.flags,save.journal,save.log,save.rewind,save.chapterMarks]):null;
export class CloudProgress {
  constructor({getLocal,restore,changed}){Object.assign(this,{getLocal,restore,changed,user:null,ready:false,revision:null,syncedAt:null,pending:null,conflict:null,busy:false,message:'Проверяем аккаунт…'});window.addEventListener('online',()=>this.refresh());}
  emit(){this.changed();}
  async refresh(){
    if (window.Capacitor?.isNativePlatform() || globalThis.location?.hostname?.endsWith(".github.io")) { this.ready=true; this.message='Сохранено на устройстве'; this.emit(); return; }
    if(this.busy)return;
    try{
      const response=await fetch('/api/player',{cache:'no-store'});if(!response.ok)throw Error();
      const session=await response.json();this.user=session.user;this.legacyAvailable=session.legacyAvailable;this.ready=true;
      if(!this.user){this.message=this.getLocal()?'Сохранено на устройстве':'Можно играть без входа';this.emit();return;}
      const remoteResponse=await fetch('/api/progress',{cache:'no-store'});if(!remoteResponse.ok)throw Error();
      const remote=await remoteResponse.json(),local=this.getLocal(),link=readLocal('cloud-link',null);
      this.revision=remote.revision;this.syncedAt=remote.syncedAt;
      const olderStory=!!remote.progress&&remote.progress.storyVersion!==STORY_VERSION;
      if(olderStory){
        // Keep a device backup before a new playthrough replaces an older cloud revision.
        writeLocal('previous-story-progress',remote.progress);
        remote.progress=null;
        if(!local){this.message='Доступна новая история на 15 дней. Начни новую игру.';this.emit();return;}
      }
      if(!remote.progress){if(local&&link?.userId&&link.userId!==this.user.id){this.conflict=remote;this.message='Подтверди перенос прогресса';}else{this.message=local?'Синхронизируем…':'Аккаунт готов';if(local)this.queue(local);}}
      else if(!local){await this.restore(remote.progress);this.link(remote.progress);this.message='Загружено из аккаунта';}
      else if(fingerprint(local)===fingerprint(remote.progress)){this.link(local);this.message='Прогресс в аккаунте';}
      else if(link?.userId===this.user.id&&link.revision===remote.revision){this.queue(local);}
      else if(link?.userId===this.user.id&&link.fingerprint===fingerprint(local)){await this.restore(remote.progress);this.link(remote.progress);this.message='Загружено из аккаунта';}
      else{this.conflict=remote;this.message='Выбери сохранение';}
    }catch{this.ready=true;this.message=this.user?'Нет связи — прогресс на устройстве':'Облако временно недоступно';}
    this.emit();
  }
  link(progress){writeLocal('cloud-link',{userId:this.user.id,revision:this.revision,fingerprint:fingerprint(progress)});}
  queue(progress){this.pending=structuredClone(progress);if(!this.user||this.conflict)return;clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),550);}
  async flush(){
    if(!this.user||this.conflict||this.busy||!this.pending)return;
    const snapshot=this.pending;this.pending=null;this.busy=true;this.message='Синхронизируем…';this.emit();
    try{
      const response=await fetch('/api/progress',{method:'PUT',headers:{'Content-Type':'application/json','X-Game-Account':this.user.id},body:JSON.stringify({progress:snapshot,baseRevision:this.revision}),keepalive:JSON.stringify(snapshot).length<50000});
      const body=await response.json();
      if(response.status===401){this.user=null;this.pending??=snapshot;this.message='Войди снова для синхронизации';}
      else if(response.status===409){this.conflict=body;this.message='Выбери сохранение';}
      else if(!response.ok)throw Error(body.error);
      else{this.revision=body.revision;this.syncedAt=body.syncedAt;this.link(snapshot);this.message='Прогресс в аккаунте';}
    }catch{this.pending??=snapshot;this.message='Нет связи — прогресс на устройстве';}
    finally{this.busy=false;this.emit();}
    if(this.pending&&!this.conflict&&this.message==='Прогресс в аккаунте')this.queue(this.pending);
  }
  async useCloud(){
    if(!this.conflict?.progress)return;
    const remote=this.conflict;await this.restore(remote.progress);this.pending=null;this.revision=remote.revision;this.syncedAt=remote.syncedAt;this.link(remote.progress);this.conflict=null;this.message='Загружено из аккаунта';this.emit();
  }
  useLocal(){if(!this.conflict)return;this.revision=this.conflict.revision;this.conflict=null;const local=this.getLocal();if(local)this.queue(local);this.emit();}
}
