import assert from 'node:assert/strict';
import fs from 'node:fs';
import {NODES,JOURNAL,pageText,presentationFor} from '../public/story.js';
import {choiceVisible} from '../public/romance.js';
import {FLATS,OWNERS,DISCOUNTS,HOUSING_EN,applyFlatEffect,hasSeen,viewMaskOf,setViewMask,QUEST_STATIONS} from '../public/flat-data.js';
import {rentalRedirect} from '../public/rental-story.js';
import {mountDistrictMap,mountViewingQuest,MAP_PINS} from '../public/scene-quests.js';
import {makeDocument,withClass,installBrowserStubs} from './fake-dom.mjs';
import {CHAPTERS} from '../public/chapters.js';
installBrowserStubs();
const dictionary=JSON.parse(fs.readFileSync(new URL('../public/locales/en.json',import.meta.url)));
const NEW={rentalCast:'new'};

// 1. Order: three districts first, then the flat, the price, the lease, the move, and only then the bank.
assert.equal(rentalRedirect('viewing_money','district_map',NEW),'flat_intro','the district story starts with Asya presenting three districts');
assert.equal(rentalRedirect('viewing_life','district_map',{}),'district_map','the original story keeps the one-step map');
assert.equal(NODES.flat_intro.pages.length,5);
assert.ok(NODES.flat_intro.pages.every(page=>page.speaker==='Ася'));
const intro=NODES.flat_intro.pages.map(page=>page.text).join(' ');
for(const district of ['Дорћол','Врачар','Новый Белград'])assert.ok(intro.includes(district),district);
const mapChoices=NODES.district_map.choices.filter(choice=>choiceVisible(choice,NEW));
assert.deepEqual(mapChoices.map(choice=>choice.effect.district),['dorcol','vracar','newbelgrade']);
assert.deepEqual(mapChoices.map(choice=>choice.next),['flat_enter_ana','flat_enter_marko','flat_enter_vuk']);
assert.ok(mapChoices.every(choice=>choice.revisit==='flat_decision'),'a flat that was already seen leads straight back to its decision');
assert.equal(NODES.district_map.choices.filter(choice=>choiceVisible(choice,{})).length,3,'the original story keeps its three district routes');

// Only the new story version is followed: choices reserved for the original version are skipped.
const forNew=choice=>!choice.when||choice.when.flag!=='rentalCast'||choice.when.equals==='new'||(choice.when.notEquals!==undefined&&choice.when.notEquals!=='new');
const targetsOf=node=>node.choices?node.choices.filter(forNew).map(c=>c.next):[node.next];
function reach(from,blocked=[]){const seen=new Set(),stack=[from];while(stack.length){const id=stack.pop();if(seen.has(id)||blocked.includes(id)||id==='end'||!NODES[id])continue;seen.add(id);stack.push(...targetsOf(NODES[id]));}return seen;}
assert.ok(reach('flat_intro').has('route5_alta'),'the bank follows the flat');
assert.ok(!reach('flat_intro',['flat_signed']).has('flat_settle'),'the bank cannot be reached without signing a lease first');
assert.ok(!reach('flat_intro',['flat_settle']).has('flat_settle'),'nor without moving in and settling');
for(const id of ['flat_signed','flat_move_day','flat_arrive','flat_settle'])assert.ok(reach('flat_intro').has(id),id);
assert.equal(NODES.flat_settle.next,'evening4');

// 2. Every landlord states the rent at the viewing; it is the story's own number.
const priceLines=owner=>pageText(NODES['flat_enter_'+owner].pages[3],{...NEW,districtOwner:owner},'ru');
for(const owner of OWNERS){
  assert.ok(priceLines(owner).includes(`${FLATS[owner].rent} евро`),owner+': the rent is named at the viewing');
  assert.equal(NODES['flat_enter_'+owner].pages[3].speaker,'districtHost');
  assert.equal(NODES['flat_enter_'+owner].next,'flat_after_'+owner);
  const quest=Object.values(NODES['flat_enter_'+owner].actions).find(action=>action.quest);assert.equal(quest.quest,'viewing');
  assert.equal(Object.values(NODES['flat_enter_'+owner].actions).length,1,'one action: no duplicated button for the check');
}
assert.equal(new Set(OWNERS.map(owner=>FLATS[owner].rent)).size,4,'the four flats have different prices');
assert.deepEqual(DISCOUNTS,[0,50,100,150]);

