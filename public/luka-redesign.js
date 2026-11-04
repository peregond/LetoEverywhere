// Luka uses the user's portrait reference consistently across all four moods.
export function registerLukaSport(sprites){
 for(const mood of ['friendly','thoughtful','laughing','flirty'])sprites.luka[mood].file=`luka-reference-${mood}-v3`;
}
