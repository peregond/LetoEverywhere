import assert from 'node:assert/strict';
import {ART_FRAMES,frameArtwork} from '../public/art-framing.js';
const sizes=[[402,550,124],[320,404,116],[440,650,124],[874,350,62],[402,450,124]];
for(const [id,frame]of Object.entries(ART_FRAMES))for(const [w,h,top]of sizes){
 const expanded=id.endsWith('-comfort');
 const iw=expanded?1122:id.startsWith('milica')?1254:id.startsWith('ensemble-poster-')?820:941,ih=expanded?1402:id.startsWith('milica')?1254:id.startsWith('ensemble-poster-')?1918:1672;
 const box=frameArtwork(w,h,iw,ih,frame,{top,bottom:8,left:8,right:8});
 assert.ok(Object.values(box).every(Number.isFinite));assert.ok(box.width>0&&box.height>0);
 assert.ok(Math.abs(box.width/box.height-iw/ih)<1e-8,'Original image proportions must stay unchanged');
 for(const area of [frame.head,...(frame.detail?[frame.detail]:[])]){
  assert.ok(box.left+area[0]*box.width>=8-1e-6,id+' left');
  assert.ok(box.left+area[2]*box.width<=w-8+1e-6,id+' right');
  assert.ok(box.top+area[1]*box.height>=top-1e-6,id+' hair/top');
  assert.ok(box.top+area[3]*box.height<=h-8+1e-6,id+' chin/detail bottom');
 }
}
console.log('All original image proportions retained; full heads and marked hands/prints stay visible across phone and landscape frames.');
