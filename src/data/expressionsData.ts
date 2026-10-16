import { SignExpression } from '../types';

export const sampleExpressions: SignExpression[] = [
  {
    id: 'exp-1',
    word: 'Assalomu alaykum',
    category: 'Salomlashish',
    meaning: 'Tinchlik va omonlik tilash, an’anaviy o‘zbekcha salomlashish.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Ochiq kaft, barmoqlar jips',
    movement: 'O‘ng qo‘l ko‘krakning chap qismiga (yurak ustiga) qo‘yiladi, yengil ta’zim bilan suhbatdoshga tabassum qilinadi.',
    facialExpression: 'Iliq, samimiy tabassum va ochiq ko‘z nigohi.',
    culturalContext: 'O‘zbek madaniyatida chuqur hurmat va mehr ramzi.',
    exampleSentence: 'Assalomu alaykum, darsimizga xush kelibsiz!',
    steps: [
      '1. Qomatingizni to‘g‘ri tuting va suhbatdoshga qarang.',
      '2. O‘ng qo‘l kaftingizni yurak sohasiga mayin qo‘ying.',
      '3. Boshingizni yengil egib samimiy tabassum qiling.'
    ]
  },
  {
    id: 'exp-2',
    word: 'Rahmat',
    category: 'Salomlashish',
    meaning: 'Minnatdorchilik va tashakkur bildirish.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Yassi tekis kaft, yuqoriga qaragan',
    movement: 'Kaft iyak oldidan boshlanib, suhbatdosh tomonga biroz pastga mayin yo‘naltiriladi.',
    facialExpression: 'Minnatdor tabassum, boshning bir marta yengil egilishi.',
    culturalContext: 'Har qanday yaxshilik va yordam uchun aytiladigan samimiy so‘z.',
    exampleSentence: 'Katta rahmat, siz menga juda yordam berdingiz.',
    steps: [
      '1. O‘ng qo‘l barmoq uchlarini iyak ostiga yaqin keltiring.',
      '2. Kaftni oldinga, suhbatdosh tomon ohista oching.',
      '3. Yuzingizda samimiy minnatdorchilik ifodasini namoyon eting.'
    ]
  },
  {
    id: 'exp-3',
    word: 'Ona (Onajon)',
    category: 'Oila',
    meaning: 'Eng ardoqli inson — ona ifodasi.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Ochiq kaft yoki bosh barmoq iyak/yonoq sohasida',
    movement: 'O‘ng qo‘l bosh barmog‘i yanoq yoki iyak qismiga ikki marta mayin tegiziladi.',
    facialExpression: 'Cheksiz mehr va iliqlik aks etgan ko‘zlar.',
    culturalContext: 'Oila a’zolarini bildiruvchi imo-ishoralarda ayollar odatda yanoq yoki sirg‘a sohasi bilan bog‘lanadi.',
    exampleSentence: 'Onam menga yangi kitob sovg‘a qildilar.',
    steps: [
      '1. O‘ng qo‘l bosh barmog‘ini o‘ng yanoqqa tutashtiring.',
      '2. Ikki marta ohista teginish harakatini bajaring.',
      '3. Mehrli va sokin tabassum bilan tasdiqlang.'
    ]
  },
  {
    id: 'exp-4',
    word: 'Ota (Otajon)',
    category: 'Oila',
    meaning: 'Oila tayanchi — ota ifodasi.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Ochiq kaft, bosh barmoq peshona/chakka sohasida',
    movement: 'O‘ng qo‘l bosh barmog‘i peshona yon qismiga tegiziladi va biroz oldinga tushiriladi.',
    facialExpression: 'Jiddiy, xotirjam va hurmatli nigoh.',
    culturalContext: 'Erkak qarindoshlar ko‘pincha peshona yoki mo‘ylov sohasi bilan ifodalanadi.',
    exampleSentence: 'Otam ishdan keldilar, birga dars qilamiz.',
    steps: [
      '1. Bosh barmoqni peshona yoki chakka sohasiga tekkizing.',
      '2. Qo‘lni pastga va oldinga ehtirom bilan tushiring.',
      '3. Hurmatli va xotirjam yuz ifodasini saqlang.'
    ]
  },
  {
    id: 'exp-5',
    word: 'Suv',
    category: 'Taomlar',
    meaning: 'Ichimlik suvi yoki chanqoqni qondirish.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'W yoki ko‘rsatkich barmoq lab oldida',
    movement: 'Ko‘rsatkich barmoq yoki "S" daktil harfi labga bir-ikki marta tegiziladi.',
    facialExpression: 'Ehtiyojni bildiruvchi tabiiy holat.',
    exampleSentence: 'Iltimos, menga bir stakan toza suv bering.',
    steps: [
      '1. Barmoqni lab chetiga tekkizing.',
      '2. Ichish harakatini vizual ifodalang.',
      '3. Lab orqali "suv" artikulyatsiyasini takrorlang.'
    ]
  },
  {
    id: 'exp-6',
    word: 'Non',
    category: 'Taomlar',
    meaning: 'Dasturxon ko‘rki bo‘lgan muqaddas non.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Ikki qo‘l non sindirish holatida',
    movement: 'Ikki qo‘l bilan go‘yo issiq nonni o‘rtasidan sindirib bo‘lish harakati bajariladi.',
    facialExpression: 'Rizqqa ehtirom ifodasi.',
    culturalContext: 'O‘zbek xalqida nonni hurmat qilish va sindirib ulashish an’anasi.',
    exampleSentence: 'Issiq non dasturxonga tortildi.',
    steps: [
      '1. Ikkala qo‘lni ko‘krak oldida ushlang.',
      '2. Go‘yo nonni ikkiga sindirayotgandek bilaklarni tashqariga eging.',
      '3. Qaynoq non hissini ifodalang.'
    ]
  },
  {
    id: 'exp-7',
    word: 'Kitob',
    category: 'Maktab',
    meaning: 'O‘qish va ilm manbai bo‘lgan kitob.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Ikki kaft birlashgan, so‘ng ochiluvchi kitob shakli',
    movement: 'Kaftlar avval bir-biriga jips tutiladi, so‘ngra kitob ochilgandek yon tomonga yoyiladi.',
    facialExpression: 'Qiziquvchan va diqqatli nigoh.',
    exampleSentence: 'Keling, birgalikda qiziqarli kitob o‘qiymiz.',
    steps: [
      '1. Ikki kaftni xuddi yopiq kitobdek bir-biriga birlashtiring.',
      '2. Kichik barmoqlar tutashgan holda kitobni asta oching.',
      '3. Ko‘zlaringiz bilan kitob varaqlayotgandek qarang.'
    ]
  },
  {
    id: 'exp-8',
    word: 'Maktab',
    category: 'Maktab',
    meaning: 'Ta’lim maskani, o‘quv dargohi.',
    difficulty: 'O‘rta',
    isVerified: true,
    handShape: 'Ikki qo‘l kaftlari bir-biriga ustma-ust yengil uriladi',
    movement: 'Chap kaft gorizontal, o‘ng kaft uning ustiga qarsak kabi 2 marta mayin uriladi (dars boshlanishi ramzi).',
    facialExpression: 'Faol, g‘ayratli va ochiq yuz.',
    exampleSentence: 'Ertaga ertalab maktabga boramiz.',
    steps: [
      '1. Chap qo‘l kaftini yuqoriga qaratib tuting.',
      '2. O‘ng kaft bilan uning ustiga ikki marta mayin uring.',
      '3. Bilim olishga tayyorlik kayfiyatini ko‘rsating.'
    ]
  },
  {
    id: 'exp-9',
    word: 'Yaxshi (Ajoyib)',
    category: 'Hissiyotlar',
    meaning: 'Ijobiy baholash, xursandchilik va ma’qullash.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Bosh barmoq tik yuqoriga (layk belgisi)',
    movement: 'Bosh barmoq oldinga va yuqoriga qat’iy ko‘rsatiladi.',
    facialExpression: 'Keng tabassum va ma’qullash bosh qimirlatishi.',
    exampleSentence: 'Bugungi natijangiz juda yaxshi bo‘ldi!',
    steps: [
      '1. Musht turing va bosh barmoqni to‘g‘ri yuqoriga ko‘taring.',
      '2. Suhbatdoshga qarab bosh silkiting.',
      '3. Xursandchilik bilan ma’qullang.'
    ]
  },
  {
    id: 'exp-10',
    word: 'Yordam bermoq',
    category: 'Kundalik harakatlar',
    meaning: 'Ko‘maklashish, birovga qo‘l cho‘zish.',
    difficulty: 'Boshlang‘ich',
    isVerified: true,
    handShape: 'Chap ochiq kaft ustiga o‘ng musht (bosh barmoq yuqorida) qo‘yiladi',
    movement: 'Ikkala qo‘l birgalikda pastdan yuqoriga va oldinga suriladi.',
    facialExpression: 'Hamdard, ko‘makka tayyor do‘stona yuz.',
    exampleSentence: 'Sizga vazifani bajarishda yordam beraymi?',
    steps: [
      '1. Chap kaftni taglik sifatida gorizontal tuting.',
      '2. O‘ng mushtni chap kaft ustiga qo‘ying.',
      '3. Ikkala qo‘lni oldinga ko‘tarib yo‘naltiring.'
    ]
  },
  {
    id: 'exp-11',
    word: 'Do‘st (O‘rtoq)',
    category: 'Hissiyotlar',
    meaning: 'Yaqin do‘stlik va o‘rtoqlik aloqasi.',
    difficulty: 'O‘rta',
    isVerified: false, // Namoyish namunasi
    handShape: 'Ikkala ko‘rsatkich barmoq zanjir kabi bir-biriga ilinadi',
    movement: 'Ko‘rsatkich barmoqlar ilmoq shaklida bir-biriga tutashib, bir-ikki marta siqiladi.',
    facialExpression: 'Iliq, ishonchli tabassum.',
    culturalContext: 'Ushbu belgi mintaqaviy o‘quv namunasi bo‘lib, rasmiy tasdiqlanish jarayonida.',
    exampleSentence: 'Mening eng sodiq do‘stim bor.',
    steps: [
      '1. Ikkala qo‘l ko‘rsatkich barmog‘ini ilgak qilib eging.',
      '2. Ularni bir-biriga zanjirdek iling.',
      '3. Bir-biriga qattiq bog‘langanlikni his qildiring.'
    ]
  },
  {
    id: 'exp-12',
    word: 'Shifokor (Do‘xtir)',
    category: 'Tibbiyot',
    meaning: 'Salomatlik posboni — shifokor.',
    difficulty: 'O‘rta',
    isVerified: false, // O'quv namoyishi
    handShape: 'O‘ng qo‘l ko‘rsatkich va o‘rta barmog‘i chap bilak pulsiga tegiziladi',
    movement: 'Xuddi tomir urishini (pulsni) o‘lchagandek chap bilakka 2 marta teginiladi.',
    facialExpression: 'G‘amxo‘r, diqqatli tibbiy nigoh.',
    culturalContext: 'O‘quv namoyishi: xalqaro va mintaqaviy imo-ishora asosida olingan.',
    exampleSentence: 'Tog‘am shifoxonada shifokor bo‘lib ishlaydilar.',
    steps: [
      '1. Chap bilakni oldinga tuting.',
      '2. O‘ng ikki barmoq bilan puls sohasini bosing.',
      '3. Tibbiy g‘amxo‘rlik ifodasini ko‘rsating.'
    ]
  }
];
