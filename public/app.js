import {mountCoinCatch} from './coin-catch.js?v=0.17.23';
import {mountFlatSettleQuest} from './flat-settle-quest.js?v=0.17.23';
import {mountWhiteCard} from './white-card.js?v=0.17.23';
import {arrivalPhoneFrame,ARRIVAL_PHONE_TEXT} from './arrival-phone.js?v=0.17.23';
import {mountPixelTram} from './pixel-tram.js?v=0.17.23';
import {rentalRedirect} from './rental-story.js?v=0.17.2';
import {RENTAL_NAMES,rentalOwner,rentalCounterpart} from './rental-people.js?v=0.17.2';
import {chapterAvailable,hasPreviewAccess,hasChapterDebugAccess} from './chapter-access.js?v=0.17.2';
import {renderHomeHero} from './home-hero.js?v=0.17.2';
import {renderEpisodeContact} from './episode-contact.js?v=0.17.23';
import {familySpeaker,familyText} from './family-contact.js?v=1';
import {drawChapterMap} from './chapter-map.js?v=0.17.23';
import {mountWorkshopEntry,mountWorkshop} from './workshop.js?v=0.17.23';
import {mountRoomInteraction} from './room-interaction.js?v=0.17.23';
import {mountDistrictMap,mountViewingQuest} from './scene-quests.js?v=0.17.23';
import {mountBankGuide} from './bank-guide.js?v=0.17.23';
import {BANK_FLAG} from './bank-data.js?v=1';
import {applyFlatEffect,viewMaskOf,setViewMask} from './flat-data.js?v=1';
import {renderArrivalPhone} from './arrival-phone.js?v=0.17.23';
import {mountMessenger} from './messenger.js?v=0.17.23';
import {messengerFrame,messageAt,visibleMessagePage} from './messenger-model.js?v=0.17.2';
import {MESSENGER_CONFIG} from './messenger-config.js?v=0.16.1';
import {ART_FRAMES,positionArtwork} from './art-framing.js?v=0.17.2';
import {t,html,initialiseLanguage,getLanguage,setLanguage,captureStaticUi,translateHistory} from './i18n.js?v=0.17.23';
import {STAGES} from './days.js?v=0.17.2';
import {MAX_LOG_RECORDS} from './save-limits.js?v=0.17.2';
import {cueFor} from './music-cues.js?v=0.17.2';
import {ambienceFor,stingFor} from './sound-cues.js?v=0.17.2';
import {setAmbience,playSting} from './sfx.js?v=0.17.2';
import {choiceVisible,applyRomanceEffect,nameOf,SLOTS} from './romance.js?v=0.17.2';
import {CHAPTERS,chapterFor,readChapterMarks,rememberChapter,restartChapter,jumpToChapter,continuationFor} from './chapters.js?v=0.17.2';
import {drawBeatAction} from './beat-action.js?v=0.17.23';
import {drawAccountForm,drawRecoveryCode} from './account-form.js?v=0.17.23';
import { NODES, JOURNAL, START, STORY_VERSION, BACKGROUNDS, CHARACTER_SPRITES, CHOICE_TONES, beatActionAt, presentationFor, pageText, resolveStoryText, interpolate } from './story.js?v=0.17.25';
import { loadSave, writeSave, readLocal, writeLocal } from './storage.js';
import {snapVolume,stepperMarkup,bindStepper} from './volume-steps.js?v=0.17.2';
import {clampSize,textLines,textSizeMarkup,bindTextSize} from './text-size.js?v=0.17.2';
import {splitToFit} from './text-fit.js?v=0.17.2';
import {THEME_ICONS} from './theme-icons.js?v=0.17.2';
import {panelToolButtons} from './panel-tools.js?v=0.17.2';
import {LOOKS,lookFor,defaultLook,avatarMarkup} from './hero-looks.js?v=0.17.2';
import {mountNamePicker} from './name-picker.js?v=0.17.2';
import {LANGUAGES,mountLanguageSwitch,markActiveLanguage} from './language-switch.js?v=0.17.2';
import {setSfxVolume} from './sfx.js?v=0.17.2';
import { setMusic, setVolume, setMusicScene } from './audio.js?v=0.17.2';
import {renderDistrictMap as drawDistrictMap} from './district-map.js?v=0.17.23';
import { CloudProgress } from './cloud.js?v=0.17.2';
import { rememberStep, rewindStep, readRewind } from './rewind.js?v=0.4.1';
import {dialogueVoice,logVoice,speakerIdentity} from './dialogue-voice.js?v=0.17.2';
import {appendChoiceContents} from './choice-ui.js?v=0.17.23';
import {mountBaggageInteraction} from './interaction.js?v=0.17.2';
import {APP_VERSION} from './release.js?v=0.17.25';
import {startUpdateChecks} from './update-check.js?v=0.17.24';

const $ = id => document.getElementById(id);
let translationsReady=false;
try{await initialiseLanguage();translationsReady=true;}catch{setLanguage('ru');}
const applyStaticLanguage=captureStaticUi(document);
applyStaticLanguage();
function updateLanguageUi(){document.documentElement.lang=getLanguage();document.querySelector('link[rel=manifest]').href=getLanguage()==='en'?'./manifest.en.webmanifest':'./manifest.webmanifest';document.title=t('Белградское лето — начало истории');markActiveLanguage(document,getLanguage());document.querySelectorAll('[data-app-version]').forEach(label=>{label.textContent=APP_VERSION;label.setAttribute('aria-label',t('Версия ')+APP_VERSION+' · '+t('История обновлений'));label.title=t('История обновлений');});}
updateLanguageUi();
const catalog = await fetch('./names.json').then(r => { if(!r.ok) throw new Error('Не удалось загрузить имена'); return r.json(); });
const settings = readLocal('settings', { textSize:18, music:false, volume:.55 });
settings.textSize = clampSize(settings.textSize);
settings.music = settings.music === true;
settings.volume = snapVolume(settings.volume,.55);
settings.sfxVolume = snapVolume(settings.sfxVolume,settings.volume);// first run after 0.16.7: sounds start at the music's level, as before
settings.theme=['system','light','dark'].includes(settings.theme)?settings.theme:'system';
const systemTheme=window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){const dark=settings.theme==='dark'||(settings.theme==='system'&&systemTheme.matches);document.documentElement.dataset.theme=dark?'dark':'light';document.querySelector('meta[name="theme-color"]').content=document.body.dataset.screen==='home'?'#102b46':['interaction','room-interaction','scene-quest'].includes(document.body.dataset.screen)?'#192e3a':document.body.dataset.screen==='messenger'?(dark?MESSENGER_CONFIG.chrome.dark:MESSENGER_CONFIG.chrome.light):document.body.dataset.screen==='chapter-card'?'#0a2630':dark?'#182a31':'#fff3d8';}
systemTheme.addEventListener('change',()=>{if(settings.theme==='system')applyTheme();});
applyTheme();
setVolume(settings.volume);setSfxVolume(settings.sfxVolume);
document.documentElement.style.setProperty('--text-size', settings.textSize+'px');
document.documentElement.style.setProperty('--text-lines', String(textLines(settings.textSize)));
let saved = null, state = null, view = 'home', creationStep = 0, transitionLock = false;
let sceneTest=null;
let draft = readLocal('draft', { gender:null, nameId:null });
const panel=$('panel');
// Icon buttons in the panel header (settings only): they stay for exactly one showModal() and are dropped by every other panel.
const panelTools=document.createElement('div');panelTools.className='panel-tools';let toolsFresh=false;
const nativeShowModal=panel.showModal.bind(panel);
let hideClose=false,soundPromptOpen=false;
// The music prompt has no close button, so Esc / the Android back gesture must not dismiss it without an answer (the game would not start).
panel.addEventListener('cancel',event=>{if(soundPromptOpen)event.preventDefault();});
panel.showModal=()=>{if(!toolsFresh)panelTools.remove();toolsFresh=false;$('close-panel').hidden=hideClose;hideClose=false;nativeShowModal();};
function setPanelTools(items){panelTools.replaceChildren(...panelToolButtons(items,t));$('close-panel').before(panelTools);toolsFresh=true;}
let cloud,authMode='login',recoveryCodeOnce=null;
let toastTimer;
let interactionDispose=null,messengerDispose=null,roomDispose=null,questDispose=null;
let arrivalPhoneNarration=false;
const ASYA_FIRST_THOUGHT='Вот и Ася, которая помогала мне с переездом. Интересно наконец увидеть её вживую: тёмная одежда, небрежные волосы — настоящий петербургский альтернативный образ.';
const CHAT_SWITCH_THOUGHT='Я закрываю переписку и вижу новое сообщение от Аси.';
const showChatSwitchThought=()=>state?.node==='chapter_four_close'&&state.index===2&&!state.flags.chapterFourChatTransition;
const showAsyaFirstThought=()=>/^flat_enter_(ana|stefan|marko|vuk)$/.test(state?.node??'')&&state.index===4&&!state.flags.asyaInPerson&&((state.flags.flatQuest??0)&15).toString(2).replaceAll('0','').length<=1;
let lastChapterId=null,wantCard=false,cardContext=null,lastStingNode=null;
// A line longer than the dialogue box is shown in several screens: textChunks, the one on view is chunkIndex.
let textChunks=[''],chunkIndex=0,chunkKey='',chunkWidth=0,showLastChunk=false;
// The chapter label above a line is for people coming into the game (new game, continue, chapter picked on the map); a chapter
// reached by playing was already announced by its title card. labelKey is the line the label belongs to.
let pendingLabel=false,labelKey='';
let currentArtFrame=null;
const preloadedBackgrounds=new Map();
const preloadedSprites=new Map();
function preloadBackground(id) {
  if(!Object.hasOwn(BACKGROUNDS,id)||preloadedBackgrounds.has(id))return;
  const image=new Image();image.src=`./assets/${id}.webp`;
  preloadedBackgrounds.set(id,image);
}
let spriteSwapToken=0,spriteShown=false;
// Swap the portrait only once the new pose is decoded, and cross-fade from a ghost of the old pose,
// so back/next never shows an empty frame or a dip in brightness.
function swapSprite(character,nextSrc){
  const token=++spriteSwapToken;
  const wasShown=spriteShown;spriteShown=true;
  if(character.src===nextSrc){character.style.visibility='';return;}
  if(!wasShown)character.style.visibility='hidden';
  const calm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const apply=()=>{
    if(token!==spriteSwapToken)return;
    const visible=wasShown;
    let ghost=null;
    if(visible&&!calm&&character.parentNode){ghost=character.cloneNode(false);ghost.removeAttribute('id');ghost.setAttribute('aria-hidden','true');ghost.alt='';ghost.style.pointerEvents='none';character.parentNode.insertBefore(ghost,character);}
    character.src=nextSrc;character.style.visibility='';
    if(ghost){const done=()=>ghost.remove();const fade=ghost.animate?.([{opacity:1},{opacity:0}],{duration:200,easing:'ease-out',fill:'forwards'});if(fade)fade.onfinish=done;else done();setTimeout(done,400);}
  };
  const probe=new Image();probe.src=nextSrc;
  if(probe.decode)probe.decode().then(apply,apply);else apply();
}
function preloadSprite(character,emotion='friendly') {
  const sprite=CHARACTER_SPRITES[character]?.[emotion];
  if(!sprite||preloadedSprites.has(sprite.file))return;
  const image=new Image();image.src=`./assets/${sprite.file}.webp`;preloadedSprites.set(sprite.file,image);
}

