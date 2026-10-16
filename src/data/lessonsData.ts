import { Lesson } from '../types';

export const sampleLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'O‘zbek daktil alifbosi: Boshlang‘ich harflar (A, B, D, M, N)',
    subject: 'Ona tili va Daktilologiya',
    gradeLevel: '1–2 sinf va Yangi o‘rganuvchilar',
    durationMinutes: 12,
    difficulty: 'Boshlang‘ich',
    shortDescription: 'Qo‘l barmoqlari yordamida harflarni to‘g‘ri ifodalash va so‘zlarni harfma-harf ko‘rsatish asoslari.',
    fullDescription: 'Daktilologiya — bu qo‘l alifbosi bo‘lib, imo-ishora tilida maxsus belgisi bo‘lmagan so‘zlar, ismlar va atamalarni ifodalash uchun qo‘llaniladi. Ushbu darsda siz beshta asosiy unli va undosh harf shaklini hamda qo‘lning to‘g‘ri joylashuvini o‘rganasiz.',
    badgeEarned: 'Alifbo Bilimdoni',
    steps: [
      {
        stepNumber: 1,
        title: 'Qo‘lning to‘g‘ri pozitsiyasi',
        explanation: 'Daktil harflarni ko‘rsatayotganda qo‘l ko‘krak balandligida, yelkadan biroz pastda erkin tutilishi lozim. Barmoqlar suhbatdosh tomonga yo‘naltiriladi.',
        signTip: 'Bilakni ortiqcha taranglashtirmang, harakatlar erkin va sokin bo‘lishi kerak.',
        keyPoints: ['Qo‘l ko‘krak sathida bo‘ladi', 'Yuzni to‘sib qo‘ymaslik kerak', 'Qo‘l harakatlari bitta tekislikda saqlanadi'],
        visualType: 'rule'
      },
      {
        stepNumber: 2,
        title: 'A va B harflarining shakli',
        explanation: 'A harfi: barmoqlar musht holatiga keltiriladi, bosh barmoq ko‘rsatkich barmog‘ining yon tomoniga tekkan holda tik turadi. B harfi: to‘rtta barmoq to‘g‘ri yuqoriga cho‘ziladi, bosh barmoq kaft ichiga bukiladi.',
        signTip: 'B harfida barmoqlar bir-biriga jips yopishgan bo‘lishi muhim.',
        keyPoints: ['A harfi — musht va yon bosh barmoq', 'B harfi — to‘rt tekis barmoq va ichki bosh barmoq'],
        visualType: 'gesture'
      },
      {
        stepNumber: 3,
        title: 'D, M va N harflari',
        explanation: 'D harfi: ko‘rsatkich barmoq tik yuqoriga qaragan, qolgan uchta barmoq bosh barmoq uchi bilan doira hosil qiladi. M harfi: uchta barmoq (ko‘rsatkich, o‘rta, nomsiz) bosh barmoq ustiga bukiladi (3 ta qovurg‘a). N harfida esa faqat 2 ta barmoq tushiriladi.',
        signTip: 'M va N harflaridagi farq — pastga yo‘naltirilgan barmoqlar soni (3 ta va 2 ta).',
        keyPoints: ['D — ko‘rsatkich barmoq tik, qolgani doira', 'M — uch barmoqli kamar', 'N — ikki barmoqli kamar'],
        visualType: 'gesture'
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'Daktil alifboda harflarni ko‘rsatishda qo‘l qaysi sohada tutilishi tavsiya etiladi?',
        options: [
          'Ko‘krak sathida, yelkadan biroz pastda va yuzni to‘smagan holda',
          'To‘g‘ridan-to‘g‘ri yuz oldida, ko‘zlarni yopib',
          'Tizzalar ustida, pastga qaratib',
          'Bosh ustida yuqoriga ko‘tarilgan holda'
        ],
        correctOptionIndex: 0,
        explanation: 'To‘g‘ri! Qo‘l ko‘krak sathida tutilsa, suhbatdosh bir vaqtning o‘zida ham yuz ifodasini (artikulyatsiyani), ham qo‘l harakatini aniq ko‘ra oladi.'
      },
      {
        id: 'q1-2',
        question: 'Bosh barmoq kaft ichiga bukilgan, qolgan 4 ta barmoq yuqoriga tekis cho‘zilgan holat qaysi harfga mos keladi?',
        options: ['A harfi', 'B harfi', 'D harfi', 'M harfi'],
        correctOptionIndex: 1,
        explanation: 'To‘g‘ri! Bu klassik B harfi daktil shaklidir.'
      },
      {
        id: 'q1-3',
        question: 'M va N harflari daktil shakli o‘rtasidagi asosiy farq nima?',
        options: [
          'M harfida 3 ta barmoq, N harfida esa 2 ta barmoq bosh barmoq ustiga tushiriladi',
          'M harfi chap qo‘lda, N esa faqat o‘ng qo‘lda ko‘rsatiladi',
          'N harfida qo‘l musht qilinadi',
          'Hech qanday farqi yo‘q, ular bir xil ko‘rsatiladi'
        ],
        correctOptionIndex: 0,
        explanation: 'Barakalla! M harfida uchta barmoq (m harfining uchta ustuni kabi), N da esa ikkita barmoq pastga qaratiladi.'
      }
    ]
  },
  {
    id: 'lesson-2',
    title: 'Matematik tasavvurlar: Sonlar va hisoblash (1 dan 10 gacha)',
    subject: 'Matematika va Miqdor tushunchasi',
    gradeLevel: '1–4 sinf',
    durationMinutes: 15,
    difficulty: 'Boshlang‘ich',
    shortDescription: 'Bir qo‘l bilan 1 dan 10 gacha bo‘lgan sonlarni ifodalash, miqdor va yo‘nalish belgilarini tushunish.',
    fullDescription: 'Imo-ishora tilida sonlar vizual va juda mantiqiy tuzilgan. O‘zbek imo-ishora an’anasida 1 dan 5 gacha barmoqlarning ketma-ket ochilishi, 6 dan 10 gacha esa maxsus qo‘l birikmalari orqali ifodalanadi.',
    badgeEarned: 'Hisob Ustasi',
    steps: [
      {
        stepNumber: 1,
        title: '1 dan 5 gacha sonlar',
        explanation: '1 — ko‘rsatkich barmoq tik. 2 — ko‘rsatkich va o‘rta barmoq. 3 — bosh barmoq, ko‘rsatkich va o‘rta barmoq (yoki ko‘rsatkich, o‘rta, nomsiz). 4 — bosh barmoqdan tashqari 4 ta barmoq. 5 — barcha beshta barmoq ochiq.',
        signTip: 'Kaft doimo suhbatdosh tomonga qaratilgan bo‘lishi lozim.',
        keyPoints: ['Har bir yangi raqamda bitta barmoq qo‘shiladi', 'Kaft erkin va aniq ochiladi'],
        visualType: 'gesture'
      },
      {
        stepNumber: 2,
        title: '6 dan 10 gacha sonlar',
        explanation: 'O‘zbek imo-ishorasida 6 dan 9 gacha bo‘lgan sonlar ko‘pincha bosh barmoqning boshqa barmoqlar bilan uchrashishi yoki ikki qo‘lli aniq miqdoriy birikma orqali ko‘rsatiladi. 10 soni esa silkitiluvchi yoki ikki qo‘l kaftlari orqali belgilanadi.',
        signTip: 'Sonlarni ko‘rsatishda lab artikulyatsiyasi (masalan, "olti", "yetti" deb ovozsiz aytish) tushunishni 2 barobar osonlashtiradi.',
        keyPoints: ['Lab harakati imo-ishorani to‘ldiradi', 'Raqamlar tez va aniq ko‘rsatiladi'],
        visualType: 'concept'
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'Imo-ishorada 1 dan 5 gacha sonlarni ko‘rsatishda kaft qaysi tomonga qaratiladi?',
        options: [
          'Suhbatdosh tomonga (oldinga)',
          'O‘z ko‘kragi tomonga (orqaga)',
          'Polga qaratib (pastga)',
          'Shiftdan yuqoriga'
        ],
        correctOptionIndex: 0,
        explanation: 'To‘g‘ri! Raqamlarni ko‘rsatayotganda kaft suhbatdoshga ochiq bo‘lishi kerak, shunda barmoqlar soni aniq ko‘rinadi.'
      },
      {
        id: 'q2-2',
        question: 'Imo-ishora muloqotida sonlarni ko‘rsatishda lab artikulyatsiyasining o‘rni qanday?',
        options: [
          'Lab harakati raqamni aniqroq tushunishga katta yordam beradi',
          'Labni umuman qimirlatmaslik shart',
          'Faqat ovoz chiqarib baqirish kerak',
          'Lab artikulyatsiyasi taqiqlangan'
        ],
        correctOptionIndex: 0,
        explanation: 'Juda to‘g‘ri! Tabiiy lab artikulyatsiyasi imo-ishora tilining ajralmas qismi hisoblanadi.'
      }
    ]
  },
  {
    id: 'lesson-3',
    title: 'Kundalik muloqot odobi va hurmat iboralari',
    subject: 'Ijtimoiy ko‘nikmalar',
    gradeLevel: 'Barcha yoshdagi o‘rganuvchilar',
    durationMinutes: 10,
    difficulty: 'Boshlang‘ich',
    shortDescription: 'Salomlashish, minnatdorchilik bildirish, uzr so‘rash va samimiy muloqot odobining imo-ishoralari.',
    fullDescription: 'Hurmat va samimiyat har qanday tilda eng muhim o‘rinda turadi. Ushbu darsda "Assalomu alaykum", "Rahmat", "Iltimos", "Kechirasiz" va "Xayr" kabi hayotiy iboralarning to‘g‘ri qo‘l harakati va yuz ifodasini (mimika) o‘rganasiz.',
    badgeEarned: 'Odobli Suhbatdosh',
    steps: [
      {
        stepNumber: 1,
        title: 'Assalomu alaykum va Salom',
        explanation: 'O‘ng qo‘l kafti ko‘krakning chap qismiga (yurak ustiga) qo‘yiladi va biroz oldinga engashib samimiy tabassum qilinadi. Rasmiy salomlashishda esa o‘ng qo‘l peshona/chakka yaqinidan oldinga muloyim harakatlantiriladi.',
        signTip: 'Yuzingizda albatta samimiy tabassum va do‘stona ko‘z qarashi bo‘lishi shart.',
        keyPoints: ['Qo‘l yurak ustiga qo‘yiladi', 'Biroz ta’zim va tabassum qilinadi'],
        visualType: 'gesture'
      },
      {
        stepNumber: 2,
        title: 'Rahmat (Minnatdorchilik)',
        explanation: 'O‘ng qo‘l kafti iyak yoki lab oldidan oldinga va biroz pastga suhbatdosh tomonga harakatlantiriladi. Kaft yuqoriga qaragan bo‘ladi — bu yurakdan chiqqan tuhfa va ehtirom ma’nosini bildiradi.',
        signTip: 'Katta minnatdorchilik bildirishda ikki qo‘l birga oldinga uzatilishi mumkin.',
        keyPoints: ['Kaft iyakdan oldinga harakatlanadi', 'Yuzda minnatdorlik ifodalanadi'],
        visualType: 'gesture'
      },
      {
        stepNumber: 3,
        title: 'Iltimos va Kechirasiz',
        explanation: '"Iltimos": ikki kaft ko‘krak oldida bir-biriga qo‘shilib, muloyim iltimos harakati qilinadi. "Kechirasiz": o‘ng qo‘l kafti ko‘krak ustida mayin aylanma harakat bilan silanadi.',
        signTip: 'Kechirim so‘raganda yuzda pushaymonlik va muloyimlik ifodasi aks etishi kerak.',
        keyPoints: ['Iltimos — birlashgan kaftlar', 'Kechirasiz — ko‘krakdagi aylanma mayin harakat'],
        visualType: 'gesture'
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'O‘zbek an’anasida "Assalomu alaykum" ifodalaganda qo‘l qayerga qo‘yiladi?',
        options: [
          'Ko‘krakka (yurak ustiga), samimiy tabassum bilan',
          'Orqaga yashiriladi',
          'Bosh kiyim ustiga qo‘yiladi',
          'Chetga silkitiladi'
        ],
        correctOptionIndex: 0,
        explanation: 'Ofarin! Yurak ustiga qo‘l qo‘yish samimiy hurmat va tinchlik tilashning ramzidir.'
      },
      {
        id: 'q3-2',
        question: '"Rahmat" imo-ishorasida qo‘l harakati qanday yo‘naladi?',
        options: [
          'Iyak/lab oldidan oldinga, suhbatdosh tomonga mayin ochiladi',
          'Pastga polga qarab uriladi',
          'Bosh orqasiga aylantiriladi',
          'Kaftlar qarsak chalinadi'
        ],
        correctOptionIndex: 0,
        explanation: 'Aynan shunday! Iyakdan suhbatdosh tomonga ochilgan kaft samimiy minnatdorchilikni bildiradi.'
      }
    ]
  },
  {
    id: 'lesson-4',
    title: 'Tabiat va Fasllar: O‘zbekistonning go‘zal tabiati',
    subject: 'Tabiatshunoslik va Atrof-muhit',
    gradeLevel: '2–5 sinf',
    durationMinutes: 14,
    difficulty: 'O‘rta',
    shortDescription: 'Fasllar nomlari (Bahor, Yoz, Kuz, Qish), quyosh, yomg‘ir va tabiat hodisalarining vizual belgilari.',
    fullDescription: 'Ushbu darsda tabiat hodisalarining jonli tasvirlarini imo-ishorada ko‘rsatishni o‘rganamiz. Har bir belgi tabiatdagi real harakatlar va his-tuyg‘ularga asoslangan.',
    badgeEarned: 'Tabiat Do‘sti',
    steps: [
      {
        stepNumber: 1,
        title: 'Quyosh va Yomg‘ir',
        explanation: 'Quyosh: qo‘l yuqorida musht holatidan asta-sekin nurlar kabi barcha barmoqlarni yoyib ochiladi. Yomg‘ir: ikkala qo‘l barmoqlari pastga qarab mayin tebranib, yuqoridan pastga tomchilab tushadi.',
        signTip: 'Kuchli yomg‘ir bo‘lsa, harakat tezlashadi va yuzda hayrat ifodalanadi.',
        keyPoints: ['Quyosh — nurlarning ochilishi', 'Yomg‘ir — tomchilarning pastga mayin harakati'],
        visualType: 'gesture'
      },
      {
        stepNumber: 2,
        title: 'To‘rt fasl: Bahor, Yoz, Kuz, Qish',
        explanation: 'Bahor — gullarning ochilishi va uyg‘onish. Yoz — issiq terlash yoki peshonani artish belgisi. Kuz — xazonlarning to‘kilishi. Qish — qaltirash yoki sovuqdan qo‘llarni bir-biriga ishqalash.',
        signTip: 'Fasllar o‘z xususiyatlariga ko‘ra juda eslab qolish oson imo-ishoralarga ega.',
        keyPoints: ['Bahor — gullash', 'Yoz — issiqlik', 'Kuz — yaproqlar', 'Qish — sovuqlik'],
        visualType: 'concept'
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'Imo-ishorada "Quyosh" qanday tasvirlanadi?',
        options: [
          'Yuqorida musht holatidan nurlar kabi barmoqlarni keng yoyib ochish orqali',
          'Yerga doira chizish orqali',
          'Ko‘zni yumib qorong‘i qilish orqali',
          'Ikkala qo‘lni tizzaga qo‘yish orqali'
        ],
        correctOptionIndex: 0,
        explanation: 'To‘g‘ri! Quyoshning nurlanishi qo‘l barmoqlarining mushtdan yorqin yoyilishi bilan gavdalanadi.'
      },
      {
        id: 'q4-2',
        question: '"Yomg‘ir" belgisida kuchli jala va mayin yomg‘ir qanday farqlanadi?',
        options: [
          'Harakat tezligi, qo‘l ko‘lami va mimika (yuz ifodasi) orqali',
          'Faqat ovoz chiqarish orqali',
          'Faqat kiyim rangini o‘zgartirish orqali',
          'Ular umuman farqlanmaydi'
        ],
        correctOptionIndex: 0,
        explanation: 'Ajoyib! Imo-ishora tilida harakatning dinamikasi va mimika ma’noning darajasini ko‘rsatadi.'
      }
    ]
  }
];
