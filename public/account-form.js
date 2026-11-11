import {t} from './i18n.js?v=0.17.27';
export function drawAccountForm(container,{mode='login',legacyAvailable=false,onMode,onSuccess}) {
  const tabs=document.createElement('div');tabs.className='auth-tabs';
  for(const [id,title] of [['login','Войти'],['register','Создать аккаунт']]){const button=document.createElement('button');button.type='button';button.textContent=t(title);button.setAttribute('aria-pressed',String(mode===id));button.addEventListener('click',()=>onMode(id));tabs.append(button);}container.append(tabs);
  const form=document.createElement('form');form.id='account-auth-form';form.className='auth-form';
  function input(title,name,type,autocomplete){const label=document.createElement('label');label.className='auth-label';const span=document.createElement('span');span.textContent=t(title);const field=document.createElement('input');field.name=name;field.type=type;field.autocomplete=autocomplete;field.required=true;field.maxLength=name==='login'?32:128;field.spellcheck=false;field.autocapitalize='none';if(name==='password')field.minLength=10;label.append(span,field);form.append(label);return field;}
  input('Логин','login','text','username');
  if(mode==='recover')input('Код восстановления','recoveryCode','password','off');
  input(mode==='login'?'Пароль':'Новый пароль','password','password',mode==='login'?'current-password':'new-password');
  if(mode==='register'){
    const hint=document.createElement('p');hint.className='auth-hint';hint.textContent=t('Логин: 3–32 буквы или цифры. Пароль: от 10 символов. Текущую историю можно сохранить в аккаунте.');form.append(hint);
    if(legacyAvailable){const label=document.createElement('label');label.className='auth-migrate';const check=document.createElement('input');check.type='checkbox';check.name='migrateLegacy';label.append(check,document.createTextNode('Перенести моё прежнее облачное сохранение'));form.append(label);}
  }
  const error=document.createElement('p');error.className='auth-error';error.setAttribute('role','alert');form.append(error);
  const submit=document.createElement('button');submit.type='submit';submit.className='primary';submit.textContent=t(mode==='register'?'Создать аккаунт':mode==='recover'?'Восстановить доступ':'Войти');form.append(submit);
  form.addEventListener('submit',async event=>{event.preventDefault();if(submit.disabled)return;submit.disabled=true;error.textContent=t('');try{
    const data=new FormData(form);const body={action:mode,login:data.get('login'),password:data.get('password'),recoveryCode:data.get('recoveryCode'),migrateLegacy:data.get('migrateLegacy')==='on'};
    const response=await fetch('/api/account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw Error(result.error??'Не удалось войти. Попробуй ещё раз.');
    form.reset();await onSuccess(result);
  }catch(problem){error.textContent=t(problem.message??'Нет связи. Попробуй ещё раз.');submit.disabled=false;}});
  container.append(form);
  const recovery=document.createElement('button');recovery.type='button';recovery.className='text-button auth-recover';recovery.textContent=t(mode==='recover'?'Вернуться ко входу':'Забыл пароль');recovery.addEventListener('click',()=>onMode(mode==='recover'?'login':'recover'));container.append(recovery);
}
export function drawRecoveryCode(container,code,onDismiss){
  const block=document.createElement('section');block.className='recovery-box';const heading=document.createElement('h3');heading.textContent=t('Сохрани код восстановления');const text=document.createElement('p');text.textContent=t('Он поможет вернуть доступ, если забудешь пароль. Показываем его один раз.');const input=document.createElement('input');input.readOnly=true;input.value=code;input.setAttribute('aria-label',t('Код восстановления'));
  const copy=document.createElement('button');copy.className='secondary';copy.textContent=t('Скопировать код');copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code);copy.textContent=t('Скопировано');}catch{input.select();copy.textContent=t('Выделено — скопируй код');}});
  const done=document.createElement('button');done.className='text-button';done.textContent=t('Я сохранил код');done.addEventListener('click',onDismiss);block.append(heading,text,input,copy,done);container.append(block);
}
