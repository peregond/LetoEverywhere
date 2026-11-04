// Normalised protected areas, measured in each original image: [left, top,
// right, bottom]. Head bounds include the hair. Detail bounds retain the prop
// or hand gesture; the rest of the image may extend outside the viewport.
const mark=(head,detail)=>({head,detail});
export const ART_FRAMES={
 'nikola-phone-buzz-v3':mark([.30,.00,.53,.23],[.08,.30,.78,.70]),
 'nikola-hug-foreground-v1':mark([.20,.00,.65,.37],[.16,.19,.86,.74]),
 'dragan-hug-neutral-male-layer-v1':mark([.19,.07,.61,.35],[.15,.27,.78,.65]),
 'dragan-hug-neutral-female-layer-v1':mark([.16,.07,.61,.38],[.16,.32,.78,.70]),
 'nikola-elder-bread-handover-v1':mark([.07,.12,.88,.37],[.27,.39,.78,.58]),
 'taxi-navigation-v1':mark([.13,.07,.46,.31],[.59,.32,.9,.53]),
 'nikola-bakery-lookback-v1':mark([.43,.30,.74,.45],[.39,.39,.76,.52]),
 'ensemble-poster-buzz-v3':mark([.12,.32,.94,.60]),
 'dragan-kitchen-coffee':mark([.16,.06,.73,.37],[.08,.58,.96,.84]),
 'dragan-kitchen-spill':mark([.20,.02,.64,.30],[.08,.29,.96,.79]),
 'dragan-kitchen-comfort':mark([.32,.21,.57,.43],[.34,.72,.69,.84]),
 'dragan-kitchen-dry':mark([.24,.05,.70,.33],[.12,.31,.92,.75]),
 'dragan-kitchen-borrowed':mark([.22,.08,.68,.34],[.17,.32,.93,.69]),
 'jelena-kitchen-coffee':mark([.17,.02,.75,.39],[.10,.49,.97,.80]),
 'jelena-kitchen-spill':mark([.18,.00,.78,.35],[.03,.31,.98,.81]),
 'jelena-kitchen-comfort':mark([.34,.20,.64,.43],[.44,.73,.66,.88]),
 'jelena-kitchen-dry':mark([.17,.03,.77,.37],[.13,.36,.98,.76]),
 'jelena-kitchen-borrowed':mark([.20,.00,.79,.34],[.20,.34,.94,.68])
};
for(const mood of ['friendly','thoughtful','laughing','flirty'])ART_FRAMES['milica-table-'+mood]=mark([.15,.00,.85,.48],[.05,.39,.98,.96]);
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
function union(areas){return [Math.min(...areas.map(a=>a[0])),Math.min(...areas.map(a=>a[1])),Math.max(...areas.map(a=>a[2])),Math.max(...areas.map(a=>a[3]))];}
export function frameArtwork(width,height,imageWidth,imageHeight,frame,{top=0,right=0,bottom=0,left=0}={}){
 const protectedArea=union([frame.head,...(frame.detail?[frame.detail]:[])]);
 const availableWidth=Math.max(1,width-left-right),availableHeight=Math.max(1,height-top-bottom);
 const scale=Math.min(Math.max(width/imageWidth,height/imageHeight),availableWidth/((protectedArea[2]-protectedArea[0])*imageWidth),availableHeight/((protectedArea[3]-protectedArea[1])*imageHeight));
 const drawnWidth=imageWidth*scale,drawnHeight=imageHeight*scale;
 const axis=(total,drawn,near,far,start,end)=>{
  const min=near-start*drawn,max=total-far-end*drawn;
  let value=(total-near-far)/2+near-(start+end)*drawn/2;
  // Keep covering the canvas if that also keeps all protected points visible.
  const coverMin=Math.max(min,total-drawn),coverMax=Math.min(max,0);
  value=coverMin<=coverMax?clamp(value,coverMin,coverMax):clamp(value,min,max);
  return value;
 };
 return {left:axis(width,drawnWidth,left,right,protectedArea[0],protectedArea[2]),top:axis(height,drawnHeight,top,bottom,protectedArea[1],protectedArea[3]),width:drawnWidth,height:drawnHeight};
}
export function positionArtwork(image,canvas,frame,safe){
 if(!image.naturalWidth||!frame||!canvas.clientWidth||!canvas.clientHeight)return;
 const box=frameArtwork(canvas.clientWidth,canvas.clientHeight,image.naturalWidth,image.naturalHeight,frame,safe);
 Object.assign(image.style,Object.fromEntries(Object.entries(box).map(([key,value])=>[key,value+'px'])));
}
