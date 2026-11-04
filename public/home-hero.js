import{HOME_PORTRAITS,selectHomeComposition}from'./home-hero-model.js?v=0.17.2';
const visitSeed=Date.now();
export function renderHomeHero(home,background,cast,saved,{date=new Date(),seed=visitSeed}={}){
 const composition=selectHomeComposition(saved,{seed,hour:date.getHours()});
 home.dataset.resumable=String(!!saved);home.dataset.period=composition.period;cast.dataset.count=composition.people.length;
 const url='./assets/'+composition.background;background.src=url;home.ownerDocument.documentElement.style.setProperty('--home-art',`url('${url}')`);
 const key=[composition.background,...composition.people].join('|');
 if(cast.dataset.composition===key)return composition;
 cast.dataset.composition=key;
 cast.replaceChildren(...composition.people.map(id=>{const image=home.ownerDocument.createElement('img');image.src='./assets/'+HOME_PORTRAITS[id].file;image.alt='';image.dataset.character=id;image.decoding='async';return image;}));
 return composition;
}
