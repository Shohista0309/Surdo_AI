# ElectroHand — 3D Elektronika Yig‘ish va Sinash Laboratoriyasi

**ElectroHand** — veb-kamera orqali real vaqtdagi tabiiy qo‘l harakatlari (jestlar) yordamida boshqariluvchi, haqiqiy 3D maket platasida (solderless breadboard) elektron zanjirlarni erkin yig‘ish, sinash va fizik tahlil qilish virtual laboratoriyasi.

Foydalanuvchi qanday zanjir yasashni o‘zi mustaqil hal qiladi. Dastur avvaldan tayyor shablonni majburlab ko‘rsatmaydi — foydalanuvchi sxemani yig‘gach, **“Simulyatsiya / Tekshirish”** tugmasi orqali Modified Nodal Analysis (MNA) dvigateli zanjirni to‘liq tekshiradi va xatoliklarni fizik jihatdan o‘zbek tilida tushuntirib beradi.

---

## ⚡ Asosiy Imkoniyatlar va Arxitektura

### 1. Haqiqiy 3D Ishchi Stol va Maket Platasi (Breadboard):
- **Standart 30-ustunli (400 tie-point) solderless breadboard:**
  - Yuqori va pastki quvvat shinalari: Musbat (+ qizil chiziq) va Manfiy (- ko‘k chiziq) shinalari gorizontal tutashtirilgan.
  - O‘rta terminal qatorlari: 1-dan 30-gacha bo‘lgan ustunlar. Har bir ustunda yuqori A, B, C, D, E teshiklari o‘zaro elektr tutashgan; pastki F, G, H, I, J teshiklari o‘zaro elektr tutashgan.
  - O‘rta DIP ariqchasi (trough): Integral mikrosxemalarni (DIP-8, DIP-14) qarama-qarshi oyoqlarini qisqa tutashtirmasdan o‘rnatish uchun mo‘ljallangan.
- **3D Kamera Boshqaruvi (OrbitControls):** Silliq aylantirish (orbit), siljitish (pan), yaqinlashtirish (zoom) va ko‘rinishni tiklash (Reset View).
- **Haqiqiy 3D Protsedural Modellar:** Har bir komponent haqiqiy o‘lchamlarga, ko‘rinishga, qutblanish belgilariga va breadboard teshiklariga kiruvchi metall kontakt oyoqlariga ega.

### 2. Qidiruvga Ega Keng Komponentlar Kutubxonasi (10 ta Kategoriya):
- **Diodlar va LEDlar:** Standart to‘g‘rilovchi kremniy diod (1N4007), Zener diodi (5.1V), Shottki diodi (1N5819), Qizil LED, Yashil LED, Moviy LED, Sariq LED.
- **Tranzistorlar:** NPN bipolyar tranzistor (2N2222), PNP tranzistor (2N3906), N-kanal MOSFET (2N7000), P-kanal MOSFET (IRF9540).
- **Quvvat Manbalari:** 9V Krona batareya, 5.0V DC manba, 3.3V DC manba, 0-12V Sozlanuvchi laboratoriya manbai, 1kHz AC signal generatori.
- **Rezistorlar va Reostatlar:** Ruxsat etilgan rezistorlar (220Ω, 330Ω, 1kΩ, 10kΩ, 100kΩ — IEC rang chiziqlari bilan), 10kΩ Potensiometr (buriluvchi reostat), LDR Fotorezistor.
- **Kondensatorlar:** 100nF keramik kondensator, 10µF va 100µF elektrolitik qutbli kondensatorlar, 1µF plyonkali kondensator.
- **Integral Mikrosxemalar (IC):** NE555 mashhur taymer/impuls generatori, 74HC04 (Invertor NOT), 74HC08 (Mantiqiy AND).
- **Komparator & Op-Amp:** LM393 Dual komparator, LM358 Dual Op-Amp, LM741 klassik operatsion kuchaytirgich.
- **Transformatorlar:** Pastlatuvchi transformator (2:1).
- **Kalitlar va Boshqalar:** SPST 4-oyoqli taktli tugma, siljitma kalit, pyezo-buzzer, 0V Zamin (GND terminal).

### 3. Tabiiy Veb-Kamera Qo‘l Kuzatuvi (MediaPipe Hand Tracking):
- **Google MediaPipe Tasks Vision:** 21 ta 3D nuqtani lokal Wasm va Model fayllari orqali uzluksiz kuzatadi (serverga video yuborilmaydi).
- **Chimchilash (Pinch):** Bosh va ko‘rsatkich barmoq orasi masofasini o‘lchash orqali elementni ushlash va bo‘shatish.
- **Sim Ulash Rejimi (Wire Mode):** Breadboard teshigi ustida chimchilab, ikkinchi teshikka tortib sim o‘tkazish.
- **Elementni Burish (Rotate):** 90° ga burish tugmasi yoki klaviaturadagi `[R]` tugmasi (oyoqlar koordinatasi avtomatik to‘g‘ri transformatsiyalanadi).
- **Sichqoncha Zaxira Rejimi:** Kamerasi bo‘lmagan yoki past yorug‘likdagi foydalanuvchilar sichqoncha orqali to‘liq foydalanishi mumkin.

