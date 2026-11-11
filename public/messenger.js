import { t } from './i18n.js?v=0.17.26';
import { appendChoiceContents } from './choice-ui.js?v=0.17.26';
import { MESSENGER_CONFIG } from './messenger-config.js?v=0.16.1';

const icons = {
  back: ['m14 4-8 8 8 8'],
  down: ['M12 3v17', 'm5 13 7 7 7-7'],
  chevron: ['m7 9 5 5 5-5'],
  phone: ['M7 3 3 5c-1 7 9 17 16 16l2-4-5-3-2 2-6-6 2-2-3-5Z'],
  video: ['M3 6h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H3V6Z', 'm16 10 5-3v10l-5-3'],
  plus: ['M12 5v14M5 12h14', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z'],
  smile: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z', 'M8 9h.01M16 9h.01M7 14q5 6 10 0'],
  photo: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'm3 16 6-6 6 6 4-3 2 2', 'M17 7h.01'],
  microphone: ['M9 5a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0V5Z', 'M6 11v2a6 6 0 0 0 12 0v-2M12 19v3M9 22h6'],
  send: ['m3 3 19 9-19 9 4-9-4-9Z', 'M7 12h15'],
  ticks: ['m2 12 4 4L17 5', 'm10 14 2 2L23 5'],
  heart: ['M12 21 3 12C-3 4 7-2 12 5c5-7 15-1 9 7L12 21Z'],
  edit: ['m4 16 11-11 4 4L8 20H4v-4Z', 'm14 6 4 4']
};

