import { FamilyPracticeItem } from '../types';

export const familyPracticeItems: FamilyPracticeItem[] = [
  {
    id: 'fp-1',
    category: 'Salomlashish',
    titleUz: 'Xayrli tong, yaxshi uxlab turdingizmi?',
    signPrompt: 'Tonggi uyg‘onishda mehrli salom va kayfiyatni so‘rash',
    importanceWhy: 'Ertalabki ilk muloqot bolaga oilada o‘zini sevimli va xavfsiz his qilishiga yordam beradi.',
    practiceExercise: 'Tongda farzandingiz xonasiga kirganda chiroqni sekin yoqib-o‘chiring (keskin uyg‘otmaslik uchun) va tabassum bilan "Tong" + "Yaxshi" belgilarini ko‘rsating.',
    keySigns: ['Xayrli tong (Quyosh chiqishi)', 'Yaxshi (Bosh barmoq)', 'Uxlamoq (Kaft yanoqda)'],
    tipsForParents: 'Har doim ko‘z darajasiga egiling. Eshitishida nuqsoni bo‘lgan bola ovozni emas, ko‘z nigohini va yuz ifodasini birinchi o‘rinda his qiladi.'
  },
  {
    id: 'fp-2',
    category: 'Oshxona',
    titleUz: 'Choy ichasizmi yoki suv? Qorningiz ochdimi?',
    signPrompt: 'Dasturxon atrofida tanlov va ehtiyojlarni bildirish',
    importanceWhy: 'Dasturxon — oilaning eng iliq muloqot maydoni. Bolaga mustaqil tanlov qilish imkonini berish uning ishonchini oshiradi.',
    practiceExercise: 'Stol ustidagi buyumlarni (chashka, non, shakar) ko‘rsatib, tanlov so‘rog‘i (ikkala kaftni bir-biriga navbat bilan silkitish) orqali mashq qiling.',
    keySigns: ['Choy (Piyola ushlash)', 'Suv (Labga teginish)', 'Non (Sindirish)', 'Qorin och (Qoringa teginish)'],
    tipsForParents: 'Og‘zingizda taom bor paytda gapirmang yoki qo‘lingiz bilan og‘zingizni to‘smang, chunki bola lab harakatini ham o‘qiydi.'
  },
  {
    id: 'fp-3',
    category: 'Maktab',
    titleUz: 'Bugun maktabda dars qanday o‘tdi? Do‘stlaringiz bilan nima qildingiz?',
    signPrompt: 'Kunlik taassurotlar va maktab voqealarini bo‘lishish',
    importanceWhy: 'Maktabdan qaytgach bolani tinglash (tomosha qilish) uning ijtimoiy moslashuvi va ruhiy xotirjamligi uchun zarur.',
    practiceExercise: 'Daftar yoki kitobni birgalikda ochib, qaysi fan bo‘lganini (Rasm, Matematika, Jismoniy tarbiya) imo-ishora bilan so‘rang.',
    keySigns: ['Maktab (Qarsak kaftlar)', 'Kitob (Ochilish)', 'Rasm (Chizish harakati)', 'Xursand (Kaftlar ko‘krakda tebranadi)'],
    tipsForParents: 'Hech qachon shoshilmang. Bola fikrini to‘liq tugatishini sabr bilan kuting va bosh irg‘ab tasdiqlang.'
  },
  {
    id: 'fp-4',
    category: 'Kundalik ehtiyojlar',
    titleUz: 'Sizga yordam kerakmi? Qayeringiz og‘riyapti?',
    signPrompt: 'Salomatlik, xavfsizlik va yordam so‘rash',
    importanceWhy: 'Bola og‘riq yoki noqulaylikni darhol tushuntira olishi eng muhim xavfsizlik ko‘nikmasidir.',
    practiceExercise: 'Tana a’zolariga ohista teginib, "og‘riq" belgisini (barmoqlarni burash/qimirlatish) va "yordam" belgisini mashq qiling.',
    keySigns: ['Yordam (Kaft ustidagi tayanch musht)', 'Og‘riq (Burilish harakati)', 'Kasalxona / Dori'],
    tipsForParents: 'Bolani vahimaga tushirmasdan, xotirjam va dalda beruvchi mimikada gapiring.'
  },
  {
    id: 'fp-5',
    category: 'Hissiyotlar',
    titleUz: 'Men sizni yaxshi ko‘raman. Siz eng aqlli va zo‘rsiz!',
    signPrompt: 'Ruhiy qo‘llab-quvvatlash va samimiy mehr izhori',
    importanceWhy: 'Mehr hissi barcha to‘siqlarni yengadi. Ota-onaning e’tirofi bolaning dunyodagi eng katta qurolidir.',
    practiceExercise: 'Kaftingizni yuragingizga qo‘ying va "Sevaman" (I Love You) belgisini yoki iliq quchoqlash imo-ishorasini bajaring.',
    keySigns: ['Yurak (Mehr)', 'Yaxshi ko‘raman (Kaft yurakda)', 'Aqlli (Ko‘rsatkich barmoq chakkada)'],
    tipsForParents: 'Imo-ishorani jismoniy quchoqlash va mehrli nigoh bilan birlashtiring. Bu so‘zlardan ham kuchliroq ta’sir qiladi.'
  },
  {
    id: 'fp-6',
    category: 'Oila',
    titleUz: 'Keling, birga o‘yin o‘ynaymiz yoki sayr qilamiz!',
    signPrompt: 'Birgalikdagi hordiq va oilaviy o‘yinlar',
    importanceWhy: 'Vizual o‘yinlar (shaxmat, konstruktor, rasmli kartalar) imo-ishora tilini tabiiy rivojlantirishning eng qulay yo‘lidir.',
    practiceExercise: 'O‘yin qoidalarini imo-ishorada tushuntirishga harakat qiling va har bir muvaffaqiyatda qo‘l silkib olqishlang (kar-soqovlar olqishi — qo‘llarni yuqorida burish).',
    keySigns: ['O‘yin (Kichik barmoqlar harakati)', 'Sayr (Ikki barmoq odimlab yurishi)', 'G‘alaba (Olqish)'],
    tipsForParents: 'Eshitmaydiganlar madaniyatida qarsak o‘rniga ikkala qo‘lni yuqoriga ko‘tarib kaftlarni aylantirish orqali olqishlanadi. Bu ajoyib vizual bayramdir!'
  }
];

export const parentQuickTips = [
  {
    title: 'Ko‘rish maydonini toza tuting',
    text: 'Suhbatlashganda bola bilan bir xil balandlikda (ko‘z darajasida) o‘tiring va yuzingizga yorug‘lik to‘g‘ri tushishiga e’tibor bering.'
  },
  {
    title: 'E’tiborni to‘g‘ri jalb qiling',
    text: 'Orqadan kutilmaganda ushlamang. Yelkaga ohista qo‘l tekkizish, chiroqni bir marta o‘chirib-yoqish yoki stolda tebranish hosil qilish eng yaxshi usuldir.'
  },
  {
    title: 'Yuz ifodasi (Mimika) — bu tilning ohangi',
    text: 'Eshitadigan odamlar gap urg‘usini ovoz bilan beradi, imo-ishorada esa bu qoshlar, ko‘zlar va tabassum orqali ifodalanadi.'
  },
  {
    title: 'Xatolardan qo‘rqmang',
    text: 'Bolangiz bilan imo-ishorada adashish tabiiy. Muhimi — harakat qilishingiz va uning dunyosiga qadam qo‘yayotganingiz.'
  }
];