### 4. Haqiqiy SPICE-Darajasidagi Simulyatsiya Dvigateli (MNA Solver):
- **Modified Nodal Analysis (MNA):** Rezistorlar, kuchlanish manbalari va zamin tugunlari uchun $\mathbf{G} \cdot \mathbf{v} = \mathbf{i}$ tenglamalar tizimini tuzadi va Gauss usulida yechadi.
- **Newton-Raphson Noliniziq Yechuvchi:** Diodlar, LEDlar va Zener diodlari uchun Shokli ($I_D = I_S (e^{V_D / n V_T} - 1)$) tenglamasi orqali har bir iteratsiyada $g_d$ va $I_{eq}$ dinamik hisoblab boriladi.
- **Haqiqiy LED Yoritilishi:** LED faqatgina to‘g‘ri qutblanganda va forward kuchlanish ($> 1.8\text{V}$) hamda yetarli tok ($> 2\text{mA}$) mavjud bo‘lganda tokka mutanosib yorqinlikda yonadi.
- **Avtomatik Diagnostika va Xatoliklar Tahlili:**
  - 🔴 **Kritik Qisqa Tutashuv:** Manba qutblari to‘g‘ridan-to‘g‘ri tutashtirilganda ogohlantiradi va manbani qizil rangda yoritadi.
  - 🔴 **LED Kuyish Xavfi:** LED rezistorsiz 5V yoki 9V ga ulanganda ($I > 30\text{mA}$) tok haddan tashqari oshganini ko‘rsatadi va kuyish holatini belgilaydi.
  - 🟡 **Ochiq Zanjir:** Tok manbaidan chiqqan zaryad zaminga qaytib kelishi uchun yopiq kontur yo‘qligini bildiradi.
  - 🟡 **Teskari Qutblanish:** Diod yoki LED teskari ulanganda xabar beradi.

### 5. Loyihalarni Boshqarish va Namunaviy Sxemalar:
- `localStorage` orqali loyihalarni saqlash va ochish.
- JSON formatida eksport va import qilish.
- Harakatlarni bekor qilish (`Undo`) va qaytarish (`Redo`) steki.
- **4 ta Tayyor O‘quv Namunasi:**
  1. *1. Oddiy LED va Rezistor Zanjiri* — 5V DC, 330Ω, Qizil LED (To‘g‘ri ishlovchi zanjir).
  2. *2. Xato Zanjir: Rezistorsiz LED (Kuyish xavfi)* — Haddan tashqari tok xatoligini namoyish etuvchi zanjir.
  3. *3. NPN Tranzistorli Kalit Zanjiri* — 2N2222 tranzistor orqali LEDni boshqarish.
  4. *4. Potensiometrli Kuchlanish Bo‘luvchi* — 10kΩ reostat orqali kuchlanishni sozlash.

---

## 🚀 O‘rnatish va Ishga Tushirish

Terminalda quyidagi buyruqlarni bajaring:

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Dasturlash (Dev) rejimida ishga tushirish
npm run dev

# 3. Yoki production build va preview
npm run build
npm run preview
```

Brauzeringizda `http://localhost:5173/` yoki `http://localhost:4173/` manzilini oching.

---

## 📋 Qabul Qilish Sinovlari (Acceptance Criteria Checklist)

| Sinov | Holat | Izoh |
| :--- | :---: | :--- |
| **A. Ilova ishga tushishi** | ✅ Bajarildi | Asosiy 3D laboratoriya xatoliksiz to‘liq yuklanadi. |
| **B. Komponentlar kutubxonasi** | ✅ Bajarildi | 10 ta toifadagi haqiqiy 3D modellar breadboardga joylashtiriladi. |
| **C. Burish (Rotation)** | ✅ Bajarildi | Komponent 90° ga burilganda uning barcha pinlari fazoda to‘g‘ri aylanadi. |
| **D. Breadboard teshiklar modeli** | ✅ Bajarildi | Ustunlar (A-E, F-J) va quvvat shinalari (+ / -) to‘g‘ri elektr tugunlarga bog‘langan. |
| **E. Jumper sim ulash** | ✅ Bajarildi | Simlar teshiklar orasida egiluvchan 3D chiziq bilan ulanadi va tarmoqni tutashtiradi. |
| **F. Veb-kamera va MediaPipe** | ✅ Bajarildi | Kamera jonli oqimda 21 ta nuqtali qo‘l skeletini tahlil qiladi. |
| **G. Chimchilash (Pinch)** | ✅ Bajarildi | Gisterezisli pinch orqali element ushlanadi va breadboardga avto-snapping qilinadi. |
| **H. Sichqoncha zaxirasi** | ✅ Bajarildi | Sichqoncha orqali to‘liq tortish, ulash va boshqarish ishlaydi. |
| **I. MNA simulyatsiya dvigateli** | ✅ Bajarildi | Tugun kuchlanishlari va tarmoq toklari to‘g‘ri hisoblanadi. |
| **J. Xatoliklarni aniqlash** | ✅ Bajarildi | Rezistorsiz LED kuyishi yoki qisqa tutashuvda qizil ogohlantirish beriladi. |
| **K. Saqlash va Namunalar** | ✅ Bajarildi | 4 ta tayyor namuna va shaxsiy loyihalar saqlanadi va qayta tiklanadi. |
| **L. Ishlab chiqarish yig‘ilishi** | ✅ Bajarildi | `npm run build` TypeScript va Vite yordamida toza yig‘iladi (0 ta xatolik). |

---

## ⌨️ Klaviatura Qisqartmalari
- `R`: Tanlangan komponentni 90° ga burish.
- `Delete` / `Backspace`: Tanlangan komponentni o‘chirish.
- `Ctrl + Z`: Harakatni bekor qilish (Undo).
- `Ctrl + Y`: Harakatni qaytarish (Redo).