function named(profile) { return catalog.genders[profile.gender]?.names.find(n=>n.id===profile.nameId); }
function validProfile(profile) { return profile && ['male','female'].includes(profile.gender) && !!named(profile); }
function validateSave(input) {
  if (!input || input.formatVersion!==1 || input.storyVersion!==STORY_VERSION || !validProfile(input.profile)) throw new Error('Этот файл относится к другой версии истории. Для маршрута на 15 дней начни новую игру.');
  if (input.node!=='end' && !Object.hasOwn(NODES,input.node)) throw new Error('Неизвестная сцена в сохранении.');
  if (!Number.isInteger(input.index) || input.index<0 || (input.node!=='end' && input.index>=NODES[input.node].pages.length)) throw new Error('Не удалось восстановить реплику.');
  if (!Array.isArray(input.log) || input.log.length>MAX_LOG_RECORDS || !input.log.every(e=>e && typeof e.speaker==='string' && e.speaker.length<100 && typeof e.text==='string' && e.text.length<4000)) throw new Error('Повреждена история реплик.');
  if (!Array.isArray(input.journal) || input.journal.some(id=>!Object.hasOwn(JOURNAL,id))) throw new Error('Повреждён дневник.');
  if(!input.flags || typeof input.flags!=='object' || Array.isArray(input.flags)) throw new Error('Повреждены данные выборов.');
  return { formatVersion:1, storyVersion:STORY_VERSION, profile:{gender:input.profile.gender,nameId:input.profile.nameId,namesCatalogVersion:catalog.version}, node:input.node,index:input.node==='end'?0:input.index, flags:{...input.flags},journal:[...new Set(input.journal)],log:input.log.map(e=>({speaker:e.speaker,text:e.text,choice:!!e.choice,...logVoice(e)})),updatedAt:Number(input.updatedAt)||Date.now(),completed:input.node==='end',chapterMarks:readChapterMarks(input.chapterMarks,NODES,JOURNAL,input.log.length),rewind:readRewind(input.rewind,NODES,JOURNAL,input.log.length) };
}
try { const candidate=await loadSave(); if(candidate){saved=validateSave(candidate);rememberChapter(saved,NODES,true);} } catch { toast('Сохранение не прочиталось. Можно начать заново или импортировать файл.'); }
if(!['male','female'].includes(draft.gender)) draft={gender:null,nameId:null,look:null};
if(draft.gender&&!lookFor(draft.gender,draft.look)) draft.look=defaultLook(draft.gender);
if(draft.nameId && !named(draft)) draft.nameId=null;

