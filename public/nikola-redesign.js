// One visual identity across the airport, daydreams and evening scenes.
// Original assets remain available for editorial comparison.
export function registerNikolaRedesign(sprites){
 for(const mood of ['friendly','thoughtful','surprised','shy','laughing','flirty'])sprites.nikola[mood].file=`nikola-${mood}-buzz-v3`;
 sprites.nikola.phone={file:'nikola-phone-buzz-v3',alt:'Никола держит телефон и круассан'};
 for(const [mood,file]of Object.entries({'dream-confident':'bare','dream-laughing':'laughing','dream-shy':'shy','dream-cream':'cream','dream-coffee':'coffee'}))sprites.nikola[mood].file=`nikola-dream-${file}-buzz-v3`;
 for(const mood of ['friendly','thoughtful','laughing','flirty'])sprites['nikola-evening'][mood].file=`nikola-evening-${mood}-buzz-v3`;
}
