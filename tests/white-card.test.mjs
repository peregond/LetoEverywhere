import assert from 'node:assert/strict';
import {NODES,presentationFor,pageText} from '../public/story.js';
import {rentalRedirect} from '../public/rental-story.js';
import {choiceVisible} from '../public/romance.js';
import {mountWhiteCard} from '../public/white-card.js';
import {makeDocument,withClass,installBrowserStubs} from './fake-dom.mjs';
installBrowserStubs();
for(const owner of ['ana','stefan','marko','vuk']){
 const flags={rentalCast:'new',rentalMoved:true,districtOwner:owner,bankChoice:'alta'};
 assert.equal(rentalRedirect('third_morning','bank_visit',flags),'white_card_visit');
 assert.equal(presentationFor(NODES.white_card_visit,NODES.white_card_visit.pages[1],flags).character,owner);
 assert.equal(rentalRedirect('white_card_visit','bank_visit',flags),'bank_visit_alta');
 assert.equal(rentalRedirect('third_morning','bank_visit',{...flags,whiteCardDone:true}),'bank_visit_alta');
}
assert.equal(rentalRedirect('third_morning','bank_visit',{}),'bank_visit');
assert.equal(NODES.white_card_visit.pages[2].action.quest,'white-card');
assert.equal(NODES.white_card_visit.pages[2].action.effect.whiteCardDone,true);
assert.match(pageText(NODES.d4_station.pages[0],{whiteCardDone:true}),/уже лежит/);
assert.equal(NODES.d4_start.choices.filter(c=>c.next==='d4_station'&&choiceVisible(c,{whiteCardDone:true})).length,1);
const root=makeDocument().createElement('section'),steps=[];let done=0;
let dispose=mountWhiteCard(root,{owner:'vuk',onChange:x=>steps.push(x),onComplete:()=>done++,onBack(){},onSettings(){},canRewind:true});
withClass(root,'passport')[0].click();withClass(root,'lease')[0].click();
let options=withClass(root,'white-card-choice');options[0].click();assert.deepEqual(steps,[1,2],'Wrong address does not advance');options[2].click();
withClass(root,'white-card-stamp')[0].click();assert.deepEqual(steps,[1,2,3,4]);assert.equal(done,0);withClass(root,'white-card-finish')[0].click();assert.equal(done,1);dispose();
dispose=mountWhiteCard(root,{owner:'ana',step:3,onComplete(){},onBack(){},onSettings(){},canRewind:false});assert.equal(withClass(root,'white-card-stamp').length,1,'Saved progress resumes at the stamp');dispose();
console.log('White card follows the move on the next morning, respects owners and saved completions, and verifies the correct district.');