function toast(text) {
  clearTimeout(toastTimer); $('toast').textContent=t(text); $('toast').hidden=false;
  toastTimer=setTimeout(()=>$('toast').hidden=true,3800);
}
function refreshMusicControls() {
  if($('music-toggle'))$('music-toggle').checked=settings.music;
}
async function applyMusic(enabled) {
  settings.music=enabled;settings.soundChosen=true;
  const ok=await setMusic(enabled);
  if(!ok){settings.music=false;toast('Коснись кнопки музыки ещё раз, чтобы разрешить звук.');}
  writeLocal('settings',settings);refreshMusicControls();
}
function chooseSound(continueGame) {
  setMusic(false);
  $('panel-title').textContent=t('Добавим музыку и звуки?');hideClose=true;
  $('panel-content').innerHTML=html('<p class="confirm-copy">Спокойная музыка и тихие звуки города для первого дня в Белграде. Включить?</p><div class="confirm-actions"><button id="sound-yes" class="primary">Включить</button><button id="sound-no" class="secondary">Без звука</button></div><p class="sound-hint">Звук и громкость всегда можно изменить в настройках.</p>');
  soundPromptOpen=true;
  for(const [id,enabled] of [['sound-yes',true],['sound-no',false]])$(id).addEventListener('click',()=>{soundPromptOpen=false;applyMusic(enabled);panel.close();continueGame();});
  panel.showModal();
}
function showInstallGuide() {
  if(panel.open)panel.close();
  $('panel-title').textContent=t('Игра на весь экран');
  const standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  const android=/Android/i.test(navigator.userAgent);
  $('panel-content').innerHTML=html(standalone
    ? '<p class="install-copy">Игра уже открыта с домашнего экрана. Панели Safari скрыты — можно погружаться в историю.</p>'
    : android?'<p class="install-copy">В Chrome открой меню ⋮ и выбери «Установить приложение» или «Добавить на главный экран». Затем запусти игру с новой иконки.</p>'
    : '<p class="install-copy">На iPhone игра открывается без адресной панели, когда запускается с домашнего экрана.</p><ol class="install-steps"><li>Открой эту страницу в Safari и нажми «Поделиться».</li><li>Выбери «На экран Домой». Если пункт спрятан, открой «Ещё».</li><li>Оставь включённым «Открывать как веб-приложение», если этот переключатель есть, и нажми «Добавить».</li></ol><p class="install-copy">Затем запусти «Сербское лето» с новой иконки. Чтобы перенести текущий прогресс, скачай сохранение в настройках и загрузи его после запуска.</p>');
  panel.showModal();
}
function showScreenInfo(){
  $('panel-title').textContent=t('Экран устройства');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const probe=document.createElement('div');probe.style.cssText='position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)';document.body.append(probe);const safe=getComputedStyle(probe);
  const rows=[['Режим',document.documentElement.dataset.standalone==='true'?'PWA / полный экран':'Вкладка браузера'],['Экран устройства',screen.width+' × '+screen.height],['Окно игры',innerWidth+' × '+innerHeight],['Видимая область',Math.round(visualViewport?.width??innerWidth)+' × '+Math.round(visualViewport?.height??innerHeight)],['Безопасные отступы',safe.paddingTop+' сверху / '+safe.paddingBottom+' снизу']];
  for(const [title,value]of rows){const p=document.createElement('p');p.className='screen-info-row';const label=document.createElement('strong');label.textContent=t(title);const detail=document.createElement('span');detail.textContent=t(value);p.append(label,detail);content.append(p);}probe.remove();
  const note=document.createElement('p');note.className='journal-intro';note.textContent=t('Эти сведения остаются на устройстве. Если нижняя полоса сохраняется, этот экран поможет отличить размер страницы от области, которую предоставляет iOS.');
  const reload=document.createElement('button');reload.className='primary';reload.textContent=t('Обновить приложение');reload.addEventListener('click',()=>location.reload());content.append(note,reload);
}
async function requestImmersiveMode() {
  if(document.fullscreenElement){await document.exitFullscreen();return;}
  if(document.fullscreenEnabled&&document.documentElement.requestFullscreen){
    try{await document.documentElement.requestFullscreen();return;}catch{}
  }
  showInstallGuide();
}
function showScreen(id) {
  if(view==='room-interaction'){roomDispose?.();roomDispose=null;}
  if(view==='interaction'&&id!=='interaction'){interactionDispose?.();interactionDispose=null;}
  if(view==='messenger'){messengerDispose?.();messengerDispose=null;}
  if(view==='scene-quest'&&id!=='scene-quest'){questDispose?.();questDispose=null;}
  view=id;
  $('home-art').hidden=id!=='home';
  document.body.dataset.screen=id;
  document.documentElement.dataset.screen=id;
  applyTheme();
  document.querySelectorAll('.screen').forEach(el=>el.hidden=el.id!==id);
  window.scrollTo(0,0);
}
function home() {
  renderHomeHero($('home'),$('home-art'),$('home-cast'),saved);
  setMusicScene('prologue');setAmbience(null);lastStingNode=null;
  $('new-game').disabled=false;
  $('resume').hidden=!saved;
  $('new-game').classList.toggle('secondary-light',!!saved);
  $('new-game').textContent=t(saved?'Новая игра':'Начать игру');
  showScreen('home');fitScene();
}
function save() {
  if(!state||sceneTest) return;
  state.updatedAt=Date.now(); saved=structuredClone(state);
  cloud?.queue(state);
  const at=state.updatedAt;
  writeSave(state).then(ok=>{
    if(state?.updatedAt!==at) return;
    $('save-status').textContent=t(ok?'Сохранено на этом устройстве':'Сохранение недоступно — экспортируй прогресс');
    $('save-status').classList.toggle('save-warning',!ok);
  });
}
function renderAdultChoice(visible) {
  const box=$('adult-choice');box.hidden=!visible;if(!visible)return;
  const title=$('adult-choice-title');title.replaceChildren(t('Взрослые сцены · 18+'));
  const note=document.createElement('small');note.textContent=t('Близость без подробностей, только по взаимному согласию. Это можно изменить в настройках в любой момент.');title.append(note);
  $('adult-choice-toggle').checked=!!settings.adult;
}
function beginCreation() { creationStep=0;renderCreation(); }
const GENDER_ICON={
  male:'<svg class="gender-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/></svg>',
  female:'<svg class="gender-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="9" r="5"/><path d="M12 14v8M9 19h6"/></svg>'
};
function renderCreation() {
  showScreen('creation');
  const screen=$('creation'),options=$('creation-options');options.replaceChildren();
  // restart the entrance animation once per step (never on a tap inside the step)
  screen.classList.remove('animate');void screen.offsetWidth;screen.classList.add('animate');
  $('step-label').textContent=`${creationStep+1} / 2`;
  [...$('step-bar').children].forEach((bar,i)=>bar.classList.toggle('on',i<=creationStep));
  $('creation-title').textContent=t(creationStep===0?'Кем ты будешь?':'Как тебя зовут?');
  $('creation-description').textContent=t(creationStep===0?'Выбери героя и внешность.':'Начни вводить имя или выбери из списка.');
  $('name-preview').hidden=true;
  renderAdultChoice(creationStep===0);
  $('creation-next').textContent=t(creationStep===0?'Дальше →':'Начать историю →');
  $('creation-next').disabled=creationStep===0?!draft.gender:!validProfile(draft);
  if(creationStep===0) renderHeroStep(options); else renderNameStep(options);
}
function renderHeroStep(options) {
  options.className='hero-setup';
  const genders=document.createElement('div');genders.className='gender-options';
  const looks=document.createElement('section');looks.className='look-section';looks.setAttribute('aria-labelledby','look-title');
  const title=document.createElement('p');title.id='look-title';title.className='look-title';title.textContent=t('Внешность');
  const row=document.createElement('div');row.className='look-options';row.setAttribute('role','radiogroup');row.setAttribute('aria-labelledby','look-title');
  const hint=document.createElement('p');hint.className='look-hint';hint.setAttribute('aria-live','polite');
  looks.append(title,row,hint);
  const genderButtons=new Map();
  const paintLooks=()=>{
    looks.hidden=!draft.gender;row.replaceChildren();if(!draft.gender)return;
    for(const look of LOOKS[draft.gender]){
      const button=document.createElement('button');button.type='button';button.className='look-option';button.setAttribute('role','radio');
      button.setAttribute('aria-checked',String(draft.look===look.id));button.setAttribute('aria-label',t(look.label));button.innerHTML=avatarMarkup(draft.gender,look.id,{size:64});
      button.addEventListener('click',()=>{draft.look=look.id;writeLocal('draft',draft);for(const other of row.children)other.setAttribute('aria-checked',String(other===button));hint.textContent=t(look.label);});
      row.append(button);
    }
    hint.textContent=t(lookFor(draft.gender,draft.look)?.label??'');
  };
  for(const [gender,description] of [['male','«Ты уже добрался?»'],['female','«Ты уже добралась?»']]) {
    const button=document.createElement('button');button.type='button';button.className='gender-option';button.setAttribute('aria-pressed',String(draft.gender===gender));
    button.insertAdjacentHTML('beforeend',GENDER_ICON[gender]);
    const strong=document.createElement('strong');strong.textContent=t(catalog.genders[gender].label);
    const small=document.createElement('small');small.textContent=t(description);button.append(strong,small);
    button.addEventListener('click',()=>{
      if(draft.gender!==gender){draft.nameId=null;draft.gender=gender;draft.look=defaultLook(gender);writeLocal('draft',draft);paintLooks();}
      for(const [key,other] of genderButtons)other.setAttribute('aria-pressed',String(key===gender));
      $('creation-next').disabled=false;
    });
    genderButtons.set(gender,button);genders.append(button);
  }
  paintLooks();options.append(genders,looks);
}
function updateNamePreview() {
  $('creation-next').disabled=!validProfile(draft);
  const preview=$('name-preview');
  if(!validProfile(draft)){preview.hidden=true;return;}
  const name=named(draft);preview.hidden=false;preview.textContent=t(getLanguage()==='en'?`‘${t(name.familiar.nominative)}, have you arrived yet?’`:`«${name.familiar.nominative}, ты уже ${draft.gender==='female'?'добралась':'добрался'}?»`);
  const hint=document.createElement('small');hint.textContent=t(getLanguage()==='en'?`${t(name.full.nominative)} for introductions. ${t(name.familiar.nominative)} with friends.`:`${name.full.nominative} — для знакомства. ${name.familiar.nominative} — для своих.`);preview.append(hint);
}
function renderNameStep(options) {
  options.className='name-step';
  mountNamePicker(options,{
    names:catalog.genders[draft.gender].names,selectedId:draft.nameId,label:text=>t(text),
    placeholder:t('Начни вводить имя'),listLabel:t('Имя героя'),avatar:avatarMarkup(draft.gender,draft.look,{size:52}),
    onSelect:id=>{draft.nameId=id;writeLocal('draft',draft);updateNamePreview();},
    onClear:()=>{draft.nameId=null;writeLocal('draft',draft);updateNamePreview();}
  });
  updateNamePreview();
}
function startGame() {
  if(!validProfile(draft))return;
  state={formatVersion:1,storyVersion:STORY_VERSION,profile:{gender:draft.gender,nameId:draft.nameId,namesCatalogVersion:catalog.version},node:START,index:0,flags:{rentalCast:'new',heroLook:lookFor(draft.gender,draft.look)?draft.look:defaultLook(draft.gender)},journal:[],log:[],rewind:[],completed:false,updatedAt:Date.now()};
  if(settings.music) applyMusic(true);
  enterNode(START);recordPage();save();pendingLabel=true;renderGame();
}
function speakerName(page,locale=getLanguage()) {
  const names={contact:state.flags.companion==='nikola'?'Никола':'Милица',host:state.flags.host==='jelena'?'Йелена':'Драган',districtHost:RENTAL_NAMES[rentalOwner(state.flags)]??(state.flags.districtOwner==='jelena'?'Йелена':'Драган'),bankStaff:state.flags.bankSpark==='teodora'?'Теодора':'Лазар',mupStaff:state.flags.mupSpark==='strahinya'?'Страхиня':'Ивана',lovePartner:SLOTS.includes(state.flags.lastPartner)?nameOf(state.flags.lastPartner,state.flags):'Ася',contactCounterpart:state.flags.companion==='nikola'?'Милица':'Никола',ownerCounterpart:RENTAL_NAMES[rentalCounterpart(state.flags)]??(state.flags.districtOwner==='jelena'?'Драган':'Йелена'),narrator:named(state.profile).full.nominative,player:named(state.profile).full.nominative,milica:'Милица',nikola:'Никола'};
  const oldHost=state.flags.rentalCast==='new'&&state.node==='d20_nephew'&&page.speaker==='districtHost';
  return t(familySpeaker(oldHost?names.host:(names[page.speaker]??page.speaker)),locale);
}
function currentPage() {return NODES[state.node].pages[state.index];}
function recordPage() {const page=currentPage(),chat=messageAt(state.node,NODES[state.node],state.index,state.flags);state.log.push({speaker:speakerName(page,'ru'),text:interpolate(pageText(page,state.flags,'ru'),state.profile,catalog,'ru'),choice:false,voice:chat?'message':dialogueVoice(page),...(chat?{chatContact:chat.contact,chatDirection:chat.direction,chatScene:state.node,chatTime:chat.time,chatIndex:state.index,chatKind:'page'}:{})});}
function enterNode(id) {
  id=rentalRedirect(state?.node,id,state?.flags);
  // Intimate scenes are an option: with adult scenes switched off the story simply moves on to the morning.
  if(NODES[id]?.adult&&!settings.adult)id=NODES[id].skipTo;
  state.node=id;state.index=visibleMessagePage(id,0);
  if(id==='end') {state.completed=true;return;}
  Object.assign(state.flags,NODES[id].effectOnEnter??{});applyFlatEffect(state.flags,NODES[id].effectOnEnter);
  for(const entry of NODES[id].journal??[]) if(!state.journal.includes(entry))state.journal.push(entry);
  rememberChapter(state,NODES);
}
function showChapterLock(){
  cardContext=null;
  showScreen('chapter-card');
  const root=$('chapter-card');root.replaceChildren();
  const box=document.createElement('div');box.className='chapter-card-inner';
  const title=document.createElement('h2');title.textContent=t('Продолжение пока закрыто');
  const copy=document.createElement('p');copy.textContent=t('Открыты дни 1–5. Дальнейшие главы доступны по промокоду. Твой прогресс сохранён.');
  const settingsButton=document.createElement('button');settingsButton.className='primary';settingsButton.textContent=t('Ввести промокод');settingsButton.onclick=()=>openPanel('settings');
  const menu=document.createElement('button');menu.className='secondary';menu.textContent=t('На главный экран');menu.onclick=home;
  box.append(title,copy,settingsButton,menu);root.append(box);
}
function renderGame({skipMessenger=false}={}) {
  state.index=visibleMessagePage(state.node,state.index);
  if(pendingLabel){labelKey=state.node+'|'+state.index;pendingLabel=false;}
  if(!sceneTest&&!chapterAvailable(chapterFor(state,NODES),hasPreviewAccess()))return showChapterLock();
  if(state.node==='end')return renderEnding();
  rememberChapter(state,NODES,true);
  const node=NODES[state.node],asyaIntro=showAsyaFirstThought(),chatTransition=showChatSwitchThought(),page=asyaIntro?{speaker:'narrator',text:ASYA_FIRST_THOUGHT,character:'asya',emotion:'friendly'}:chatTransition?{speaker:'narrator',text:CHAT_SWITCH_THOUGHT}:currentPage();
  const presentation=presentationFor(node,page,state.flags,state.profile);
  const soundScene={...node,bg:presentation.bg,time:presentation.time};
  setMusicScene(cueFor(soundScene));setAmbience(ambienceFor(soundScene));
  if(state.node!=='quick_arrival'||state.index!==2)arrivalPhoneNarration=false;
  if(state.node==='keys_room'&&state.index===3)return openRoomInteraction();
  if(state.node==='flat_settle'&&state.index===2)return openFlatSettleQuest();
  if(state.node==='host_terrace'&&state.index===node.pages.length-1)return openMealMenu();
  if(node.map)return openDistrictMap();
  if(page.action?.quest==='coin-catch')return openCoinCatch();
  if(page.action?.quest==='white-card')return openWhiteCard();
  if(page.action?.quest==='pixel-tram')return openPixelTram();
  if(page.action?.quest==='viewing')return openViewingQuest();
  if(page.action?.quest==='bank-guide')return openBankGuide();
  if(state.node==='night_messages'&&state.index===4)return openRoomInteraction('bedtime');
  const chapter=chapterFor(state,NODES);
  const cardWanted=wantCard,previousChapter=lastChapterId;wantCard=false;lastChapterId=chapter.id;
  if(state.node!==lastStingNode){lastStingNode=state.node;const sting=stingFor(state.node);if(sting)playSting(sting);}
  if(state.node==='quick_arrival'&&state.index===2&&!arrivalPhoneNarration){
    showScreen('messenger');messengerDispose=mountMessenger($('messenger'),arrivalPhoneFrame(),{
      canRewind:!!state.rewind?.length,onBack:goBack,onMenu:()=>openPanel('game-menu'),onSettings:()=>openPanel('settings'),onSend:()=>false,
      onContinue:()=>{arrivalPhoneNarration=true;if(!state.log.some(entry=>entry.chatPhoto==='arrival-door')){state.log.push({speaker:'Драган',text:ARRIVAL_PHONE_TEXT,choice:false,voice:'message',chatContact:'Драган',chatDirection:'incoming',chatScene:'arrival-phone',chatPhoto:'arrival-door'});save();}renderGame();}
    });return;
  }
  const frame=!skipMessenger&&!chatTransition&&messengerFrame({sceneId:state.node,node,index:state.index,flags:state.flags,journal:state.journal,log:state.log,historyText:value=>translateHistory(familyText(value),state.profile,catalog),profile:state.profile,action:beatActionAt(node,state.index),text:p=>t(interpolate(pageText(p,state.flags),state.profile,catalog)),choiceText:value=>interpolate(resolveStoryText(value,state.flags),state.profile,catalog)});
  if(frame){
    renderMessenger(frame);
    if(cardWanted&&previousChapter&&(previousChapter!==chapter.id&&state.node===chapter.start&&state.index===0||previousChapter!==chapter.id&&state.node==='rental_day_'+chapter.day&&state.index===0))showChapterCard(CHAPTERS.find(c=>c.id===previousChapter),chapter);
    return;
  }
  showScreen('game');
  const sceneElement=$('scene');
  sceneElement.style.backgroundImage=`url('./assets/${presentation.bg}.webp')`;
  sceneElement.style.backgroundPosition=presentation.position;
  sceneElement.dataset.background=presentation.bg;
  sceneElement.classList.toggle('is-daydream',presentation.daydream);
  let carrierSign=sceneElement.querySelector('.carrier-sign');
  if(node.carrierBrand&&!carrierSign){carrierSign=document.createElement('div');carrierSign.className='carrier-sign';sceneElement.append(carrierSign);}
  if(carrierSign){carrierSign.hidden=!node.carrierBrand;carrierSign.textContent=node.carrierBrand??'';carrierSign.dataset.carrier=(node.carrierBrand??'').toLowerCase();}
  sceneElement.classList.toggle('is-night',node.lighting==='night');
  sceneElement.classList.toggle('dragan-date',node.lighting==='night'&&(state.flags.host??'dragan')==='dragan'&&EVENING_NODES.includes(state.node));
  sceneElement.classList.toggle('is-map',!!node.map);
  sceneElement.classList.toggle('is-insert',presentation.insert);
  sceneElement.classList.toggle('is-seated',presentation.seated);
  sceneElement.classList.toggle('has-composite',presentation.composite);
  sceneElement.classList.toggle('has-kitchen-layers',!!presentation.kitchenLayers);
  sceneElement.dataset.kitchenMood=presentation.kitchenLayers?presentation.emotion:'';
  let kitchenTable=sceneElement.querySelector('.kitchen-table');
  if(presentation.kitchenLayers&&!kitchenTable){kitchenTable=document.createElement('div');kitchenTable.className='kitchen-table';sceneElement.append(kitchenTable);}
  if(kitchenTable)kitchenTable.hidden=!presentation.kitchenLayers||!presentation.occludeTable;
  currentArtFrame=ART_FRAMES[presentation.cg??presentation.bg];
  const cg=$('scene-cg');cg.hidden=!presentation.composite;
  if(presentation.composite)cg.src=`./assets/${presentation.cg??presentation.bg}.webp`;
  $('game').classList.toggle('has-map',!!node.map);
  drawDistrictMap($('district-map'),node,choose,choice=>choiceVisible(choice,state.flags));
  sceneElement.setAttribute('aria-label',t(presentation.description));
  preloadBackground(presentation.bg);
  // Load just the next frame or the two immediate branches, rather than the whole chapter.
  if(node.pages[state.index+1]) {
    const nextPresentation=presentationFor(node,node.pages[state.index+1],state.flags,state.profile);
    preloadBackground(nextPresentation.bg);preloadSprite(nextPresentation.character,nextPresentation.emotion);
  }
  else for(const next of node.choices?node.choices.map(choice=>choice.next):[node.next]) {
    if(NODES[next]) {
      const nextPresentation=presentationFor(NODES[next],NODES[next].pages[0],state.flags,state.profile);
      preloadBackground(nextPresentation.bg);preloadSprite(nextPresentation.character,nextPresentation.emotion);
    }
  }
  renderEpisodeContact($('episode-contact'),state.node==='road_contact'&&state.index===2?null:presentation.contactPortrait);
  const character=$('milica');const portrait=presentation.character;
  character.hidden=!portrait;
  if(portrait){const sprite=CHARACTER_SPRITES[portrait][presentation.emotion];const nextSrc=new URL(`./assets/${sprite.file}.webp`,location.href).href;character.alt=t(sprite.alt);preloadSprite(portrait,presentation.emotion);swapSprite(character,nextSrc);}
  else{spriteSwapToken++;spriteShown=false;character.style.visibility='';}
  $('location').textContent=t(presentation.location);$('scene-time').textContent=t(presentation.time);
  document.querySelector('.scene-caption>span:last-child').textContent=t(node.day??'ПЕРВЫЙ ДЕНЬ');
  $('speaker').textContent=t(speakerName(page));
  $('game').dataset.voice=dialogueVoice(page);
  $('game').dataset.speaker=speakerIdentity(page,state.flags);
  $('voice-label').textContent=t(presentation.daydream?'Воображение':page.speaker==='narrator'?'Про себя':page.speaker==='player'?'Вслух':'');
  $('voice-label').hidden=!$('voice-label').textContent;
  const text=$('dialogue-text');text.classList.toggle('message',!!page.message);
  const full=t(interpolate(pageText(page,state.flags),state.profile,catalog));
  const key=[state.node,state.index,getLanguage(),settings.textSize,text.clientWidth,page.message?1:0,asyaIntro?1:0].join('|');
  const fresh=key!==chunkKey;
  if(fresh){chunkKey=key;chunkWidth=text.clientWidth;textChunks=splitToFit(full,candidate=>{text.textContent=candidate;return text.scrollHeight<=text.clientHeight+1;});chunkIndex=showLastChunk?textChunks.length-1:0;}
  showLastChunk=false;chunkIndex=Math.min(chunkIndex,textChunks.length-1);text.textContent=textChunks[chunkIndex];
  // choices and actions wait for the last screen of the line
  const lastChunk=chunkIndex===textChunks.length-1;
  const isChoice=lastChunk&&state.index===node.pages.length-1&&!!node.choices;
  const action=lastChunk&&!asyaIntro?beatActionAt(node,state.index):null;
  const inlineAction=!!action&&action.kind!=='tap';
  $('game').classList.toggle('has-beat',inlineAction);
  drawBeatAction($('beat-action'),$('beat-hotspots'),action,{text:value=>interpolate(resolveStoryText(value,state.flags),state.profile,catalog),perform:performBeat,tones:CHOICE_TONES,node,flags:state.flags});
  $('rewind').disabled=!state.rewind?.length&&chunkIndex===0;
  $('game').classList.toggle('has-choices',isChoice||inlineAction);
  $('next').hidden=isChoice||inlineAction;$('choices').hidden=!isChoice;$('choices').replaceChildren();
  const shownChoices=isChoice?node.choices.filter(each=>choiceVisible(each,state.flags,state.profile)):[];
  // four or more choices get slimmer buttons, so the picture does not shrink too much
  $('choices').dataset.compact=String(shownChoices.length>=4);
  $('choices').dataset.scrollable=String(shownChoices.length>6);
  if(isChoice)for(const choice of shownChoices) {
    const button=document.createElement('button');button.type='button';button.className='choice';button.dataset.tone=choice.tone;
    appendChoiceContents(button,choice,{text:value=>interpolate(resolveStoryText(value,state.flags),state.profile,catalog),tones:CHOICE_TONES,node,flags:state.flags});
    button.addEventListener('click',()=>choose(choice));$('choices').append(button);
  }
  $('journal-dot').hidden=state.journal.length===0;

  $('chapter-progress').textContent=t(chapter.number+' · Главы ↗');
  $('chapter-heading').hidden=labelKey!==state.node+'|'+state.index;
  $('chapter-heading').textContent=t(chapter.number+' · '+chapter.title);
  $('scene-day').textContent=t(node.day??'ПЕРВЫЙ ДЕНЬ');
  fitScene();
  // A step that crosses into a new chapter gets a title card (and a reminder to save progress for guests).

  if(cardWanted&&previousChapter&&(previousChapter!==chapter.id&&state.node===chapter.start&&state.index===0||previousChapter!==chapter.id&&state.node==='rental_day_'+chapter.day&&state.index===0))showChapterCard(CHAPTERS.find(c=>c.id===previousChapter),chapter);
}
// A guest is somebody the cloud has finished checking who is not signed in; nobody is nagged while the check is still running.
function isGuest(){return !!cloud?.ready&&!cloud.user;}
function drawSavePrompt(){
  const box=document.createElement('div');box.className='save-prompt';
  const title=document.createElement('strong');title.textContent=t('Сохрани прогресс');
  const text=document.createElement('p');text.textContent=t('Сейчас история хранится только на этом устройстве. Создай аккаунт, чтобы не потерять её и продолжить с другого телефона.');
  const create=document.createElement('button');create.type='button';create.className='secondary';create.textContent=t('Создать аккаунт');create.addEventListener('click',()=>{authMode='register';openAccount();});
  const login=document.createElement('button');login.type='button';login.className='text-button';login.textContent=t('Уже есть аккаунт? Войти');login.addEventListener('click',()=>{authMode='login';openAccount();});
  box.append(title,text,create,login);return box;
}
function drawEndingPrompt(){
  document.querySelector('#ending .save-prompt')?.remove();
  if(isGuest())document.querySelector('#ending .ending-inner').insertBefore(drawSavePrompt(),document.querySelector('#ending .ending-actions'));
}
function drawChapterCard(previous,next){
  const card=$('chapter-card');card.replaceChildren();
  const nav=document.createElement('nav');nav.className='chapter-card-tools';nav.setAttribute('aria-label',t('Игровое меню'));
  for(const [selector,label,action] of [
    ['.game-tools [data-action="game-menu"]','Меню',()=>openPanel('game-menu')],
    ['.home-utilities [data-action="chapters"]','Главы',openChapters],
    ['.game-tools [data-action="settings"]','Настройки',()=>openPanel('settings')]
  ]){
    const button=document.querySelector(selector).cloneNode(true);button.removeAttribute('data-action');button.setAttribute('aria-label',t(label));button.title=t(label);button.addEventListener('click',action);nav.append(button);
  }
  card.append(nav);
  if(next.id==='arrival'||(next.day&&next.day<=5)){
    const images={arrival:'courtyard-door',1:'belgrade-courtyard-morning',2:'bank-consultation',3:'belgrade-kiosk-street',4:'belgrade-courtyard',5:'belgrade-river-noon'};
    card.style.backgroundImage=`linear-gradient(180deg,#10263255 0%,#10263299 50%,#0b1c2de8 100%),url('./assets/${images[next.day??next.id]}.webp')`;
    const box=document.createElement('div');box.className='chapter-card-inner chapter-card-simple';
    const eyebrow=document.createElement('p');eyebrow.className='chapter-card-eyebrow';eyebrow.textContent=t(previous?.id==='prologue'?'Пролог завершён':'Следующая глава');
    const title=document.createElement('h2');title.id='chapter-card-title';title.className='chapter-card-title';title.textContent=t(next.title);
    const label=document.createElement('p');label.className='chapter-card-description';label.textContent=next.day?t(next.number):t('Следующая глава');
    box.append(eyebrow,title,label);
    if(isGuest()){
      const copy=document.createElement('p');copy.className='chapter-card-save-copy';copy.textContent=t('Сохрани прогресс: создай аккаунт или войди.');
      const account=document.createElement('button');account.type='button';account.className='secondary chapter-card-account';account.textContent=t('Создать аккаунт или войти');account.addEventListener('click',()=>{authMode='register';openAccount();});box.append(copy,account);
    }
    const start=document.createElement('button');start.type='button';start.id='chapter-card-start';start.className='primary';start.textContent=t('Продолжить историю');start.addEventListener('click',()=>{cardContext=null;renderGame();});box.append(start);card.append(box);return;
  }
  card.style.backgroundImage='';
  const inner=document.createElement('div');inner.className='chapter-card-inner';
  const add=(tag,className,text)=>{const element=document.createElement(tag);element.className=className;element.textContent=text;inner.append(element);return element;};
  if(previous?.day||previous?.id==='arrival')add('p','chapter-card-done','✓ '+t(previous.number)+' '+t('завершён')+' · '+t(previous.title));
  add('p','chapter-card-eyebrow',next.day?`${t('ДЕНЬ')} ${next.day} ${t('ИЗ 15')} · ${t(STAGES[next.stage]).toUpperCase()}`:t(next.id==='arrival'?'ПЕРЕД ПЕРВЫМ ДНЁМ':'ПРОЛОГ'));
  const heading=add('h2','chapter-card-number',t(next.number));heading.id='chapter-card-title';
  add('p','chapter-card-title',t(next.title));
  add('p','chapter-card-description',t(next.description));
  if(next.day){
    const progress=document.createElement('div');progress.className='chapter-card-progress';progress.setAttribute('role','img');progress.setAttribute('aria-label',`${t('День')} ${next.day} ${t('из 15')}`);
    for(let day=1;day<=15;day++){const dot=document.createElement('span');if(day<next.day)dot.className='done';else if(day===next.day)dot.className='current';progress.append(dot);}
    inner.append(progress);
  }
  if(isGuest())inner.append(drawSavePrompt());
  const start=document.createElement('button');start.type='button';start.id='chapter-card-start';start.className='primary';start.textContent=next.day?`${t('Начать день')} ${next.day}`:t('Начать');
  start.addEventListener('click',()=>{cardContext=null;renderGame();});
  inner.append(start);card.append(inner);
}
function showChapterCard(previous,next){
  playSting('chime');
  cardContext={previous,next};drawChapterCard(previous,next);showScreen('chapter-card');
  $('chapter-card-start').focus({preventScroll:true});
}
function renderMessenger(frame) {
  showScreen('messenger');
  let committed=false;
  messengerDispose=mountMessenger($('messenger'),frame,{
    canRewind:!!state.rewind?.length,
    onBack:goBack,
    onMenu:()=>openPanel('game-menu'),
    onSettings:()=>openPanel('settings'),
    onSend:reply=>{
      const chat=reply?{contact:frame.contact,text:state.node==='courtyard_arrival'&&state.index===2?(reply.option.next==='meet_dragan'?'Подожду вас во дворе. До встречи!':'Тогда попрошу Йелену встретить меня сейчас. Спасибо!'):reply.option.chatText??reply.option.label}:null;
      const ok=reply?(frame.replyKind==='inline'?advance({render:false,message:reply.option.label,chat}):frame.replyKind==='action'?performBeat(reply.option,{render:false,chat}):choose(reply.option,{render:false,chat})):advance({render:false});
      committed=!!ok;return committed;
    },
    onContinue:()=>{
      if(committed)return renderGame();
      if(frame.physicalAction)return renderGame({skipMessenger:true});
      advance();
    }
  });
}
function fitScene() {
  document.documentElement.dataset.standalone=String(window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches||!!navigator.standalone);
  // Very short viewports and enlarged type remain readable through natural page scrolling.
  requestAnimationFrame(()=>{
    const game=$('game');if(game.hidden)return;
    if($('scene').classList.contains('has-kitchen-layers')){const scale=Math.max($('scene').clientWidth/1024,$('scene').clientHeight/1536);$('scene').style.setProperty('--kitchen-table-top',Math.min($('scene').clientHeight,1536*.70*scale)+'px');}
    const sceneMinimum=parseFloat(getComputedStyle($('scene')).minHeight)||145;
    const minimum=document.querySelector('.dialogue').offsetHeight+document.querySelector('.game-footer').offsetHeight+sceneMinimum;
    game.style.minHeight=minimum+'px';
    if(!$('scene-cg').hidden)positionArtwork($('scene-cg'),$('scene'),currentArtFrame,{top:parseFloat(getComputedStyle(document.querySelector('.game-header')).paddingTop)+2,bottom:8,left:8,right:8});
  });
}
function advance({render=true,message=null,chat=null}={}) {
  if(!['game','messenger'].includes(view)||panel.open||transitionLock)return false;
  // a long line goes on to its next screen first
  if(view==='game'&&chunkIndex<textChunks.length-1){chunkIndex++;if(render)renderGame();return true;}
  if(view==='game'&&showAsyaFirstThought()){
    rememberStep(state);state.flags.asyaInPerson=true;
    state.log.splice(Math.max(0,state.log.length-1),0,{speaker:speakerName({speaker:'narrator'},'ru'),text:ASYA_FIRST_THOUGHT,choice:false,voice:'thought'});
    save();if(render)renderGame();return true;
  }
  if(view==='game'&&showChatSwitchThought()){
    rememberStep(state);state.flags.chapterFourChatTransition=true;
    state.log.splice(Math.max(0,state.log.length-1),0,{speaker:speakerName({speaker:'narrator'},'ru'),text:CHAT_SWITCH_THOUGHT,choice:false,voice:'thought'});
    save();if(render)renderGame();return true;
  }
  const node=NODES[state.node];
  const action=beatActionAt(node,state.index);
  if(action?.kind==='tap')return action.interaction==='baggage'?openBaggage():performBeat({}, {render});
  if((state.index===node.pages.length-1&&node.choices)||action)return;
  rememberStep(state);
  if(message)state.log.push({speaker:speakerName({speaker:'player'},'ru'),text:interpolate(resolveStoryText(message,state.flags,'ru'),state.profile,catalog,'ru'),choice:false,voice:'message',chatContact:chat?.contact,chatDirection:'outgoing',chatScene:state.node,chatIndex:state.index,chatKind:'reply'});
  transitionLock=true;setTimeout(()=>transitionLock=false,120);
  if(state.index<node.pages.length-1)state.index=visibleMessagePage(state.node,state.index+((state.node==='afternoon_invite'&&state.index===0&&state.flags.eveningIntroShown)?2:1));
  else enterNode(node.next);
  if(state.node!=='end')recordPage();
  wantCard=true;save();if(render)renderGame();return true;
}
function openRoomInteraction(mode='arrival'){
  const maskKey=mode==='bedtime'?'nightSettlingMask':'roomSettlingMask', versionKey=mode==='bedtime'?'nightQuestVersion':'roomQuestVersion';
  if(!state.flags[versionKey]){if(state.flags[maskKey]===7)state.flags[maskKey]=0;state.flags[versionKey]=2;save();}
  showScreen('room-interaction');
  roomDispose=mountRoomInteraction($('room-interaction'),{mode,mask:state.flags[mode==='bedtime'?'nightSettlingMask':'roomSettlingMask']??0,canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),onChange:mask=>{state.flags[mode==='bedtime'?'nightSettlingMask':'roomSettlingMask']=mask;save();},onComplete:()=>{showScreen('game');performBeat({effect:mode==='bedtime'?{nightSettlingMask:7}:{roomSettlingMask:7}});}});
}
function openCoinCatch(){
  showScreen('scene-quest');
  questDispose=mountCoinCatch($('scene-quest'),{gender:state.profile.gender,losses:state.flags.coinGameLosses??0,onLoss:count=>{state.flags.coinGameLosses=count;save();},canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),isPaused:()=>panel.open,onComplete:()=>{showScreen('game');performBeat();}});
  $('scene-quest-title').focus({preventScroll:true});
}
function openWhiteCard(){
  showScreen('scene-quest');
  questDispose=mountWhiteCard($('scene-quest'),{owner:state.flags.districtOwner,step:state.flags.whiteCardStep??0,canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),onChange:step=>{state.flags.whiteCardStep=step;save();},onComplete:()=>{showScreen('game');performBeat();}});
  $('scene-quest-title').focus({preventScroll:true});
}
function openFlatSettleQuest(){
  showScreen('room-interaction');
  roomDispose=mountFlatSettleQuest($('room-interaction'),{district:state.flags.district??'dorcol',mask:state.flags.flatSettleMask??0,canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),onChange:mask=>{state.flags.flatSettleMask=mask;save();},onComplete:()=>{showScreen('game');performBeat();}});
}
function openMealMenu(){
  showScreen('scene-quest');
  const node=NODES[state.node];
  questDispose=mountMealMenu($('scene-quest'),{choices:node.choices.filter(choice=>choiceVisible(choice,state.flags,state.profile)),canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),onChoose:choice=>choose(choice)});
  $('scene-quest-title').focus({preventScroll:true});
}
function openDistrictMap(){
  showScreen('scene-quest');
  const node=NODES[state.node];
  questDispose=mountDistrictMap($('scene-quest'),{choices:node.choices.filter(choice=>choiceVisible(choice,state.flags,state.profile)),flags:state.flags,canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),onChoose:choice=>choose(choice)});
  $('scene-quest-title').focus({preventScroll:true});
}
function openPixelTram(){
  showScreen('scene-quest');
  questDispose=mountPixelTram($('scene-quest'),{canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),onComplete:()=>{showScreen('game');performBeat({effect:{routePixel:true}});}});
  $('scene-quest-title').focus({preventScroll:true});
}
function openViewingQuest(){
  showScreen('scene-quest');
  questDispose=mountViewingQuest($('scene-quest'),{owner:state.flags.districtOwner,mask:viewMaskOf(state.flags),canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),isPaused:()=>panel.open,onChange:mask=>{setViewMask(state.flags,mask);save();},onComplete:()=>{showScreen('game');performBeat();}});
  $('scene-quest-title').focus({preventScroll:true});
}
function openBankGuide(){
  showScreen('scene-quest');
  const node=NODES[state.node];
  questDispose=mountBankGuide($('scene-quest'),{mask:state.flags[BANK_FLAG]??0,choices:node.choices.filter(choice=>choiceVisible(choice,state.flags,state.profile)),canRewind:!!state.rewind?.length,onBack:goBack,onSettings:()=>openPanel('settings'),onRead:mask=>{state.flags[BANK_FLAG]=mask;save();},onChoose:choice=>choose(choice)});
  $('scene-quest-title').focus({preventScroll:true});
}
function openBaggage(){
  const origin={node:state.node,index:state.index};
  showScreen('interaction');fitScene();
  const complete=()=>{
    if(view!=='interaction'||state.node!==origin.node||state.index!==origin.index)return;
    // A settings dialog may have opened while the suitcase was flying.
    if(panel.open){panel.addEventListener('close',complete,{once:true});return;}
    showScreen('game');performBeat();
  };
  const dispose=mountBaggageInteraction({canvas:$('interaction-canvas'),image:$('interaction-image'),board:$('baggage-board'),slot:$('baggage-slot'),status:$('baggage-status'),text:t,onComplete:complete});
  interactionDispose=()=>{dispose();panel.removeEventListener('close',complete);};
  $('interaction-title').focus({preventScroll:true});
}
function applyEffects(effect={}) {
  Object.assign(state.flags,effect);applyFlatEffect(state.flags,effect);
  if(['romance','friendship'].includes(effect.eveningIntent)&&state.flags.companion)state.flags[state.flags.companion+'Bond']=effect.eveningIntent;
  if(['romance','friendship'].includes(effect.cinemaAirportBond)&&state.flags.companion)state.flags[state.flags.companion+'Bond']=effect.cinemaAirportBond;
  if(effect.hostBond&&state.flags.host)state.flags[state.flags.host+'Bond']=effect.hostBond;
  if(effect.districtBond&&state.flags.districtOwner)state.flags[state.flags.districtOwner+'Bond']=effect.districtBond;
  if(effect.rentalStep&&rentalOwner(state.flags)){state.flags['rentalStep_'+rentalOwner(state.flags)]=effect.rentalStep;delete state.flags.rentalStep;}
  applyRomanceEffect(state.flags,effect);
}
function performBeat(option={}, {render=true,chat=null}={}) {
  if(!['game','messenger'].includes(view)||panel.open||transitionLock)return false;
  const node=NODES[state.node],action=beatActionAt(node,state.index);if(!action)return;
  rememberStep(state);transitionLock=true;setTimeout(()=>transitionLock=false,160);
  const label=option.label??action.label;
  state.log.push({speaker:'Действие',text:interpolate(resolveStoryText(label,state.flags,'ru'),state.profile,catalog,'ru'),choice:true,...(chat?{voice:'message',chatContact:chat.contact,chatDirection:'outgoing',chatScene:state.node,chatText:interpolate(resolveStoryText(chat.text,state.flags,'ru'),state.profile,catalog,'ru')}:{})});
  applyEffects(action.effect);applyEffects(option.effect);
  for(const entry of action.journal??[])if(!state.journal.includes(entry))state.journal.push(entry);
  if(option.next??action.next)enterNode(option.next??action.next);
  else if(state.index<node.pages.length-1)state.index++;
  else enterNode(node.next);
  if(state.node!=='end')recordPage();wantCard=true;save();if(render)renderGame();
  return true;
}
function choose(choice, {render=true,chat=null}={}) {
  if(transitionLock||panel.open||!['game','messenger','scene-quest'].includes(view)||!choiceVisible(choice,state.flags,state.profile))return false;
  rememberStep(state);
  transitionLock=true;setTimeout(()=>transitionLock=false,160);
  state.log.push({speaker:'Твой выбор',text:interpolate(resolveStoryText(choice.label,state.flags,'ru'),state.profile,catalog,'ru'),choice:true,...(chat?{voice:'message',chatContact:chat.contact,chatDirection:'outgoing',chatScene:state.node,chatText:interpolate(resolveStoryText(chat.text,state.flags,'ru'),state.profile,catalog,'ru')}:{})});
  applyEffects(choice.effect);enterNode(choice.next);recordPage();wantCard=true;save();if(render)renderGame();return true;
}
function renderEnding() {
  setMusicScene('prologue');setAmbience(null);lastStingNode=null;
  showScreen('ending');
  $('ending-rewind').disabled=!state.rewind?.length;
  const continuation=continuationFor(state);
  $('continue-story').hidden=!continuation;
  $('continue-story').textContent=(()=>{const day=CHAPTERS.find(c=>c.start===continuation);return day?.day?t('Продолжить · День '+day.day):t(continuation==='next_steps'?'Продолжить · Условия квартиры':'Продолжить · Своя дверь');})();
  $('ending-title').innerHTML=html(state.flags.chapterOneComplete?'Уже не только<br><em>адрес</em>':'Пока только<br><em>адрес</em>');
  const finalBackground={dorcol:'dorcol-apartment',vracar:'vracar-apartment',newbelgrade:'new-belgrade-apartment'}[state.flags.district]??'first-room';
  $('ending').style.backgroundImage=state.flags.chapterOneComplete?`linear-gradient(#164d5d55,#123d49ed),url('./assets/${finalBackground}.webp')`:'';
  $('ending-memory').textContent=t(state.flags.companion==='nikola'?'«Если захочешь ещё кифлу — теперь знаешь, у кого спросить».':state.flags.topic==='sketch'?'«У первой части истории — счастливый конец».':'«Polako. Не спеши».');
  if(state.flags.chapterOneComplete)$('ending-memory').textContent=t(({dorcol:'Дорћол',vracar:'Врачар',newbelgrade:'Новый Белград'}[state.flags.district]??'Белград')+'. Первый просмотр — уже часть твоей истории.');
  if(state.flags.chapterThreeComplete){$('ending-title').innerHTML=html('Своим<br><em>голосом</em>');$('ending-memory').textContent=t('Завтра — первый визит. Сегодня — ещё один свой вечер.');}
  document.querySelector('.ending-inner .demo-note').innerHTML=html(state.flags.chapterFourComplete?'Продолжение следует.<br>Дальше — документы для проживания и кино во дворе.':'Продолжение следует.<br>Дальше — визит в банк, своё дело и новые встречи.');
  if(state.flags.chapterFourComplete){$('ending-title').innerHTML=html('Больше, чем<br><em>планы</em>');$('ending-memory').textContent=t('Завтра — новые вопросы. В субботу — кино во дворе.');}
  if(state.flags.chapterFiveComplete){$('ending-title').innerHTML=html('Право<br><em>на завтра</em>');$('ending-memory').textContent=t('Следующий шаг понятен. Суббота уже в календаре.');}
  if(state.flags.chapterSixComplete){$('ending-title').innerHTML=html('Свет<br><em>во дворе</em>');$('ending-memory').textContent=t('Здесь есть люди, которые оставят тебе место.');}
  document.querySelector('.ending-inner .eyebrow').textContent=t(state.flags.chapterSevenComplete?'КОНЕЦ ИСТОРИИ':'ПРОДОЛЖЕНИЕ СЛЕДУЕТ');
  if(state.flags.chapterSevenComplete){const f=state.flags.finalChoice;$('ending-title').innerHTML=html(f==='stay'?'Остаюсь<br><em>в Белграде</em>':f==='leave'?'Домой<br><em>с летом</em>':'До осени<br><em>по плану</em>');$('ending-memory').textContent=t(f==='stay'?'У этого города теперь есть твой стул.':f==='leave'?'Лето осталось с тобой, куда бы ты ни летел.':'Дверь приоткрыта. Войти в неё решишь ты.');}
  if(state.flags.chapterFiveComplete)document.querySelector('.ending-inner .demo-note').innerHTML=html(state.flags.chapterSevenComplete?'Конец истории.<br>Спасибо за это лето в Сербии.':state.flags.chapterSixComplete?'Продолжение следует.<br>Дальше — новые решения и встречи.':'Продолжение следует.<br>Дальше — кино во дворе и вечер с близкими.');
  document.querySelector('.ending-inner>p:not(.eyebrow):not(.demo-note)').innerHTML=html(state.flags.chapterSevenComplete?'Это был твой ответ.<br>Любой из них был честным.':state.flags.chapterSixComplete?'У этой жизни уже есть люди.<br>Дальше ты выберешь, куда она приведёт.':state.flags.chapterFiveComplete?'Одни дела завершены.<br>Для остальных выбран следующий шаг.':state.flags.chapterFourComplete?'Первые ответы получены.<br>А у новых знакомств появился свой вечер.':state.flags.chapterThreeComplete?'Вопросы для банка готовы.<br>А у новой встречи уже есть продолжение.':state.flags.chapterOneComplete?'У тебя есть ключ, первый вечер<br>и свой маршрут по Белграду.':'Сегодня у тебя появился адрес.<br>И человек, которому можно написать.');
  drawEndingPrompt();
}
function goBack() {
  if(panel.open||transitionLock||!state||!['game','messenger','room-interaction','scene-quest','ending'].includes(view))return;
  // inside a long line, back means the previous screen of the same line
  if(view==='game'&&chunkIndex>0){chunkIndex--;renderGame();return;}
  if(!rewindStep(state))return;
  showLastChunk=true;
  state.chapterMarks=readChapterMarks(state.chapterMarks,NODES,JOURNAL,state.log.length);
  transitionLock=true;setTimeout(()=>transitionLock=false,160);
  save();renderGame();
}
panel.addEventListener('close',()=>{if(!panel.open)panel.classList.remove('chapter-map','workshop-wide');});
function openChapters() {
  if(panel.open)panel.close();
  const source=['game','messenger','ending','chapter-card'].includes(view)?state:saved;
  $('panel-title').textContent=t('Главы');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const current=source?chapterFor(source,NODES):null;
  drawChapterMap(content,{chapters:CHAPTERS,source,current,debugAccess:hasChapterDebugAccess(),isAvailable:chapter=>chapterAvailable(chapter,hasPreviewAccess()),onSelect:chapter=>confirmChapter(chapter,source)});
  panel.classList.add('chapter-map');panel.showModal();
  requestAnimationFrame(()=>{const active=content.querySelector('[aria-current="step"]');if(active)active.scrollIntoView({block:'center'});else content.scrollTop=0;});
}
function confirmChapter(chapter,source){
  if(!chapterAvailable(chapter,hasPreviewAccess()))return;
  panel.classList.remove('chapter-map');
  $('panel-title').textContent=t('Вернуться к главе?');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const debug=hasChapterDebugAccess();
  const p=document.createElement('p');p.className='confirm-copy';p.textContent=debug?t('Режим проверки: переход изменит текущее сохранение. Прежние выборы сохранятся, но пропущенные события не будут разыграны. Для возврата сначала скачай текущую историю.'):t(chapter.number+' · '+chapter.title+'. Вернёмся к сохранённой точке главы. Выборы до неё сохранятся. Последующие события и отношения нужно будет пройти заново. Текущую историю можно сначала скачать.');
  const actions=document.createElement('div');actions.className='confirm-actions';
  const start=document.createElement('button');start.className='primary';start.textContent=t('Перейти к главе');start.addEventListener('click',()=>{
    const restored=structuredClone(source);if(!(debug?jumpToChapter(restored,chapter.id,NODES):restartChapter(restored,chapter.id,NODES)))return;
    state=restored;recordPage();save();panel.close();if(settings.music)applyMusic(true);pendingLabel=true;renderGame();
  });
  const download=document.createElement('button');download.className='secondary';download.textContent=t('Скачать текущую историю');download.addEventListener('click',exportSave);
  const cancel=document.createElement('button');cancel.className='text-button';cancel.textContent=t('Остаться здесь');cancel.addEventListener('click',openChapters);
  actions.append(start,download,cancel);content.append(p,actions);
}
function openPanel(kind) {
  panel.classList.remove('chapter-map','workshop-wide');
  if(kind==='account')return openAccount();
  if(kind==='chapters')return openChapters();
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  if(kind==='release-notes') {
    $('panel-title').textContent=t('История обновлений');
    const intro=document.createElement('p');intro.className='release-intro';intro.textContent=t('Что изменилось в игре');content.append(intro);
    for(const [version,ru,en] of RELEASE_NOTES){
      const item=document.createElement('article');item.className='release-entry';
      const heading=document.createElement('h3');heading.textContent=t('Версия ')+version;
      const description=document.createElement('p');description.textContent=getLanguage()==='en'?en:ru;
      item.append(heading,description);content.append(item);
    }
  } else if(kind==='game-menu') {
    $('panel-title').textContent=t('Пауза');
    const actions=document.createElement('div');actions.className='confirm-actions';
    const menuItems=sceneTest?[['Продолжить игру',()=>panel.close()],['Вернуться в мастерскую',returnFromSceneTest]]:[['Продолжить игру',()=>panel.close()],['Выбрать главу',()=>{panel.close();openChapters();}],['На главный экран',()=>{panel.close();home();}]];
    for(const [label,run]of menuItems){const button=document.createElement('button');button.className='secondary';button.textContent=t(label);button.addEventListener('click',run);actions.append(button);}
    const details=document.createElement('details');details.className='reading-details more-settings';const summary=document.createElement('summary');summary.textContent=t('Реплики и заметки');details.append(summary);
    const reading=document.createElement('div');reading.className='settings-actions';
    for(const [label,kind]of [['Прочитанные реплики','history'],['Заметки о людях и планах','journal']]){const button=document.createElement('button');button.className='secondary';button.textContent=t(label);button.addEventListener('click',()=>{panel.close();openPanel(kind);});reading.append(button);}
    details.append(reading);
    content.append(actions,details);
  } else if(kind==='history') {
    $('panel-title').textContent=t('История реплик');
    if(!state?.log.length){const p=document.createElement('p');p.className='journal-empty';p.textContent=t('Здесь появится история вашего первого дня.');content.append(p);}
    else for(const entry of state.log) {const item=document.createElement('div');item.className='history-entry'+(entry.choice?' choice-entry':'');const label=document.createElement('small');item.dataset.voice=entry.voice??(entry.speaker==='Ты'?'thought':'other');label.textContent=t((entry.speaker==='Ты'?named(state.profile).full.nominative:familySpeaker(entry.speaker))+(item.dataset.voice==='thought'?' · про себя':item.dataset.voice==='speech'?' · вслух':''));const p=document.createElement('p');p.textContent=t(translateHistory(familyText(entry.text),state.profile,catalog));item.append(label,p);content.append(item);}
  } else if(kind==='journal') {
    $('panel-title').textContent=t('Твой дневник');
    const intro=document.createElement('p');intro.className='journal-intro';intro.textContent=t(state?`${named(state.profile).full.nominative} · история в Белграде`:'Люди, планы и небольшие воспоминания.');content.append(intro);
    if(!state?.journal.length){const p=document.createElement('p');p.className='journal-empty';p.textContent=t('Первые записи появятся по ходу истории.');content.append(p);}
    else for(const id of state.journal) {const entry=JOURNAL[id];const article=document.createElement('article');article.className='journal-entry';const tag=document.createElement('p');tag.className='entry-tag';tag.textContent=t(entry.tag);const title=document.createElement('h3');title.textContent=t(entry.title);const body=document.createElement('p');body.textContent=t(entry.text);article.append(tag,title,body);if(entry.link){const a=document.createElement('a');a.href=entry.link;a.target='_blank';a.rel='noopener noreferrer';a.textContent=t(entry.linkText);article.append(a);}content.append(article);}
  } else {
    $('panel-title').textContent=t('Настройки');
    content.innerHTML=html(`<label class="setting"><span>Музыка и звуки</span><input id="music-toggle" type="checkbox" ${settings.music?'checked':''}></label><div class="stepper-group" id="volume-row" ${settings.music?'':'hidden'}>${stepperMarkup({id:'music-vol',label:'Громкость музыки',volume:settings.volume})}${stepperMarkup({id:'sfx-vol',label:'Громкость звуков',volume:settings.sfxVolume})}</div><div class="setting theme-setting"><span>Тема</span><div class="theme-options" role="group" aria-label="Тема оформления"><button data-theme-preference="system" aria-pressed="${settings.theme==='system'}">${THEME_ICONS.system}Авто</button><button data-theme-preference="light" aria-pressed="${settings.theme==='light'}">${THEME_ICONS.light}Светлая</button><button data-theme-preference="dark" aria-pressed="${settings.theme==='dark'}">${THEME_ICONS.dark}Тёмная</button></div></div>${textSizeMarkup({size:settings.textSize})}<label class="setting"><span>Взрослые сцены · 18+<small>Без подробностей, только по согласию</small></span><input id="adult-toggle" type="checkbox" ${settings.adult?'checked':''}></label><details class="more-settings"><summary>Дополнительно</summary><div class="settings-actions"><button id="export-save" class="secondary" ${saved?'':'disabled'}>Скачать сохранение</button><label class="import-label">Загрузить сохранение<input id="import-save" type="file" accept="application/json,.json" hidden></label><button id="install-guide" class="secondary">На весь экран на iPhone</button><button id="screen-info" class="secondary">Сведения об экране</button></div></details><p class="settings-about">Прогресс хранится на этом устройстве. Войди в аккаунт, чтобы не потерять его.</p>`);
    document.querySelectorAll('[data-theme-preference]').forEach(button=>button.addEventListener('click',()=>{settings.theme=button.dataset.themePreference;writeLocal('settings',settings);applyTheme();document.querySelectorAll('[data-theme-preference]').forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.themePreference===settings.theme)));}));
    bindTextSize(content,{size:settings.textSize,onChange:size=>{settings.textSize=size;document.documentElement.style.setProperty('--text-size',size+'px');document.documentElement.style.setProperty('--text-lines',String(textLines(size)));writeLocal('settings',settings);if(view==='game')renderGame();else fitScene();}});
    $('music-toggle').addEventListener('change',event=>{applyMusic(event.target.checked);$('volume-row').hidden=!event.target.checked;});
    $('adult-toggle').addEventListener('change',event=>{settings.adult=event.target.checked;writeLocal('settings',settings);});
    bindStepper(content,{id:'music-vol',volume:settings.volume,onChange:value=>{settings.volume=value;setVolume(value);writeLocal('settings',settings);}});
    bindStepper(content,{id:'sfx-vol',volume:settings.sfxVolume,onChange:value=>{settings.sfxVolume=value;setSfxVolume(value);playSting('ding');writeLocal('settings',settings);}});
    setPanelTools(sceneTest?[]:[{id:'account-settings',icon:'account',label:'Мой прогресс · аккаунт',run:()=>{panel.close();openAccount();}},{id:'menu-home',icon:'home',label:'На главный экран',run:()=>{panel.close();home();}}]);
    if(sceneTest){$('export-save').disabled=true;$('import-save').disabled=true;}
    $('install-guide').textContent=t('Установить на главный экран');
    $('screen-info').addEventListener('click',showScreenInfo);
    $('install-guide').addEventListener('click',showInstallGuide);
    $('export-save').addEventListener('click',exportSave);$('import-save').addEventListener('change',importSave);
    if(new URL(location.href).searchParams.has('scene')){
      const hint=document.createElement('p');
      hint.textContent=getLanguage()==='en'?'Scene link: enter your workshop code below to view it. Your game progress will not change.':'Ссылка на сцену: введи промокод мастерской ниже, чтобы открыть её. Прогресс игры не изменится.';
      content.prepend(hint);
    }
    mountWorkshopEntry(content,()=>{
      $('panel-title').textContent=t('Мастерская');
      mountWorkshop(content,{sprites:CHARACTER_SPRITES,backgrounds:BACKGROUNDS,nodes:NODES,chapters:CHAPTERS,start:START,initialScene:new URL(location.href).searchParams.get('scene'),onTestScene:configureSceneTest,back:()=>{
        content.classList.remove('workshop');panel.classList.remove('workshop-wide');panel.close();openPanel('settings');
      }});
    },()=>{if(view==='chapter-card'&&state&&!chapterAvailable(chapterFor(state,NODES),false)){cardContext=null;panel.close();renderGame();}});
  }
  panel.showModal();
  if(kind==='history')requestAnimationFrame(()=>panel.scrollTop=panel.scrollHeight);
}
function configureSceneTest(id){
 if(!NODES[id])return;
 const source=state??saved,content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();$('panel-title').textContent=t('Тест сцены');
 const info=document.createElement('p');info.textContent=t('Тест не изменяет сохранение. Выберите условия сцены.');content.append(info);
 const select=(label,options,value)=>{const wrap=document.createElement('label');wrap.className='setting';wrap.append(document.createTextNode(t(label)));const input=document.createElement('select');for(const [key,name] of options){const opt=document.createElement('option');opt.value=key;opt.textContent=t(name);input.append(opt);}input.value=value;wrap.append(input);content.append(wrap);return input;};
 const gender=select('Герой',[['female','Женщина'],['male','Мужчина']],source?.profile?.gender??'female');
 const companion=select('Спутник',[['milica','Милица'],['nikola','Никола']],source?.flags?.companion??'milica');
 const owner=select('Владелец квартиры',[['ana','Ана'],['stefan','Стефан'],['marko','Марко'],['vuk','Вук']],source?.flags?.districtOwner??'ana');
 const launch=document.createElement('button');launch.className='primary';launch.textContent=t('Начать тест');launch.onclick=()=>{
  const profile=source?.profile?.gender===gender.value?structuredClone(source.profile):{gender:gender.value,nameId:catalog.genders[gender.value].names[0].id,namesCatalogVersion:catalog.version};
  const flags={...(source?.flags??{}),companion:companion.value,districtOwner:owner.value,district:({ana:'dorcol',stefan:'dorcol',marko:'vracar',vuk:'newbelgrade'})[owner.value]??'dorcol',rentalCast:'new'};
  sceneTest={id,previousState:state,previousView:view};state={formatVersion:1,storyVersion:STORY_VERSION,profile,node:id,index:0,flags,journal:[],log:[],rewind:[],completed:false,updatedAt:Date.now()};
  if(NODES[id].adult&&!settings.adult&&NODES[id].skipTo)state.node=NODES[id].skipTo;
  Object.assign(state.flags,NODES[state.node].effectOnEnter??{});recordPage();panel.close();
  const exit=document.createElement('button');exit.id='scene-test-exit';exit.className='scene-test-exit';exit.textContent=t('Вернуться в мастерскую');exit.onclick=returnFromSceneTest;document.body.append(exit);renderGame();
 };content.append(launch);
}
function returnFromSceneTest(){
 if(!sceneTest)return;const test=sceneTest;sceneTest=null;state=test.previousState;document.getElementById('scene-test-exit')?.remove();
 if(panel.open)panel.close();showScreen(test.previousView);const content=$('panel-content');$('panel-title').textContent=t('Мастерская');
 mountWorkshop(content,{sprites:CHARACTER_SPRITES,backgrounds:BACKGROUNDS,nodes:NODES,chapters:CHAPTERS,start:START,initialScene:test.id,onTestScene:configureSceneTest,back:()=>{panel.close();openPanel('settings');}});panel.showModal();
}
function saveDescription(progress) {
  if(!progress)return 'Пока нет сохранения';
  const name=named(progress.profile)?.full.nominative??'Персонаж';
  const chapter=NODES[progress.node]?.chapter??(progress.node==='end'?'Пройденный отрезок':'Пролог');
  return getLanguage()==='en'?`${t(name)} · ${t(chapter)} · ${progress.log.length} ${progress.log.length===1?'line':'lines'}`:`${name} · ${chapter} · ${progress.log.length} реплик`;
}
function openAccount() {
  if(panel.open)panel.close();
  $('panel-title').textContent=t('Мой прогресс');
  const content=$('panel-content');content.classList.remove('workshop');content.replaceChildren();
  const description=document.createElement('p');description.className='account-description';description.textContent=t(saveDescription(saved));content.append(description);
  if(saved){
    const milestones=[['Знакомство',saved.log.length>0],['Заселение',saved.journal.includes('chapter_arrived')],['Первый вечер',saved.journal.includes('asya')],['Район',!!saved.flags.district],['Просмотр',saved.journal.includes('viewing_done')]];
    const steps=document.createElement('ol');steps.className='account-milestones';steps.setAttribute('aria-label',t('Этапы истории'));
    for(const [title,done] of milestones){const item=document.createElement('li');item.className=done?'complete':'';item.textContent=t((done?'✓ ':'○ ')+title);steps.append(item);}content.append(steps);
  }
  const status=document.createElement('p');status.className='account-status';status.textContent=t(cloud?.message??'Проверяем аккаунт…');content.append(status);
  if(cloud?.user){
    const name=document.createElement('p');name.className='account-identity';name.textContent=t('Аккаунт: '+cloud.user.displayName);content.append(name);
    if(cloud.conflict){
      const intro=document.createElement('p');intro.className='confirm-copy';intro.textContent=t(cloud.conflict.progress?'На устройстве и в аккаунте разные истории. Какую продолжить?':'Этот прогресс связан с другим аккаунтом. Перенести его в текущий?');content.append(intro);
      for(const [text,action] of [...(cloud.conflict.progress?[[`Из аккаунта: ${saveDescription(cloud.conflict.progress)}`,()=>cloud.useCloud()]]:[]),[`С этого устройства: ${saveDescription(saved)}`,()=>cloud.useLocal()]]){
        const button=document.createElement('button');button.className='secondary account-choice';button.textContent=t(text);button.addEventListener('click',async()=>{await action();openAccount();});content.append(button);
      }
    }else{
      const sync=document.createElement('button');sync.className='primary';sync.textContent=t('Синхронизировать сейчас');sync.disabled=!saved||cloud.busy;sync.addEventListener('click',()=>{cloud.queue(saved);cloud.flush();});content.append(sync);
    }
    if(recoveryCodeOnce)drawRecoveryCode(content,recoveryCodeOnce,()=>{recoveryCodeOnce=null;openAccount();});
    const out=document.createElement('button');out.type='button';out.className='text-button account-link';out.textContent=t('Выйти из аккаунта');out.disabled=cloud.busy;out.addEventListener('click',async()=>{if(cloud.busy)return;clearTimeout(cloud.timer);try{const response=await fetch('/api/account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})});if(!response.ok)throw Error();cloud.user=null;cloud.pending=null;cloud.conflict=null;recoveryCodeOnce=null;await cloud.refresh();openAccount();}catch{toast('Не удалось выйти. Проверь связь и попробуй ещё раз.');}});content.append(out);
  }else{
    const intro=document.createElement('p');intro.className='auth-intro';intro.textContent=t('Войди, чтобы продолжить историю с другого устройства. Без входа прогресс остаётся в этом браузере.');content.append(intro);
    drawAccountForm(content,{mode:authMode,legacyAvailable:cloud?.legacyAvailable,onMode:mode=>{authMode=mode;openAccount();},onSuccess:async result=>{recoveryCodeOnce=result.recoveryCode??null;await cloud.refresh();openAccount();}});
  }
  const privacy=document.createElement('p');privacy.className='sound-hint';privacy.textContent=t('В аккаунте сохраняются персонаж, сцена, ответы и дневник. Другие игроки их не видят.');content.append(privacy);
  panel.showModal();
}
function exportSave() {
  if(!saved)return;
  const blob=new Blob([JSON.stringify(saved,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download='serbian-summer-save.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
async function importSave(event) {
  const file=event.target.files?.[0];if(!file)return;
  try {if(file.size>500000)throw new Error('Файл слишком большой для сохранения пролога.');const parsed=validateSave(JSON.parse(await file.text()));state=parsed;state.updatedAt=Date.now();saved=state;save();panel.close();renderGame();toast('Сохранение загружено.');}
  catch(error){toast(error instanceof SyntaxError?'Это не файл сохранения игры.':error.message);}
  event.target.value='';
}
function confirmNewGame() {
  if(!saved)return chooseSound(beginCreation);
  $('panel-title').textContent=t('Начать новое лето?');
  $('panel-content').innerHTML=html('<p class="confirm-copy">Текущее автосохранение заменится, когда ты выберешь персонажа и начнёшь историю. Перед этим можно скачать его в настройках.</p><div class="confirm-actions"><button id="confirm-new" class="primary">Выбрать персонажа</button><button id="cancel-new" class="secondary">Продолжить текущую историю</button></div>');
  $('confirm-new').addEventListener('click',()=>{panel.close();draft={gender:null,nameId:null};writeLocal('draft',draft);chooseSound(beginCreation);});
  $('cancel-new').addEventListener('click',()=>panel.close());panel.showModal();
}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{const action=button.dataset.action;if(action==='home')home();else if(action==='fullscreen')requestImmersiveMode();else openPanel(action);}));
window.addEventListener('ss-music-state',refreshMusicControls);
$('new-game').addEventListener('click',confirmNewGame);$('replay').addEventListener('click',confirmNewGame);
$('resume').addEventListener('click',()=>{const resume=()=>{state=structuredClone(saved);if(settings.music)applyMusic(true);pendingLabel=true;renderGame();};if(settings.soundChosen)resume();else chooseSound(resume);});
$('adult-choice-toggle').addEventListener('change',event=>{settings.adult=event.target.checked;writeLocal('settings',settings);});
$('creation-back').addEventListener('click',()=>{if(creationStep===1){creationStep=0;renderCreation();}else home();});
$('creation-next').addEventListener('click',()=>{if(creationStep===0){if(!draft.gender)return;creationStep=1;renderCreation();}else startGame();});
$('chapter-progress').addEventListener('click',openChapters);
$('interaction-back').addEventListener('click',renderGame);
$('next').addEventListener('click',advance);$('dialogue-text').addEventListener('click',advance);
$('continue-story').addEventListener('click',()=>{state.rewind=[];state.completed=false;const next=continuationFor(state);if(!next)return;enterNode(next);recordPage();wantCard=true;save();renderGame();});
$('rewind').addEventListener('click',goBack);$('ending-rewind').addEventListener('click',goBack);
$('ending-journal').addEventListener('click',()=>openPanel('journal'));
$('close-panel').addEventListener('click',()=>panel.close());
panel.addEventListener('close',()=>{if(view==='chapter-card'&&cardContext)drawChapterCard(cardContext.previous,cardContext.next);if(view==='ending')drawEndingPrompt();});
panel.addEventListener('click',event=>{if(event.target===panel){const rect=panel.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)panel.close();}});
document.addEventListener('keydown',event=>{if((event.code==='Space'||event.code==='Enter')&&view==='game'&&!panel.open&&!/BUTTON|INPUT|A/.test(document.activeElement.tagName)){event.preventDefault();advance();}});
$('scene-cg').addEventListener('load',fitScene);$('home-art').addEventListener('load',fitScene);
document.fonts?.ready.then(fitScene);
window.addEventListener('pageshow',fitScene);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)fitScene();});
window.addEventListener('resize',fitScene);window.visualViewport?.addEventListener('resize',fitScene);
document.addEventListener('fullscreenchange',fitScene);
preloadSprite('milica');preloadSprite('nikola');
mountLanguageSwitch($('language-switch'),LANGUAGES,getLanguage());
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',async()=>{if(button.dataset.language==='en'&&!translationsReady){try{await initialiseLanguage();translationsReady=true;}catch{toast('Не удалось загрузить английский перевод. Попробуй ещё раз.');return;}}setLanguage(button.dataset.language);writeLocal('language',getLanguage());applyStaticLanguage();updateLanguageUi();home();}));
home();
fitScene();
refreshMusicControls();

cloud=new CloudProgress({getLocal:()=>saved,restore:async input=>{if(sceneTest)return;saved=validateSave(input);await writeSave(saved);state=structuredClone(saved);if(['game','messenger','ending'].includes(view))renderGame();else home();},changed:()=>{if($('panel-title').textContent===t('Мой прогресс')&&panel.open&&!$('account-auth-form'))requestAnimationFrame(()=>{if(panel.open&&$('panel-title').textContent===t('Мой прогресс'))openAccount();});}});
cloud.refresh().then(()=>{if(new URL(location.href).searchParams.has('account')){history.replaceState(null,'',location.pathname);openAccount();}});

// Reference links open the read-only workshop gate, never restore a scene into a save.
if(new URL(location.href).searchParams.has('scene'))openPanel('settings');
// The screens of a long line depend on the box width and on the fonts, so measure again when either changes.
let resizeTimer=0;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(view==='game'&&state&&$('dialogue-text').clientWidth!==chunkWidth)renderGame();},200);});
document.fonts?.ready.then(()=>{if(view==='game'&&state)renderGame();});

