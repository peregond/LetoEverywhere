import assert from 'node:assert/strict';
import {test} from 'node:test';
import {story} from '../public/georgia/story.js';

test('Telavi is reachable from the airport and reaches the final sequence',()=>{
 const route=story.destination.choices.find(choice=>choice.set?.route==='telavi');
 assert.equal(route.next,'telavi_start');assert.equal(story.destination.choices.find(choice=>choice.label.includes('Батуми')).disabled,true);
 const visited=new Set();let id=route.next;
 while(!['telavi_makeup','telavi_ending'].includes(id)){
  assert.ok(!visited.has(id),`Unexpected loop at ${id}`);visited.add(id);
  const node=story[id];assert.ok(node,`Missing scene ${id}`);
  if(node.choices){assert.equal(node.choices.length,1);id=node.choices[0].next}else id=node.next;
 }
 assert.equal(id,'telavi_makeup');assert.ok(visited.has('telavi_dog'));assert.ok(visited.has('telavi_contact'));assert.equal(story.telavi_contact.choices[0].set.hasWrestlerContact,true);
 id='telavi_after_makeup';while(id!=='telavi_ending'){assert.ok(!visited.has(id));visited.add(id);const node=story[id];assert.ok(node,`Missing scene ${id}`);id=node.next}
 for(const id of ['telavi_warning','telavi_balcony1','telavi_balcony2','telavi_pop','telavi_knock','telavi_fist','telavi_hospital','telavi_news1','telavi_truth'])assert.ok(visited.has(id),id);
 assert.equal(story.telavi_warning.onEnter.hasSeenHotelBalconyWarning,true);assert.equal(story.telavi_balcony1.onEnter.hotelBalconyVisits,1);assert.equal(story.telavi_balcony2.onEnter.hotelBalconyVisits,2);assert.equal(story.telavi_pop.onEnter.champagneIncident,true);
 assert.match(story.telavi_news1.speaker,/вымышленный сюжет \/ пародия/i);assert.match(story.telavi_truth.text,/шампанского/);
});
