import {logVoice} from '../public/dialogue-voice.js';
import {readChapterMarks} from '../public/chapters.js';
import {NODES,JOURNAL,STORY_VERSION} from '../public/story.js';
import catalog from '../public/names.json' with {type:'json'};
import {readRewind} from '../public/rewind.js';
import {MAX_FLAGS,MAX_LOG_RECORDS} from '../public/save-limits.js';
export function normalizeProgress(input) {
  if(!input||input.formatVersion!==1||input.storyVersion!==STORY_VERSION)throw Error('Несовместимая версия сохранения.');
  const gender=input.profile?.gender;
  const name=catalog.genders[gender]?.names.find(n=>n.id===input.profile?.nameId);
  if(!name||!['male','female'].includes(gender))throw Error('Некорректный персонаж.');
  if(input.node!=='end'&&!Object.hasOwn(NODES,input.node))throw Error('Неизвестная сцена.');
  if(!Number.isInteger(input.index)||input.index<0||(input.node!=='end'&&input.index>=NODES[input.node].pages.length))throw Error('Некорректная реплика.');
  if(!Array.isArray(input.log)||input.log.length>MAX_LOG_RECORDS||input.log.some(e=>!e||typeof e.speaker!=='string'||e.speaker.length>100||typeof e.text!=='string'||e.text.length>4000))throw Error('Повреждён журнал реплик.');
  if(!Array.isArray(input.journal)||input.journal.length>300||input.journal.some(id=>!Object.hasOwn(JOURNAL,id)))throw Error('Повреждён дневник.');
  if(!input.flags||typeof input.flags!=='object'||Array.isArray(input.flags)||Object.keys(input.flags).length>MAX_FLAGS)throw Error('Повреждены выборы.');
  if(Object.values(input.flags).some(v=>!['string','boolean','number'].includes(typeof v)||(typeof v==='string'&&v.length>200)))throw Error('Повреждены выборы.');
  return {formatVersion:1,storyVersion:STORY_VERSION,profile:{gender,nameId:input.profile.nameId,namesCatalogVersion:catalog.version},node:input.node,index:input.node==='end'?0:input.index,flags:{...input.flags},journal:[...new Set(input.journal)],log:input.log.map(e=>({speaker:e.speaker,text:e.text,choice:!!e.choice,...logVoice(e)})),updatedAt:Number(input.updatedAt)||Date.now(),completed:input.node==='end',chapterMarks:readChapterMarks(input.chapterMarks,NODES,JOURNAL,input.log.length),rewind:readRewind(input.rewind,NODES,JOURNAL,input.log.length)};
}