// Check again after returning to the game and while it remains open.
startUpdateChecks({current:APP_VERSION,onUpdate:version=>{
 const dialog=document.createElement('dialog');dialog.className='update-dialog';dialog.setAttribute('aria-labelledby','update-title');
 const box=document.createElement('div');box.className='update-dialog-content';
 const title=document.createElement('h2');title.id='update-title';title.textContent=t('Доступно обновление');
 const text=document.createElement('p');text.textContent=t('Вышла новая версия игры. Обнови её, чтобы увидеть последние изменения.');
 const label=document.createElement('p');label.className='update-version';label.textContent=t('Версия ')+version;
 const error=document.createElement('p');error.className='update-error';error.hidden=true;
 const update=document.createElement('button');update.className='primary';update.textContent=t('Обновить');
 const later=document.createElement('button');later.className='secondary';later.textContent=t('Позже');
 update.addEventListener('click',async()=>{
  update.disabled=true;later.disabled=true;
  if(state && !await writeSave(state)){error.textContent=t('Не удалось сохранить прогресс. Попробуй ещё раз или скачай сохранение в настройках.');error.hidden=false;update.disabled=false;later.disabled=false;return;}
  location.reload();
 });
 later.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>dialog.remove());
 box.append(title,text,label,error,update,later);dialog.append(box);document.body.append(dialog);dialog.showModal();
}});
