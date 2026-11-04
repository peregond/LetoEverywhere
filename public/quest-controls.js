// Shared icon buttons for all full-screen activities.
const icons={back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',settings:'<path d="m9 3-.5 2-2 1-2-.5L2 10l1.5 1.5v2L2 15l2.5 4.5 2-.5 2 1 .5 2h6l.5-2 2-1 2 .5L22 15l-1.5-1.5v-2L22 10l-2.5-4.5-2 .5-2-1L15 3H9Z"/><circle cx="12" cy="12" r="3"/>'};
export function setQuestIcon(button,kind,label){
 button.setAttribute('aria-label',label);button.setAttribute('title',label);
 button.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[kind]}</svg>`;
 return button;
}