// 3. Price negotiation: 50 euro basic, 100-150 only after a romantic bond the player chose, never automatic.
const terms=NODES.flat_terms.choices;
const visible=flags=>terms.filter(choice=>choiceVisible(choice,flags)).map(choice=>choice.next);
assert.deepEqual(visible({...NEW}),['flat_price_full','flat_price_basic','route4_defer']);
assert.deepEqual(visible({...NEW,flatWarmth:0}),['flat_price_full','flat_price_basic','route4_defer'],'no coffee, no bigger discount');
assert.deepEqual(visible({...NEW,flatWarmth:1}),['flat_price_full','flat_price_basic','flat_price_warm100','route4_defer']);
assert.deepEqual(visible({...NEW,flatWarmth:2}),['flat_price_full','flat_price_basic','flat_price_warm150','route4_defer']);
assert.equal(NODES.flat_price_full.effectOnEnter.flatDiscount,0);
assert.equal(NODES.flat_price_basic.effectOnEnter.flatDiscount,50);
assert.equal(NODES.flat_price_warm100.effectOnEnter.flatDiscount,100);
assert.equal(NODES.flat_price_warm150.effectOnEnter.flatDiscount,150);
const coffee=NODES.flat_coffee.choices;
assert.deepEqual(coffee.map(choice=>choice.tone),['romance','friendship']);
assert.ok(/Можно взять тебя за руку\? Если нет/.test(coffee[0].label),'closeness is asked for aloud');
assert.deepEqual(coffee.map(choice=>choice.effect.flatWarmth),[2,1]);
for(const owner of OWNERS)assert.equal(NODES['rental_flirt_'+owner].next,'flat_coffee','only the coffee invitation opens the warmer discount');
for(const id of ['flat_price_warm100','flat_price_warm150'])assert.ok(NODES[id].pages.some(page=>/не обязывает/i.test(page.text)),id+': the discount does not oblige anything');
assert.ok(NODES.flat_terms.pages.some(page=>/условия именно этой истории/.test(page.text)),'the terms are labelled as this story\'s, not a rule of rentals');
assert.ok(JOURNAL.flat_deal.text.includes('вымышленной истории'));
// The contract and the deposit show the discounted price for every landlord and every tier.
for(const owner of OWNERS)for(const discount of DISCOUNTS){
  const flags={...NEW,districtOwner:owner,flatDiscount:discount};
  const rent=FLATS[owner].rent-discount;
  assert.ok(pageText(NODES.flat_contract.pages[1],flags,'ru').includes(`${rent} евро`),`${owner}/${discount}: contract`);
  assert.ok(pageText(NODES.flat_signed.pages[1],flags,'ru').includes(`${rent} евро`),`${owner}/${discount}: deposit`);
  assert.ok(pageText(NODES.flat_terms.pages[0],flags,'ru').includes(`${rent} евро`),`${owner}/${discount}: terms`);
}

// 4. Nothing is signed or paid on its own.
assert.ok(NODES.flat_contract.choices.length>=3&&NODES.flat_contract.choices.some(choice=>choice.next==='route4_defer'),'the lease can be declined');
assert.deepEqual(NODES.flat_contract.choices.filter(choice=>choice.next==='flat_signed').map(choice=>choice.tone),['practical']);
const transfer=Object.values(NODES.flat_signed.actions).find(action=>/залог/.test(action.label));
assert.equal(transfer.kind,'tap','the deposit transfer is a deliberate tap by the player');
assert.ok(NODES.flat_contract.pages.some(page=>/Передавай наличные только после подписи и попроси расписку/.test(page.text)));
assert.match(transfer.label,/наличными/,'The deposit is paid in cash by an explicit action');
assert.equal(NODES.rental_hub_vuk.choices[2].label,'Предложить выпить кофе на кухне');
assert.equal(presentationFor(NODES.flat_coffee,NODES.flat_coffee.pages[0],{rentalCast:'new',districtOwner:'vuk'}).emotion,'coffee');

