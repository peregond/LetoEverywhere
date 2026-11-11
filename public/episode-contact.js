import{t}from'./i18n.js?v=0.17.26';
// A remote speaker stays visibly separate from the player's physical location.
export function renderEpisodeContact(root,contact){
 root.hidden=!contact;
 if(!contact){root.replaceChildren();delete root.dataset.character;return;}
 root.dataset.character=contact.character;
 const doc=root.ownerDocument;
 const photo=doc.createElement('span');photo.className='episode-contact-photo';
 const image=doc.createElement('img');image.src='./assets/'+contact.file;image.alt=t(contact.alt);photo.append(image);
 const copy=doc.createElement('span');copy.className='episode-contact-copy';
 const name=doc.createElement('strong');name.textContent=t(contact.name);
 const channel=doc.createElement('small');channel.textContent=t(contact.channel);
 copy.append(name,channel);root.replaceChildren(photo,copy);
}