// Reusable DOM template. Story progression and persistence belong to the callbacks.
export function mountMessenger(root, frame, { onSend, onContinue, onBack, onMenu, onSettings, canRewind, theme = MESSENGER_CONFIG }) {
  const doc = root.ownerDocument;
  const el = (tag, text, className) => {
    const node = doc.createElement(tag); if (text) node.textContent = t(text); if (className) node.className = className; return node;
  };
  const icon = name => {
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.5'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round'); svg.setAttribute('aria-hidden', 'true');
    for (const d of icons[name]) { const path = doc.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', d); svg.append(path); }
    return svg;
  };
  const events = new AbortController();
  const listen = (node, event, callback) => node.addEventListener(event, callback, { signal: events.signal });
  const button = (label, callback, className) => {
    const node = el('button', '', className); node.type = 'button'; node.setAttribute('aria-label', t(label)); node.title = t(label);
    listen(node, 'click', callback); return node;
  };
  root.replaceChildren(); root.style.setProperty('--chat-accent', theme.accent);
  const header = el('header', '', 'chat-header');
  const back = button('← Назад', onBack, 'chat-back'); back.disabled = !canRewind; back.append(icon('back'));
  const identity = el('div', '', 'chat-identity');
  const avatar = el('span', '', 'chat-avatar'); avatar.setAttribute('aria-hidden', 'true');
  const avatarFile = !frame.hideAvatar && theme.avatars?.[frame.contact];
  if (avatarFile) {
    const image = el('img'); image.alt = ''; image.src = './assets/' + avatarFile;
    listen(image, 'error', () => { image.hidden = true; avatar.textContent = t(frame.contact)[0]; }); avatar.append(image);
  } else avatar.textContent = t(frame.contact)[0];
  const person = el('div', '', 'chat-person');
  const nameLine = el('div', '', 'chat-name-line'); const title = el('h2', frame.contact); title.id = 'messenger-title'; title.tabIndex = -1;
  const menu = el('div', '', 'chat-contact-menu'); menu.hidden = true;
  const menuToggle = button('Меню переписки', () => { menu.hidden = !menu.hidden; menuToggle.setAttribute('aria-expanded', String(!menu.hidden)); }, 'chat-contact-toggle'); menuToggle.append(icon('chevron')); menuToggle.setAttribute('aria-expanded', 'false');
  for (const [label, run] of [['Меню', onMenu], ['Настройки', onSettings]]) {
    const item = button(label, () => { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); run(); }, 'chat-menu-item'); item.textContent = t(label); menu.append(item);
  }
  nameLine.append(title, menuToggle); person.append(nameLine, el('p', theme.title, 'chat-channel')); identity.append(avatar, person);
  const calls = el('span', '', 'chat-call-pill'); calls.setAttribute('aria-hidden', 'true'); calls.append(icon('phone'), icon('video'));
  header.append(back, identity, calls, menu);
  const feed = el('div', '', 'chat-feed'); feed.setAttribute('role', 'log'); feed.setAttribute('aria-label', t('Переписка')); feed.setAttribute('aria-live', 'polite');
  const bubble = message => {
    if(message.isNew){const marker=el('div','Новое','chat-new-divider');marker.setAttribute('role','separator');marker.setAttribute('aria-label',t('Новое'));feed.append(marker);}
    const row = el('div', '', 'chat-row ' + message.direction);
    const article = el('article', '', 'chat-bubble ' + message.direction);
    article.setAttribute('aria-label', t(message.direction === 'outgoing' ? 'Исходящее сообщение' : 'Входящее сообщение'));
    if (message.quote) {
      const quote = el('blockquote', '', 'chat-quote'); quote.append(el('strong', message.quote.author ?? frame.contact), el('p', message.quote.text)); article.append(quote);
    }
    if(message.photo){const photo=doc.createElement('img');photo.className='chat-photo'+(message.photo.src.includes('courtyard-door.webp')?' chat-photo-entry':'');photo.src=message.photo.src;photo.alt=t(message.photo.alt);photo.loading='lazy';article.append(photo);}
    if(message.attachment){const attachment=el('div','','chat-attachment');attachment.append(icon('photo'),el('strong',message.attachment.label),el('small',message.attachment.description));article.append(attachment);}
    article.append(el('p', message.text));
    const meta = el('span', '', 'chat-meta');
    if (message.time || frame.time) meta.append(el('time', message.time || frame.time));
    if (message.direction === 'outgoing') { const ticks = el('span', '', 'chat-ticks'); ticks.setAttribute('aria-label', t('Отправлено')); ticks.append(icon('ticks')); meta.append(ticks); }
    article.append(meta);
    const reaction = button('Нравится сообщение', () => { const liked = reaction.getAttribute('aria-pressed') !== 'true'; reaction.setAttribute('aria-pressed', String(liked)); }, 'chat-reaction'); reaction.setAttribute('aria-pressed', 'false'); reaction.append(icon('heart'));
    row.append(article, reaction); feed.append(row);
  };
  frame.messages.forEach(bubble);
  // Narration belongs to the scene; only actual messages belong in the chat.
  const footer = el('footer', '', 'chat-footer');
  const replies = el('div', '', 'chat-replies');
  replies.setAttribute('role', 'group'); replies.setAttribute('aria-label', t('Выбери ответ'));
  const notice = el('p', '', 'chat-notice chat-sr-only'); notice.setAttribute('role', 'status');
  let sent = false;
  const replyButtons = [];
  const continueButton = label => {
    const next = button(label, onContinue, 'chat-next'); next.textContent = t(label); return next;
  };
  const submit = (reply, text, quote) => {
    if (sent) return;
    // Latch before invoking the callback, including synchronous repeated taps.
    sent = true; replyButtons.forEach(node => { node.disabled = true; });
    if (!onSend(reply)) { sent = false; replyButtons.forEach(node => { node.disabled = false; }); return; }
    back.disabled = false;
    bubble({ direction: 'outgoing', text, time: frame.time, quote, attachment:frame.draftAttachment });
    const next = continueButton('Продолжить историю');
    footer.replaceChildren(next, notice);
    notice.textContent = t('Сообщение отправлено');
    feed.scrollTop = feed.scrollHeight; next.focus({ preventScroll: true });
  };
  const addReply = (text, reply, quote) => {
    const node = button(text, () => submit(reply, text, quote), 'chat-reply');
    if (reply?.tone) {
      appendChoiceContents(node, { tone: reply.tone, label: text });
      node.dataset.tone = reply.tone;
    } else node.append(el('span', text, 'chat-reply-text')); replies.append(node); replyButtons.push(node);
  };
  frame.replies.forEach(reply => addReply(reply.text, reply));
  if (!frame.replies.length && frame.draft !== null) addReply(frame.draft, null, frame.draftQuote);
  let photoTimer;
  if (replyButtons.length) footer.append(replies);
  else {const next=continueButton(frame.physicalAction ? 'К действию' : 'Продолжить историю');footer.append(next);
    if(frame.delayedPhoto){
      next.disabled=true;
      const typing=el('div','','chat-row incoming');
      const indicator=el('div',frame.typingLabel,'chat-bubble incoming chat-typing');indicator.setAttribute('role','status');
      typing.append(indicator);feed.append(typing);
      photoTimer=setTimeout(()=>{typing.remove();bubble({direction:'incoming',text:'',photo:frame.delayedPhoto,time:frame.time,isNew:true});next.disabled=false;feed.scrollTop=feed.scrollHeight;},1500);
    }
  }
  footer.append(notice); root.append(header, feed, footer);
  listen(root, 'click', event => { if (!menu.contains(event.target) && !menuToggle.contains(event.target)) { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); } });
  listen(root, 'keydown', event => { if (event.key === 'Escape') { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); } });
  const measure = () => { root.style.setProperty('--chat-header-height', header.offsetHeight + 'px'); root.style.setProperty('--chat-footer-height', footer.offsetHeight + 'px'); };
  const observer = new ResizeObserver(measure); observer.observe(header); observer.observe(footer);
  const focus = requestAnimationFrame(() => { measure(); title.focus({ preventScroll: true }); feed.scrollTop = feed.scrollHeight; });
  return () => { clearTimeout(photoTimer); events.abort(); observer.disconnect(); cancelAnimationFrame(focus); };
}
