// Dense sex narration for evening packs (male player POV), in the register of nikola-early-night.js.
// Kept separate so adult-cast.js stays about voice/setting; this file is the physical beat.
import {T} from './days.js?v=0.17.2';

const p=(ru,en)=>[ru,en];

/** Shared beat builders — insert character-specific cloth/body/smell/name. */
export function maleSexBeats(c){
 const n=c.name[0], nEn=c.name[1];
 const cloth=c.cloth[0], clothEn=c.cloth[1];
 const ready=c.ready[0], readyEn=c.ready[1];
 const smell=c.smell[0], smellEn=c.smell[1];
 return {
  door:[
   p(`Я прижимаю его к двери. Он ${c.body[0]} — выше или шире меня, но податливый: раскрывает рот под поцелуем, трётся стояком о бедро через ${cloth}, тяжело дышит мне в шею. Пахнет ${smell}.`,
     `I pin him to the door. He is ${c.body[1]} — taller or broader than me, but pliant: he opens his mouth under the kiss, rubs his hard-on against my thigh through ${clothEn}, breathes hard into my neck. It smells of ${smellEn}.`),
   p(...c.doorLine),
   p(`Я расстёгиваю на нём рубашку, ладонью веду по груди к животу, ниже — к резинке. Он всхлипывает в поцелуй и кивает на спальню.`,
     `I unbutton his shirt, run my palm down his chest to his stomach, then lower to the waistband. He gasps into the kiss and nods toward the bedroom.`),
   p(`«В спальню. Хочу видеть, как ты стонешь без стен между нами.»`,
     `“Bedroom. I want to see you moan with no walls between us.”`)
  ],
  fade:[
   p(`Он скидывает рубашку на пол — без футболки, голый торс. ${c.body[0][0].toUpperCase()+c.body[0].slice(1)} блестит в свете лампы. На нём только ${cloth}: узкая резинка, ткань спереди уже тёмная от смазки. Толстый член натягивает speedo так, что виден рельеф головки и ствола.`,
     `He drops the shirt on the floor — no T-shirt, bare torso. ${c.body[1][0].toUpperCase()+c.body[1].slice(1)} gleams in the lamp light. He wears only ${clothEn}: a narrow waistband, the fabric in front already dark with precum. His thick cock stretches the speedos so the outline of the head and shaft shows.`),
   p(...c.touchLine),
   p(`Я провожу ладонью по натянутому холму. Он дёргается под пальцами, стонет сквозь зубы. Я сжимаю сильнее — жар, пульс, яйца поджаты в speedo. Большим пальцем даю по головке через ткань: ${n} дёргает бёдрами вперёд.`,
     `I run my palm over the stretched bulge. It twitches under my fingers; he moans through his teeth. I squeeze harder — heat, pulse, his balls drawn tight in the speedo. With my thumb I press the head through the fabric: ${nEn} jerks his hips forward.`),
   p(`«На колени. Сними их… нет, стой. Сначала ${ready}. Хочу тебя в ${ready}, когда буду входить.»`,
     `“On your knees. Take them off… no, wait. ${readyEn} first. I want you in ${readyEn} when I push in.”`),
   p(`Он кивает, голос сиплый: «Секунду… они в ящике.» Руки дрожат, когда тянется к тумбочке.`,
     `He nods, voice hoarse: “One second… they are in the drawer.” His hands shake as he reaches for the nightstand.`)
  ],
  prep:[
   p(`Он натягивает ${ready}: узкий пояс, ткань держит тяжёлые яйца и стояк; когда speedo спущены под ягодицы, зад полностью открыт — круглые, плотные. Между щёк уже блестит, когда он встаёт на четвереньки на простыне и оглядывается через плечо.`,
     `He pulls on ${readyEn}: a narrow waistband, the fabric holding heavy balls and his hard cock; with the speedos under his ass, his rear is fully bare — round, firm. Between the cheeks it already gleams as he gets on all fours on the sheet and looks back over his shoulder.`),
   p(...c.prepAsk),
   p(`Я обливаю пальцы смазкой, кружу по сжатому кольцу, вхожу одним — жарко, узко. ${n} роняет голову в подушку, подаётся назад. «Ещё…» Второй палец. Он матерится по-сербски и по-русски сразу, дышит рвано.`,
     `I pour lube on my fingers, circle his tight ring, push one in — hot, narrow. ${nEn} drops his head into the pillow and pushes back. “More…” Second finger. He swears in Serbian and Russian at once, breathing ragged.`),
   p(`Я развожу пальцы, растягиваю его медленно, свободной рукой глажу поясницу и speedo. Он мокрый спереди от собственной смазки.`,
     `I scissor my fingers, stretch him slowly, stroke his lower back and the speedo pouch with my free hand. He is wet in front from his own precum.`),
   p(`«Сейчас войду. Скажи «да».» — «${c.yesIn[0]}»`,
     `“I am going in now. Say ‘yes’.” — “${c.yesIn[1]}”`)
  ],
  sex:[
   p(`Головка упирается, проходит — он орёт в подушку, потом рвано смеётся. Я держу его за бёдра и медленно вхожу целиком: ${ready} натянуты на бёдрах, спина выгибается, мышцы на пояснице ходят.`,
     `The head presses, slips in — he cries into the pillow, then laughs roughly. I hold his hips and slowly bury myself to the hilt: the ${readyEn} tight around his thighs, his back arching, the muscles along his spine working.`),
   p(`Первые толчки короткие. Я даю ему привыкнуть, целую лопатку, шепчу «хорошо?» — он кивает и подаётся назад сам, насаживаясь глубже.`,
     `The first thrusts are short. I let him adjust, kiss his shoulder blade, whisper “all right?” — he nods and pushes back himself, taking me deeper.`),
   p(`Когда я начинаю двигаться жёстче, мошонка шлёпает о его, смазка хлюпает, кровать стучит о стену. Пахнет ${smell}, потом и сексом.`,
     `When I start thrusting harder, my sack slaps his, lube squelches, the bed knocks the wall. It smells of ${smellEn}, then of sex too.`),
   p(...c.during),
   p(`Я ускоряюсь. Он встречает каждый толчок, speedo мокрые спереди, голос срывается на стон. «${c.warn[0]}»`,
     `I speed up. He meets every thrust, the speedo wet in front, his voice breaking into a moan. “${c.warn[1]}”`)
  ],
  sexDeep:[
   p(`Я прижимаю его грудью к матрасу, меняю угол — и он всхлипывает уже без слов. Член ходит в нём легко, горячо; я чувствую, как он пульсирует вокруг меня.`,
     `I press his chest into the mattress, change the angle — and he gasps without words. My cock moves in him easy and hot; I feel him pulse around me.`),
   p(`Одной рукой я обхватываю speedo, сжимаю его стояк через ткань в такт толчкам. ${n} дрожит бёдрами и шепчет моё имя между стонами.`,
     `With one hand I cup the speedo pouch, squeeze his hard-on through the fabric in time with the thrusts. ${nEn} shakes his hips and whispers my name between moans.`),
   p(`«Не останавливайся… ещё, глубже.» Я вколачиваюсь до упора, потом почти выхожу — и снова. Простыня сбита, лампа качает тень по стене.`,
     `“Do not stop… more, deeper.” I slam in to the hilt, then almost pull out — and again. The sheet is rumpled, the lamp swings shadow across the wall.`),
   p(`Он сжимается сильнее. Я чувствую, что близко — и он тоже: дыхание рваное, пальцы вцепились в простыню.`,
     `He clamps harder. I feel I am close — and so is he: ragged breath, fingers locked in the sheet.`),
   p(`«Куда кончить?» — спрашиваю хрипло. Он оглядывается через плечо, глаза мокрые, улыбка кривая: «Куда скажешь. Только предупреди.»`,
     `“Where do I finish?” I ask roughly. He looks back over his shoulder, eyes wet, smile crooked: “Wherever you say. Just warn me.”`)
  ],
  cumInside:[
   p(`Я вколачиваюсь до упора и кончаю в него — густыми толчками, удерживая бёдра. ${n} сжимается вокруг члена так сильно, что в глазах темнеет; его собственный стояк дёргается в speedo, и он кончает следом, заливая ткань изнутри тёплым.`,
     `I slam in to the hilt and cum inside him — thick pulses, gripping his hips. ${nEn} clamps around my cock so hard my vision darkens; his own erection jerks in the speedo and he cums right after, flooding the fabric from inside with heat.`),
   p(...c.cumIn),
   p(`Когда я медленно выхожу, сперма тянется нитью из его раскрытой дырки и капает на простыню между разведённых колен. Speedo мокрые спереди. Он дрожит и смеётся в голос.`,
     `When I slowly pull out, cum stretches in a string from his open hole and drips onto the sheet between his spread knees. The speedo is soaked in front. He trembles and laughs out loud.`),
   p(`Я глажу его поясницу, собираю каплю пальцем. Он ловит мой взгляд и кивает: останься рядом.`,
     `I stroke his lower back, gather a drop on my finger. He catches my eye and nods: stay close.`)
  ],
  cumCloth:[
   p(`Я вытаскиваю мокрый член в последний момент и дрочу над ним. ${n} на четвереньках подставляет зад и оглядывается — и я крою ${ready} густыми струями: на пояс, на натянутый мешочек, на голую поясницу, пока сперма не стекает по яйцам на простыню.`,
     `I pull my wet cock out at the last second and stroke over him. ${nEn} on all fours offers his ass and looks back — and I paint ${readyEn} with thick ropes: on the waistband, on the stretched pouch, on his bare lower back, until cum runs down his balls onto the sheet.`),
   p(...c.cumCloth),
   p(`Он проводит пальцем по белой/тёмной ткани, собирает каплю и облизывает, глядя на меня. Член у него всё ещё стоит, измазанный моим финишем.`,
     `He runs a finger over the fabric, gathers a drop and licks it while looking at me. His cock is still hard, smeared with my finish.`),
   p(`Я прижимаюсь грудью к его спине, целую шею. Он смеётся хрипло: «Грязно. И правильно.»`,
     `I press my chest to his back, kiss his neck. He laughs roughly: “Filthy. And right.”`)
  ],
  cumChest:[
   p(`Я вытаскиваю, переворачиваю его на спину. Speedo сбиты набок, член шлёпает о живот. Я сажусь ему на бёдра и кончаю на широкую грудь — белые полосы по коже, на соски, на шею, одна капля на нижнюю губу.`,
     `I pull out and flip him onto his back. The speedo is shoved aside, his cock slaps his stomach. I straddle his thighs and cum on his broad chest — white stripes across the skin, on his nipples, on his throat, one drop on his lower lip.`),
   p(...c.cumChest),
   p(`Он тянет меня в поцелуй, размазывая сперму между нами. Под speedo его член всё ещё твёрдый; я сжимаю мешочек ладонью, и он кончает себе на живот, добавляя к моим следам.`,
     `He pulls me into a kiss, smearing cum between us. Under the speedo his cock is still hard; I squeeze the pouch in my palm and he cums onto his own stomach, adding to my marks.`),
   p(`Мы дышим в одном ритме. Лампа качает тень. Пахнет ${smell} и нами.`,
     `We breathe in one rhythm. The lamp swings its shadow. It smells of ${smellEn} and of us.`)
  ]
 };
}