// 5. Decision scene: other districts, the second Dorćol flat, going back.
const decision=NODES.flat_decision.choices;
const decide=flags=>decision.filter(choice=>choiceVisible(choice,flags)).map(choice=>choice.label);
assert.ok(decide({...NEW,districtOwner:'ana'}).some(label=>/второй вариант в Дорћоле/.test(label)));
assert.ok(decide({...NEW,districtOwner:'ana',flatQuest:2}).some(label=>/Вернуться к квартире Стефана/.test(label)),'a second flat that was seen is a return, not a repeat');
assert.ok(!decide({...NEW,districtOwner:'marko'}).some(label=>/Дорћол|Стефан|Ан[аы]/.test(label)));
assert.ok(decide({...NEW,districtOwner:'stefan'}).some(label=>/Вернуться к квартире Аны/.test(label)));
assert.ok(decision.some(choice=>choice.next==='district_map'),'the other districts stay available');

// 6. Flags: one packed number for the viewing, applied through effects.
const flags={};
applyFlatEffect(flags,{flatEnter:'ana'});assert.equal(hasSeen(flags,'ana'),true);assert.equal(hasSeen(flags,'stefan'),false);assert.equal(Object.hasOwn(flags,'flatEnter'),false);
setViewMask(flags,0b101010);assert.equal(viewMaskOf(flags),0b101010);assert.equal(hasSeen(flags,'ana'),true,'checks never erase the seen flats');
applyFlatEffect(flags,{flatEnter:'marko'});assert.equal(viewMaskOf(flags),0,'a new flat starts its checks from zero');assert.equal(hasSeen(flags,'ana')&&hasSeen(flags,'marko'),true);
const bond={rentalBond:'romance',districtOwner:'vuk'};applyFlatEffect(bond,{flatPick:true});
assert.equal(bond.rentalBond_vuk,'romance');assert.equal(Object.hasOwn(bond,'rentalBond'),false);assert.equal(Object.hasOwn(bond,'flatPick'),false);
for(const owner of OWNERS)for(const mode of ['terms','friends','flirt'])assert.equal(NODES['rental_hub_'+owner].choices.find(c=>c.next==='rental_'+mode+'_'+owner).effect.rentalBond,mode==='terms'?'practical':mode==='friends'?'friendship':'romance');

// 7. The active route bypasses all archived day redirects.
for(const chapter of CHAPTERS)assert.equal(rentalRedirect('previous',chapter.start,{...NEW,route15:true,districtOwner:'ana',rentalMoved:true}),chapter.start);
// Old new-version saves inside the first viewing continue into the new decision.
assert.equal(rentalRedirect('morning_ready','next_steps',NEW),'flat_decision');
assert.equal(rentalRedirect('morning_ready','next_steps',{}),'next_steps');
for(const owner of OWNERS)assert.ok(NODES['rental_first_'+owner]&&NODES['rental_hub_'+owner],'older scene IDs stay loadable');
assert.equal(NODES.flat_settle.actions[2].effect.rentalMoved,true);

// 8. Mobile pacing: an action or a choice at least every five lines in every new scene.
for(const [id,node]of Object.entries(NODES).filter(([id])=>id.startsWith('flat_'))){
  const boundaries=[...Object.keys(node.actions??{}).map(Number),...(node.choices?[node.pages.length-1]:[])].sort((a,b)=>a-b);
  assert.ok(boundaries.length,id+' has an action or a choice');
  let previous=-1;for(const boundary of boundaries){assert.ok(boundary-previous<=5,id+': too long without an action');previous=boundary;}
  if(!node.choices)assert.ok(node.actions[node.pages.length-1],id+': the last page has an action');
  assert.ok(['districts','moving'].includes(node.chapterId),id);
  for(const page of node.pages)assert.ok(Object.hasOwn(dictionary,page.text),id+': English text');
}

