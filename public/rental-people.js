// A separate identity for the permanent flat. Older saves keep dragan/jelena.
export const RENTAL_NAMES={marko:'Марко',vuk:'Вук',stefan:'Стефан',ana:'Ана'};
export const RENTAL_EN={marko:'Marko',vuk:'Vuk',stefan:'Stefan',ana:'Ana'};
export const rentalOwner=flags=>Object.hasOwn(RENTAL_NAMES,flags?.districtOwner)?flags.districtOwner:null;
export const rentalCounterpart=flags=>({ana:'stefan',stefan:'ana',marko:'ana',vuk:'ana'})[rentalOwner(flags)]??null;
export function registerRentalPortraits(sprites){
 for(const[id,name]of Object.entries(RENTAL_NAMES)){
  sprites[id]={friendly:{file:`workshop/rental-${id}-sport-draft`,alt:name+' в спортивной одежде'}};
  for(const emotion of ['thoughtful','laughing','flirty','shy','surprised','confident','worried']){
   const regenerated=(emotion==='thoughtful'&&id!=='ana')||(emotion==='laughing'&&id==='stefan');
   sprites[id][emotion]={file:`workshop/rental-${id}-${emotion}-${regenerated?'v2':'v1'}`,alt:name+' в спортивной одежде'};
  }
 }
}