export function femaleSexBeats(c){
 const n=c.name[0], nEn=c.name[1];
 const cloth=c.cloth[0], clothEn=c.cloth[1];
 const ready=c.ready[0], readyEn=c.ready[1];
 const smell=c.smell[0], smellEn=c.smell[1];
 return {
  door:[
   p(`Я прижимаю её к двери. Она ${c.body[0]}: раскрывает рот под поцелуем, прижимается бёдрами, тяжело дышит мне в шею. Пахнет ${smell}.`,
     `I pin her to the door. She is ${c.body[1]}: she opens her mouth under the kiss, presses her hips to me, breathes hard into my neck. It smells of ${smellEn}.`),
   p(...c.doorLine),
   p(`Я веду ладонь под край одежды, по тёплой коже к бедру. Она всхлипывает и кивает на спальню.`,
     `I slide my palm under the edge of her clothes, over warm skin to her thigh. She gasps and nods toward the bedroom.`),
   p(`«В спальню. Хочу видеть тебя.»`,
     `“Bedroom. I want to see you.”`)
  ],
  fade:[
   p(`Она скидывает одежду. Остаётся в ${cloth}. Соски просвечивают сквозь ткань; между ног уже влажно. В свете лампы кожа кажется горячее.`,
     `She drops her clothes. She is left in ${clothEn}. Her nipples show through the fabric; she is already wet between her legs. In the lamp light her skin looks hotter.`),
   p(...c.touchLine),
   p(`Я провожу ладонью по груди, ниже — по кружеву. Она всхлипывает, разводит колени. Пальцем через ткань нахожу мокрое тепло — она дёргает бёдрами навстречу.`,
     `I run my palm over her chest, then lower over the lace. She gasps and parts her knees. Through the fabric my finger finds wet heat — she jerks her hips toward me.`),
   p(`«Ложись. Хочу видеть тебя, когда буду входить.»`,
     `“Lie back. I want to see you when I push in.”`),
   p(`Она тянет меня за запястье к кровати: «Иди ко мне.»`,
     `She pulls me by the wrist to the bed: “Come to me.”`)
  ],
  prep:[
   p(`Она в ${ready}. Я обливаю пальцы смазкой, кружу по клитору, вхожу одним — жарко, узко. ${n} роняет голову в подушку и выдыхает сквозь зубы.`,
     `She is in ${readyEn}. I pour lube on my fingers, circle her clit, push one in — hot, narrow. ${nEn} drops her head into the pillow and exhales through her teeth.`),
   p(...c.prepAsk),
   p(`Второй палец. Она подаётся навстречу, шепчет «да», сжимается вокруг пальцев. Свободной рукой глажу бедро, целовую ключицу.`,
     `Second finger. She pushes back, whispers “yes”, clamps around my fingers. With my free hand I stroke her thigh, kiss her collarbone.`),
   p(`Я медленно растягиваю её, слушаю дыхание. Когда она кивает снова, вынимаю пальцы — они блестят.`,
     `I stretch her slowly, listening to her breath. When she nods again, I pull my fingers out — they gleam.`),
   p(`«Сейчас войду. Скажи «да».» — «${c.yesIn[0]}»`,
     `“I am going in now. Say ‘yes’.” — “${c.yesIn[1]}”`)
  ],
  sex:[
   p(`Головка упирается, проходит — она стонет и цепляется за простыню. Я вхожу медленно до конца, даю ей привыкнуть, целую висок.`,
     `The head presses, slips in — she moans and grips the sheet. I push in slowly to the hilt, let her adjust, kiss her temple.`),
   p(`Первые толчки короткие. Она поднимает бёдра навстречу, обхватывает меня ногами. «Ещё… вот так.»`,
     `The first thrusts are short. She lifts her hips to meet me, wraps her legs around me. “More… like that.”`),
   p(`Когда я двигаюсь жёстче, кровать стучит о стену. Пахнет ${smell} и нами. Кружево сбито набок, её дыхание рваное.`,
     `When I thrust harder, the bed knocks the wall. It smells of ${smellEn} and of us. The lace is shoved aside, her breath ragged.`),
   p(...c.during),
   p(`Я ускоряюсь. Она встречает каждый толчок. «${c.warn[0]}»`,
     `I speed up. She meets every thrust. “${c.warn[1]}”`)
  ],
  sexDeep:[
   p(`Я поднимаю её бедро выше, меняю угол — и она всхлипывает уже без слов. Внутри жарко и узко; я чувствую, как она пульсирует вокруг меня.`,
     `I lift her thigh higher, change the angle — and she gasps without words. Inside it is hot and narrow; I feel her pulse around me.`),
   p(`Большим пальцем глажу клитор в такт толчкам. ${n} дрожит, кусает губу, шепчет моё имя.`,
     `With my thumb I stroke her clit in time with the thrusts. ${nEn} trembles, bites her lip, whispers my name.`),
   p(`«Не останавливайся… глубже.» Я вколачиваюсь до упора, потом почти выхожу — и снова. Простыня мокрая между нами.`,
     `“Do not stop… deeper.” I slam in to the hilt, then almost pull out — and again. The sheet is wet between us.`),
   p(`Она сжимается сильнее. Я чувствую, что близко — и она тоже: глаза закрыты, пальцы вцепились мне в плечи.`,
     `She clamps harder. I feel I am close — and so is she: eyes closed, fingers locked on my shoulders.`),
   p(`«Куда кончить?» — спрашиваю хрипло. Она открывает глаза: «Куда скажешь. Только скажи вслух.»`,
     `“Where do I finish?” I ask roughly. She opens her eyes: “Wherever you say. Just say it aloud.”`)
  ],
  cumInside:[
   p(`Я вколачиваюсь до упора и кончаю в неё — густыми толчками. ${n} сжимается вокруг члена и кончает следом, дрожа, с стоном в моё плечо.`,
     `I slam in to the hilt and cum inside her — thick pulses. ${nEn} clamps around my cock and cums right after, shaking, moaning into my shoulder.`),
   p(...c.cumIn),
   p(`Когда я медленно выхожу, сперма тянется нитью на простыню между разведённых колен. Она дышит часто и смеётся тихо.`,
     `When I slowly pull out, cum stretches in a string onto the sheet between her spread knees. She breathes fast and laughs softly.`),
   p(`Я глажу её живот, целую ключицу. Она держит меня за запястье: не уходи сразу.`,
     `I stroke her stomach, kiss her collarbone. She holds my wrist: do not leave yet.`)
  ],
  cumCloth:[
   p(`Я вытаскиваю в последний момент и кончаю на ${ready} — густые струи на кружево и живот, капля стекает к бедру.`,
     `I pull out at the last second and cum on ${readyEn} — thick ropes on the lace and her stomach, a drop running toward her thigh.`),
   p(...c.cumCloth),
   p(`Она проводит пальцем по ткани, смотрит на меня и улыбается криво: наша тайна.`,
     `She runs a finger over the fabric, looks at me and smiles crookedly: our secret.`),
   p(`Я ложусь рядом, прижимаюсь лбом к её лбу. Пахнет ${smell} и нами.`,
     `I lie beside her, press my forehead to hers. It smells of ${smellEn} and of us.`)
  ],
  cumChest:[
   p(`Я кончаю ей на грудь — белые полосы на коже, на соски, капля на ключице. Она смотрит снизу вверх и не отводит взгляд.`,
     `I cum on her chest — white stripes on her skin, on her nipples, a drop on her collarbone. She looks up at me and does not look away.`),
   p(...c.cumChest),
   p(`Она тянет меня в поцелуй, размазывая тепло между нами. Я глажу её между ног — и она кончает следом, дрожа у меня на ладони.`,
     `She pulls me into a kiss, smearing the heat between us. I stroke her between the legs — and she cums right after, shaking in my palm.`),
   p(`Мы лежим, пока дыхание не выровняется. Лампа качает тень.`,
     `We lie until our breath evens out. The lamp swings its shadow.`)
  ]
 };
}

export function linesOf(beats){
 return beats.map(([ru,en])=>({speaker:'narrator',text:T(ru,en),portrait:false}));
}

export function spoken(id,pair,emotion='flirty'){
 return {speaker:id,text:T(...pair),emotion,portrait:false};
}
