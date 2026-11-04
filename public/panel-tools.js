// Icon-only buttons in the header of a panel, to the left of the close button (used by the settings: account and home).
const svg=body=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
export const TOOL_ICONS={
 account:svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'),
 home:svg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-6h4v6"/>')
};
// items: [{id, icon, label, run}]; `translate` localises the label used for the accessible name and the tooltip.
export function panelToolButtons(items,translate=text=>text){
 return items.map(({id,icon,label,run})=>{
  const button=document.createElement('button');
  button.type='button';button.id=id;button.className='panel-tool';
  const name=translate(label);button.setAttribute('aria-label',name);button.title=name;
  button.innerHTML=TOOL_ICONS[icon];button.addEventListener('click',run);
  return button;
 });
}
