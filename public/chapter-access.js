// Preview access is a device preference, separate from story saves and workshop access.
import {readLocal,writeLocal} from './storage.js?v=0.17.2';
export const PUBLIC_LAST_DAY=15;
const normalizeCode=value=>typeof value==='string'?value.normalize('NFKC').trim().toLocaleLowerCase('ru'):'';
export const acceptsChapterCode=value=>['вучич','олег'].includes(normalizeCode(value));
export const hasPreviewAccess=()=>readLocal('preview-chapters',false)===true;
export const hasChapterDebugAccess=()=>readLocal('debug-chapters',false)===true;
export function unlockPreview(code){if(!acceptsChapterCode(code))return false;writeLocal('preview-chapters',true);if(normalizeCode(code)==='олег')writeLocal('debug-chapters',true);return true;}
export const chapterAvailable=(chapter,preview=false)=>!chapter?.day||chapter.day<=PUBLIC_LAST_DAY||preview;
