// Legacy labels remain readable without rewriting saved logs or checkpoints.
export function familySpeaker(value){
 return ['Близкий человек','Дом','mom','Мама'].includes(value)?'Мама':value;
}
const legacyText={
 'Близкому человеку отвечаю: «Пока в аэропорту. Пью кофе. Всё нормально».':'Маме отвечаю: «Пока в аэропорту. Пью кофе. Всё нормально».',
 'Дом присылает подробное письмо: обычные новости, смешная история про соседа и осторожный вопрос о планах.':'Мама присылает подробное письмо: обычные новости, смешная история про соседа и осторожный вопрос о планах.'
};
export function familyText(value){return legacyText[value]??value;}