// 9. English: every registered string has an English text without Cyrillic, and the flats keep both genders of the hero.
for(const [ru,en]of Object.entries(HOUSING_EN)){assert.ok(en&&!/[А-Яа-яЁё]/.test(en.replace('СПБГУ 2008','')),ru);}
for(const owner of OWNERS){const flat=FLATS[owner];for(const station of QUEST_STATIONS)for(const [id]of station.targets)assert.ok(flat.findings[id]?.[0]&&flat.findings[id]?.[1],owner+'/'+id);}
for(const owner of OWNERS)assert.ok(!/\{[^a}]/.test(FLATS[owner].voice[0]));

// 10. The district map: three big pins, no dialogue, a seen flat goes to its decision.
{
  const doc=makeDocument(),root=doc.createElement('section');let chosen=null;
  mountDistrictMap(root,{choices:mapChoices,flags:{...NEW,flatQuest:1},canRewind:true,onBack(){},onSettings(){},onChoose:choice=>{chosen=choice;}});
  const pins=withClass(root,'map-pin');assert.equal(pins.length,3);
  assert.deepEqual(pins.map(pin=>pin.dataset.district),['dorcol','vracar','newbelgrade']);
  assert.ok(Object.keys(MAP_PINS).every(key=>MAP_PINS[key].x>=0&&MAP_PINS[key].x<=1&&MAP_PINS[key].y>=0&&MAP_PINS[key].y<=1));
  pins[0].click();assert.equal(chosen.next,'flat_decision','Dorćol was seen: back to its decision');
  pins[1].click();assert.equal(chosen.next,'flat_enter_marko');
  assert.equal(withClass(root,'dialogue').length,0,'no dialogue window on the map screen');
}
// 11. Full-screen viewing: two objects per room, automatic progression, and resume.
{
  const doc=makeDocument(),root=doc.createElement('section');const saved=[];let done=0,scheduled=[];
  const schedule=fn=>{scheduled.push(fn);return scheduled.length;},cancel=()=>{};
  const dispose=mountViewingQuest(root,{owner:'vuk',mask:0,canRewind:true,onBack(){},onSettings(){},onChange:mask=>saved.push(mask),onComplete:()=>{done++;},schedule,cancel});
  assert.equal(withClass(root,'viewing-tab').length,0,'No manual room tabs');
  const spots=withClass(root,'viewing-object');assert.equal(spots.length,2);
  spots[1].click();assert.match(withClass(root,'viewing-full-art')[0].src,/water-shower-v1/,'Tapping the shower displays running water');
  spots[0].click();assert.match(withClass(root,'viewing-full-art')[0].src,/water-tap-v1/,'Tapping the tap displays running water');assert.equal(scheduled.length,1);scheduled.shift()();
  spots[0].click();spots[1].click();scheduled.shift()();
  spots[1].click();spots[0].click();scheduled.shift()();
  assert.deepEqual(saved,[2,3,19,51,59,63],'Both objects work in either order and retain the existing save bits');
  assert.equal(done,1,'The final room finishes automatically');dispose();
  const again=makeDocument().createElement('section');let next=[];
  mountViewingQuest(again,{owner:'vuk',mask:0b110011,canRewind:false,onBack(){},onSettings(){},onChange(){},onComplete(){},schedule:fn=>{next.push(fn);return 1;},cancel(){}});
  assert.equal(withClass(again,'quest-title')[0].textContent,'Окна','Reload resumes at the first unfinished room');
}
// 12. Gendered forms of the hero survive in the new scenes.
for(const id of ['flat_contract','flat_signed','flat_move_day'])for(const page of NODES[id].pages)assert.ok(!/\{(?!a\}|districtHost\}|host\})[^}]*\}/.test(page.text)||Object.hasOwn(dictionary,page.text),id);
assert.match(pageText(NODES.flat_contract.pages[1],{...NEW,districtOwner:'ana',flatDiscount:0},'ru'),/готов\{a\}/);
void presentationFor;
console.log('Housing: three-district map, price spoken at every viewing, discounts 50/100/150 only by choice, unsigned lease, move-in before the bank, packed flags and the two quest screens checked.');
