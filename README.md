# SURDO AI — Inklyuziv Ta’lim va Imo-ishora Muloqot Platformasi

O‘zbekistonda eshitishida nuqsoni bo‘lgan insonlar, ularning oilalari va maxsus ta’lim ustozlari uchun yaratilgan to‘laqonli web MVP (Minimal Viable Product).

---

## 🌟 Mahsulot Ko‘rinishi va Asosiy Modullar

1. **Bosh Sahifa (Landing Page):**
   - SURDO AI missiyasi: *"Har bir inson uchun tushunarli dunyo."*
   - Asosiy harakat chaqiruvlari: **“Boshlash”** (to‘g‘ridan-to‘g‘ri interaktiv dasturga o‘tish) va **“Imkoniyatlarni ko‘rish”**.
   - Milliy avatarlar vitrinasi (Malika va Jasur).
   - DarsKo‘prik, ImoLab, OilaSign va AI Sign Assistant modullari taqdimoti.
   - O‘zbekistondagi ijtimoiy ta’sir va inklyuziya bo‘limi.

2. **DarsKo‘prik (Vizual Ta’lim):**
   - Fanlar bo‘yicha darslar katalogi (Ona tili va daktilologiya, matematika, odob-axloq, tabiatshunoslik).
   - Har bir dars uchun bosqichma-bosqich vizual tushuntirish, qoidalar va amaliy imo-ishora ko‘rsatmalari.
   - Interaktiv sinov viktorinalari (har bir savolga tushuntirish, xato va to‘g‘ri javoblar tahlili, bayramona konfetti effekti).
   - O‘quvchi natijalari va o‘zlashtirish foizini saqlash.

3. **ImoLab (O‘zbek Imo-ishora Lug‘ati):**
   - Qidiriladigan va toifalar (Salomlashish, Oila, Taomlar, Maktab, Hissiyotlar, Tibbiyot, Kundalik harakatlar) bo‘yicha filtrlanadigan kutubxona.
   - **Shaffoflik me’yori:** Rasmiy tasdiqlangan belgilar hamda o‘quv namoyishidagi belgilarni aniq farqlovchi vizual belgilar (`Badge`).
   - Qo‘l shakli, harakat yo‘nalishi, yuz mimikasi va madaniy ma’lumotlarni o‘z ichiga olgan modal kartochka.

4. **OilaSign (Oilaviy Amaliyot):**
   - Eshitmaydigan farzandi bor ota-onalar, aka-uka va opa-singillar uchun kundalik hayotiy iboralar to‘plami.
   - Har bir ibora bo‘yicha oilaviy mashq va ota-onaga tavsiyalar.
   - Foydalanuvchi qurilmasida saqlanuvchi (`localStorage`) o‘zlashtirish holati ("O‘zlashtirildi" / "Rejada") va foiz hisoblagichi.

5. **AI Sign Assistant (Nutq va Matndan Imo-ishoraga):**
   - Matn kiritish maydoni va tezkor iboralar tugmalari.
   - Mikrofon orqali ovozli kiritish (Web Speech API) va xatoliklar holatida muloyim tavsiyalar.
   - Milliy avatar tanlash (Malika — ayol, Jasur — erkak).
   - **2D Vizual va 3D GLB ko‘rinishlari:**
     - 2D rejimda: Barmoqlar va mimika aniq ko‘rinadigan yuqori aniqlikdagi fotosuratlar, ijro tezligi (0.5x, 0.75x, 1x), pauza, qaytarish va bosqichma-bosqich tushuntirish.
     - 3D rejimda: Three.js yordamida `men.glb` va `women.glb` modellarini 360° orbital aylantirish, yaqinlashtirish, wireframe rejimi va real vaqtdagi texnik hisobot.
   - Soxta tarjimadan saqlovchi tahlil quvuri: bazada mavjud bo‘lmagan so‘zlarni halol ko‘rsatish va tasdiqlangan sinonimlarni tavsiya qilish.

6. **O‘qituvchi Kabineti (Teacher Dashboard Preview):**
   - Maxsus "Namoyish (Demo) Rejimi" ogohlantirishi.
   - Jami o‘quvchilar, faol darslar, o‘rtacha o‘zlashtirish foizi va testlar statistikasi.
   - Darslarni boshqarish (Nashr qilingan / Qoralama holatini o‘zgartirish, yangi dars qo‘shish modal oynasi).
   - Sinf bo‘yicha o‘quvchilar reytingi va qiyin savollar diagnostikasi.

---

## 🎨 Ranglar Palitrasi va Vizual Tizim

- **Deep forest green:** `#173F35`
- **Primary green:** `#2F6B4F`
- **Soft sage:** `#A9BDA6`
- **Warm cream:** `#F7F3E9`
- **Light beige:** `#E9DDC9`
- **Earthy brown:** `#8A6346`
- **Dark cocoa:** `#49362B`

---

## ♿ Inklyuzivlik va Maxsus Imkoniyatlar (Accessibility)

- **A+ / A-:** Butun sayt bo‘ylab shrift hajmini bir bosishda kattalashtirish.
- **Yuqori kontrast (High Contrast):** Zaif ko‘ruvchilar uchun kontrast fon va matn rejimi.
- **Kamaytirilgan harakat (Prefers-reduced-motion):** Harakatli animatsiyalarga sezgir foydalanuvchilar uchun moslashish.
- **Klaviatura orqali boshqaruv:** Barcha tugmalar va shakllar uchun qat’iy `:focus-visible` konturlari va `aria-label`lar.

---

## 🚀 Loyihani Ishga Tushirish

### Talablar:
- Node.js (v18 yoki undan yuqori)
- npm (v9 yoki undan yuqori)

### Bosqichlar:

1. Kutubxonalarni o‘rnatish:
   ```bash
   npm install
   ```

2. Dasturni ishlab chiquvchi rejimida ishga tushirish:
   ```bash
   npm run dev
   ```
   Brauzerda `http://localhost:5173/` manzilini oching.

3. Ishlab chiqarish (Production) uchun yig‘ish:
   ```bash
   npm run build
   ```

4. Yig‘ilgan versiyani tekshirish:
   ```bash
   npm run preview
   ```
