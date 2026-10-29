import { ComponentSpecification, ComponentCategory, ComponentType } from '../types';

export const COMPONENT_CATEGORIES: Array<{ id: ComponentCategory; nameUz: string; icon: string }> = [
  { id: 'diodes', nameUz: 'Diodlar va LEDlar', icon: 'zap' },
  { id: 'transistors', nameUz: 'Tranzistorlar', icon: 'cpu' },
  { id: 'power', nameUz: 'Quvvat Manbalari', icon: 'battery' },
  { id: 'resistors', nameUz: 'Rezistorlar va Reostatlar', icon: 'activity' },
  { id: 'capacitors', nameUz: 'Kondensatorlar', icon: 'layers' },
  { id: 'ics', nameUz: 'Integral Mikrosxemalar (IC)', icon: 'box' },
  { id: 'opamps', nameUz: 'Komparator & Op-Amp', icon: 'git-merge' },
  { id: 'transformers', nameUz: 'Transformatorlar', icon: 'refresh-cw' },
  { id: 'switches', nameUz: 'Kalitlar va Tugmalar', icon: 'toggle-left' },
  { id: 'other', nameUz: 'Boshqa Komponentlar', icon: 'volume-2' }
];

// Standard Breadboard Pitch Unit: 0.25 units = 2.54 mm (0.1 inch)
const PITCH = 0.25;

export const COMPONENT_CATALOG: Record<ComponentType, ComponentSpecification> = {
  // ------------------- DIODES -------------------
  diode_1n4007: {
    type: 'diode_1n4007',
    category: 'diodes',
    nameUz: '1N4007 To‘g‘rilovchi Diod',
    code: '1N4007',
    descriptionUz: 'Klassik to‘g‘rilovchi kremniy diod. Tokni faqat bir yo‘nalishda (anoddan katodga) o‘tkazadi.',
    datasheetSnippetUz: 'Maksimal tok: 1A, Maksimal teskari kuchlanish: 1000V, To‘g‘ri kuchlanish tushishi: ~0.7V.',
    pins: [
      { id: 'anode', label: 'Anod (+)', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Musbat kirish' },
      { id: 'cathode', label: 'Katod (- oq chiziq)', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Manfiy chiqish (kumush chiziq tomoni)' }
    ],
    defaultParameters: { v_forward: 0.7, max_current: 1.0 },
    parameterUnits: { v_forward: 'V', max_current: 'A' },
    modelDimensions: { width: 1.2, depth: 0.35, height: 0.35 }
  },
  diode_zener: {
    type: 'diode_zener',
    category: 'diodes',
    nameUz: 'Zener Diod (5.1V)',
    code: 'BZX55C5V1',
    descriptionUz: 'Kuchlanishni barqarorlashtiruvchi Zener diodi. Teskari yo‘nalishda 5.1V da ochiladi.',
    datasheetSnippetUz: 'Zener kuchlanishi: 5.1V, Quvvat: 0.5W. Kuchlanish stabilizatorlarida qo‘llaniladi.',
    pins: [
      { id: 'anode', label: 'Anod (+)', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Anod' },
      { id: 'cathode', label: 'Katod (-)', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Katod (qora chiziq)' }
    ],
    defaultParameters: { v_zener: 5.1, v_forward: 0.7, power: 0.5 },
    parameterUnits: { v_zener: 'V', v_forward: 'V', power: 'W' },
    modelDimensions: { width: 1.2, depth: 0.3, height: 0.3 }
  },
  diode_schottky: {
    type: 'diode_schottky',
    category: 'diodes',
    nameUz: 'Shottki Diod (1N5819)',
    code: '1N5819',
    descriptionUz: 'Juda tezkor va kuchlanish tushishi kam bo‘lgan (0.3V) Shottki to‘g‘rilovchi diodi.',
    datasheetSnippetUz: 'To‘g‘ri kuchlanish tushishi: ~0.3V, Maksimal tok: 1A. Yuqori chastotali zanjirlar uchun.',
    pins: [
      { id: 'anode', label: 'Anod (+)', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Anod' },
      { id: 'cathode', label: 'Katod (-)', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Katod' }
    ],
    defaultParameters: { v_forward: 0.3, max_current: 1.0 },
    parameterUnits: { v_forward: 'V', max_current: 'A' },
    modelDimensions: { width: 1.2, depth: 0.35, height: 0.35 }
  },
  led_red: {
    type: 'led_red',
    category: 'diodes',
    nameUz: 'Qizil LED (Yorug‘lik Diodi)',
    code: 'LED-5MM-RED',
    descriptionUz: '5mm qizil yorug‘lik chiqaruvchi diod. Ketma-ket o‘rnatilgan 220Ω-330Ω rezistor bilan ishlatilishi shart!',
    datasheetSnippetUz: 'Ishchi kuchlanish: 1.8V - 2.1V, Optimal tok: 10mA - 20mA, Maksimal ruxsat etilgan tok: 30mA (rezistorsiz ulasangiz kuyadi).',
    pins: [
      { id: 'anode', label: 'Anod (+ uzun oyoq)', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Musbat qutb' },
      { id: 'cathode', label: 'Katod (- qisqa oyoq, qirrali)', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Manfiy qutb' }
    ],
    defaultParameters: { v_forward: 1.9, current_opt: 0.015, color: '#ef4444' },
    parameterUnits: { v_forward: 'V', current_opt: 'A' },
    modelDimensions: { width: 0.6, depth: 0.6, height: 0.9 }
  },
  led_green: {
    type: 'led_green',
    category: 'diodes',
    nameUz: 'Yashil LED',
    code: 'LED-5MM-GRN',
    descriptionUz: '5mm yashil yorug‘lik chiqaruvchi diod.',
    datasheetSnippetUz: 'Ishchi kuchlanish: 2.1V - 2.4V, Optimal tok: 15mA.',
    pins: [
      { id: 'anode', label: 'Anod (+)', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Musbat qutb' },
      { id: 'cathode', label: 'Katod (-)', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Manfiy qutb' }
    ],
    defaultParameters: { v_forward: 2.2, current_opt: 0.015, color: '#10b981' },
    parameterUnits: { v_forward: 'V', current_opt: 'A' },
    modelDimensions: { width: 0.6, depth: 0.6, height: 0.9 }
  },
  led_blue: {
    type: 'led_blue',
    category: 'diodes',
    nameUz: 'Moviy LED',
    code: 'LED-5MM-BLU',
    descriptionUz: '5mm moviy yuqori yorug‘likka ega diod.',
    datasheetSnippetUz: 'Ishchi kuchlanish: 3.0V - 3.2V, Optimal tok: 15mA.',
    pins: [
      { id: 'anode', label: 'Anod (+)', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Musbat qutb' },
      { id: 'cathode', label: 'Katod (-)', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Manfiy qutb' }
    ],
    defaultParameters: { v_forward: 3.1, current_opt: 0.015, color: '#0ea5e9' },
    parameterUnits: { v_forward: 'V', current_opt: 'A' },
    modelDimensions: { width: 0.6, depth: 0.6, height: 0.9 }
  },
  led_yellow: {
    type: 'led_yellow',
    category: 'diodes',
    nameUz: 'Sariq LED',
    code: 'LED-5MM-YEL',
    descriptionUz: '5mm sariq indikator diod.',
    datasheetSnippetUz: 'Ishchi kuchlanish: 2.0V - 2.2V, Optimal tok: 15mA.',
    pins: [
      { id: 'anode', label: 'Anod (+)', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Musbat qutb' },
      { id: 'cathode', label: 'Katod (-)', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'passive', descriptionUz: 'Manfiy qutb' }
    ],
    defaultParameters: { v_forward: 2.1, current_opt: 0.015, color: '#f59e0b' },
    parameterUnits: { v_forward: 'V', current_opt: 'A' },
    modelDimensions: { width: 0.6, depth: 0.6, height: 0.9 }
  },

  // ------------------- TRANSISTORS -------------------
  transistor_npn_2n2222: {
    type: 'transistor_npn_2n2222',
    category: 'transistors',
    nameUz: 'NPN Bipolyar Tranzistor (2N2222)',
    code: '2N2222A',
    descriptionUz: 'Mashhur NPN bipolyar tranzistor. Baza tokiga bog‘liq holda kollektor-emitter zanjirini ochadi.',
    datasheetSnippetUz: 'Paket: TO-92. Oyoqlari (tekis tomon oldinga qaraganda): Emitter (chap), Baza (o‘rta), Kollektor (o‘ng). Hfe (kuchaytirish): ~100-300.',
    pins: [
      { id: 'emitter', label: 'Emitter (E)', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Emitter (GND tomoniga)' },
      { id: 'base', label: 'Baza (B)', relativePosition: { x: 0, y: 0, z: -0.15 }, pinType: 'input', descriptionUz: 'Boshqaruvchi baza' },
      { id: 'collector', label: 'Kollektor (C)', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Yuklama ulangan kollektor' }
    ],
    defaultParameters: { hfe: 150, v_be_on: 0.7, max_ic: 0.8 },
    parameterUnits: { hfe: 'Hfe', v_be_on: 'V', max_ic: 'A' },
    modelDimensions: { width: 0.6, depth: 0.45, height: 0.7 }
  },
  transistor_pnp_2n3906: {
    type: 'transistor_pnp_2n3906',
    category: 'transistors',
    nameUz: 'PNP Bipolyar Tranzistor (2N3906)',
    code: '2N3906',
    descriptionUz: 'PNP tipidagi bipolyar tranzistor. Bazaga past kuchlanish (GND) berilganda ochiladi.',
    datasheetSnippetUz: 'Paket: TO-92. Oyoqlari: Emitter, Baza, Kollektor. Maksimal tok: 200mA.',
    pins: [
      { id: 'emitter', label: 'Emitter (E)', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'power', descriptionUz: 'Emitter (VCC tomoniga)' },
      { id: 'base', label: 'Baza (B)', relativePosition: { x: 0, y: 0, z: -0.15 }, pinType: 'input', descriptionUz: 'Baza' },
      { id: 'collector', label: 'Kollektor (C)', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Kollektor' }
    ],
    defaultParameters: { hfe: 100, v_be_on: 0.7, max_ic: 0.2 },
    parameterUnits: { hfe: 'Hfe', v_be_on: 'V', max_ic: 'A' },
    modelDimensions: { width: 0.6, depth: 0.45, height: 0.7 }
  },
  transistor_mosfet_n: {
    type: 'transistor_mosfet_n',
    category: 'transistors',
    nameUz: 'N-Kanal MOSFET (2N7000)',
    code: '2N7000',
    descriptionUz: 'Maydoniy (MOSFET) tranzistor. Zabor (Gate) kuchlanishi orqali Istok-Stok o‘tkazuvchanligi boshqariladi.',
    datasheetSnippetUz: 'Oyoqlari: Source (Istok), Gate (Zatvor), Drain (Stok). Ochilish bo‘sag‘asi Vth: 2.1V.',
    pins: [
      { id: 'source', label: 'Source (S)', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Istok (GND tomon)' },
      { id: 'gate', label: 'Gate (G)', relativePosition: { x: 0, y: 0, z: -0.15 }, pinType: 'input', descriptionUz: 'Zatvor (boshqaruv)' },
      { id: 'drain', label: 'Drain (D)', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Stok (yuklama)' }
    ],
    defaultParameters: { v_th: 2.1, r_ds_on: 1.2 },
    parameterUnits: { v_th: 'V', r_ds_on: 'Ω' },
    modelDimensions: { width: 0.6, depth: 0.45, height: 0.7 }
  },
  transistor_mosfet_p: {
    type: 'transistor_mosfet_p',
    category: 'transistors',
    nameUz: 'P-Kanal MOSFET (IRF9540)',
    code: 'IRF9540',
    descriptionUz: 'P-kanal kuchli MOSFET tranzistor. Yuqori tomonli quvvat kalitlari uchun mo‘ljallangan.',
    datasheetSnippetUz: 'V_DS: -100V, R_DS(on): 0.15Ω. Oyoqlari: Gate, Drain, Source.',
    pins: [
      { id: 'gate', label: 'Gate (G)', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'input', descriptionUz: 'Zatvor' },
      { id: 'drain', label: 'Drain (D)', relativePosition: { x: 0, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Stok' },
      { id: 'source', label: 'Source (S)', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'power', descriptionUz: 'Istok' }
    ],
    defaultParameters: { v_th: -3.0, r_ds_on: 0.2 },
    parameterUnits: { v_th: 'V', r_ds_on: 'Ω' },
    modelDimensions: { width: 0.9, depth: 0.4, height: 1.2 }
  },

  // ------------------- POWER SOURCES -------------------
  dc_battery_9v: {
    type: 'dc_battery_9v',
    category: 'power',
    nameUz: '9V Krona Batareya',
    code: 'BATT-9V',
    descriptionUz: 'Standart 9V DC galvanik batareya. Musbat va manfiy qutbga ega.',
    datasheetSnippetUz: 'Nominal kuchlanish: 9.0V, Sig‘im: ~500mAh. To‘g‘ridan-to‘g‘ri qisqa tutashtirishdan saqlaning!',
    pins: [
      { id: 'pos', label: '+ 9V Musbat', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'power', descriptionUz: 'Musbat terminal (+)' },
      { id: 'neg', label: '- GND Zamin', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'ground', descriptionUz: 'Manfiy terminal (-)' }
    ],
    defaultParameters: { voltage: 9.0, internal_resistance: 1.5 },
    parameterUnits: { voltage: 'V', internal_resistance: 'Ω' },
    modelDimensions: { width: 1.6, depth: 1.0, height: 1.8 }
  },
  dc_supply_5v: {
    type: 'dc_supply_5v',
    category: 'power',
    nameUz: '5V DC Laboratoriya Manbai',
    code: 'PSU-5V',
    descriptionUz: 'Stabil 5.0V o‘zgarmas tok manbai. TTL mikrosxemalar va mikrokontrollerlar uchun standart.',
    datasheetSnippetUz: 'Kuchlanish: 5.00V DC barqaror, Maksimal tok: 2.0A.',
    pins: [
      { id: 'pos', label: '+ 5V VCC', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'power', descriptionUz: '+5V chiqish' },
      { id: 'neg', label: 'GND (0V)', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'ground', descriptionUz: 'Zamin / 0V' }
    ],
    defaultParameters: { voltage: 5.0, max_current: 2.0 },
    parameterUnits: { voltage: 'V', max_current: 'A' },
    modelDimensions: { width: 1.5, depth: 1.2, height: 0.9 }
  },
  dc_supply_3v3: {
    type: 'dc_supply_3v3',
    category: 'power',
    nameUz: '3.3V DC Manba',
    code: 'PSU-3V3',
    descriptionUz: '3.3V zamonaviy raqamli elektronika manbai.',
    datasheetSnippetUz: 'Kuchlanish: 3.30V DC, Maksimal tok: 1.0A.',
    pins: [
      { id: 'pos', label: '+ 3.3V', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'power', descriptionUz: '+3.3V chiqish' },
      { id: 'neg', label: 'GND (0V)', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'ground', descriptionUz: 'Zamin / 0V' }
    ],
    defaultParameters: { voltage: 3.3, max_current: 1.0 },
    parameterUnits: { voltage: 'V', max_current: 'A' },
    modelDimensions: { width: 1.4, depth: 1.0, height: 0.8 }
  },
  dc_adjustable: {
    type: 'dc_adjustable',
    category: 'power',
    nameUz: 'Sozlanuvchi DC Manba (0-12V)',
    code: 'PSU-ADJ',
    descriptionUz: 'Kuchlanishi parametrlar panelida 0V dan 12V gacha o‘zgartirilishi mumkin bo‘lgan manba.',
    datasheetSnippetUz: 'O‘zgaruvchan DC manba. Qisqa tutashuvdan himoyalangan.',
    pins: [
      { id: 'pos', label: 'V+ Sozlanuvchi', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'power', descriptionUz: 'Musbat chiqish' },
      { id: 'neg', label: 'V- GND', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'ground', descriptionUz: 'Manfiy chiqish' }
    ],
    defaultParameters: { voltage: 6.0, max_current: 3.0 },
    parameterUnits: { voltage: 'V', max_current: 'A' },
    modelDimensions: { width: 1.8, depth: 1.4, height: 1.1 }
  },
  ac_source: {
    type: 'ac_source',
    category: 'power',
    nameUz: 'AC Sinus Signal Generator',
    code: 'GEN-AC',
    descriptionUz: 'Sinusoidal o‘zgaruvchan tok (AC) signali manbai.',
    datasheetSnippetUz: 'Amplituda: 5V (10Vpp), Chastota: 1000 Hz.',
    pins: [
      { id: 'pos', label: 'AC Chiqish (~)', relativePosition: { x: -PITCH, y: 0, z: -0.2 }, pinType: 'power', descriptionUz: 'O‘zgaruvchan signal' },
      { id: 'neg', label: 'AC Zamin (0V)', relativePosition: { x: PITCH, y: 0, z: -0.2 }, pinType: 'ground', descriptionUz: 'Qayta ulanish zamin' }
    ],
    defaultParameters: { amplitude: 5.0, frequency: 1000 },
    parameterUnits: { amplitude: 'V', frequency: 'Hz' },
    modelDimensions: { width: 1.8, depth: 1.2, height: 1.0 }
  },

  // ------------------- TRANSFORMERS -------------------
  transformer_stepdown: {
    type: 'transformer_stepdown',
    category: 'transformers',
    nameUz: 'Pastlatuvchi Transformator (2:1)',
    code: 'XFRM-2TO1',
    descriptionUz: 'Magnit o‘zakli induktiv transformator. Birlamchi chulg‘amdan ikkilamchiga quvvat uzatadi.',
    datasheetSnippetUz: 'Transformatsiya koeffitsiyenti n: 2.0 (Kuchlanishni 2 barobar kamaytiradi). Birlamchi 2 pin, ikkilamchi 2 pin.',
    pins: [
      { id: 'pri_1', label: 'Birlamchi 1 (Pri A)', relativePosition: { x: -PITCH * 2, y: PITCH, z: -0.2 }, pinType: 'passive', descriptionUz: 'Birlamchi kirish A' },
      { id: 'pri_2', label: 'Birlamchi 2 (Pri B)', relativePosition: { x: -PITCH * 2, y: -PITCH, z: -0.2 }, pinType: 'passive', descriptionUz: 'Birlamchi kirish B' },
      { id: 'sec_1', label: 'Ikkilamchi 1 (Sec A)', relativePosition: { x: PITCH * 2, y: PITCH, z: -0.2 }, pinType: 'passive', descriptionUz: 'Ikkilamchi chiqish A' },
      { id: 'sec_2', label: 'Ikkilamchi 2 (Sec B)', relativePosition: { x: PITCH * 2, y: -PITCH, z: -0.2 }, pinType: 'passive', descriptionUz: 'Ikkilamchi chiqish B' }
    ],
    defaultParameters: { ratio: 2.0, primary_inductance: 0.1 },
    parameterUnits: { ratio: ':1', primary_inductance: 'H' },
    modelDimensions: { width: 1.6, depth: 1.6, height: 1.2 }
  },

  // ------------------- OP-AMPS & COMPARATORS -------------------
  ic_lm393: {
    type: 'ic_lm393',
    category: 'opamps',
    nameUz: 'LM393 Dual Komparator',
    code: 'LM393',
    descriptionUz: 'Ikkita mustaqil aniq komparatorni o‘z ichiga olgan DIP-8 mikrosxema. Ochiq kollektorli chiqishga ega.',
    datasheetSnippetUz: 'VCC: 2V - 36V. Chiqish ochiq kollektor (pull-up rezistor talab qiladi). 1-chi komparator: IN+ (pin 3), IN- (pin 2), OUT (pin 1).',
    pins: [
      { id: 'out1', label: '1: OUT 1', relativePosition: { x: -PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'output', descriptionUz: 'Komparator 1 Chiqish' },
      { id: 'in1_neg', label: '2: IN1 (-)', relativePosition: { x: -PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Komparator 1 Invertor kirish' },
      { id: 'in1_pos', label: '3: IN1 (+)', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Komparator 1 To‘g‘ri kirish' },
      { id: 'gnd', label: '4: GND', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'ground', descriptionUz: 'Umumiy zamin' },
      { id: 'in2_pos', label: '5: IN2 (+)', relativePosition: { x: PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Komparator 2 To‘g‘ri kirish' },
      { id: 'in2_neg', label: '6: IN2 (-)', relativePosition: { x: PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Komparator 2 Invertor kirish' },
      { id: 'out2', label: '7: OUT 2', relativePosition: { x: PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'output', descriptionUz: 'Komparator 2 Chiqish' },
      { id: 'vcc', label: '8: VCC', relativePosition: { x: PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'power', descriptionUz: 'Quvvat manbai (+)' }
    ],
    defaultParameters: { vcc: 5.0, open_loop_gain: 200000 },
    parameterUnits: { vcc: 'V', open_loop_gain: 'V/V' },
    modelDimensions: { width: 1.0, depth: 1.2, height: 0.45 }
  },
  ic_lm358: {
    type: 'ic_lm358',
    category: 'opamps',
    nameUz: 'LM358 Dual Operatsion Kuchaytirgich',
    code: 'LM358',
    descriptionUz: 'Ikkita kam quvvatli operatsion kuchaytirgich (Op-Amp). Bir qutbli manbadan (3V - 32V) ishlashga moslashgan.',
    datasheetSnippetUz: 'DIP-8 paket. Amplifikatsiya koeffitsiyenti: 100 dB. Chiqishi zamingacha tushishi mumkin.',
    pins: [
      { id: 'out1', label: '1: OUT 1', relativePosition: { x: -PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'output', descriptionUz: 'Op-Amp 1 Chiqish' },
      { id: 'in1_neg', label: '2: IN1 (-)', relativePosition: { x: -PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Op-Amp 1 Invertor' },
      { id: 'in1_pos', label: '3: IN1 (+)', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Op-Amp 1 No-invertor' },
      { id: 'gnd', label: '4: GND', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'ground', descriptionUz: 'Zamin' },
      { id: 'in2_pos', label: '5: IN2 (+)', relativePosition: { x: PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Op-Amp 2 No-invertor' },
      { id: 'in2_neg', label: '6: IN2 (-)', relativePosition: { x: PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Op-Amp 2 Invertor' },
      { id: 'out2', label: '7: OUT 2', relativePosition: { x: PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'output', descriptionUz: 'Op-Amp 2 Chiqish' },
      { id: 'vcc', label: '8: VCC', relativePosition: { x: PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'power', descriptionUz: 'VCC Musbat' }
    ],
    defaultParameters: { vcc: 5.0, gain: 100000 },
    parameterUnits: { vcc: 'V', gain: 'V/V' },
    modelDimensions: { width: 1.0, depth: 1.2, height: 0.45 }
  },
  ic_lm741: {
    type: 'ic_lm741',
    category: 'opamps',
    nameUz: 'LM741 Klassik Op-Amp',
    code: 'LM741',
    descriptionUz: 'Klassik universal operatsion kuchaytirgich. Elektronika asoslarini o‘rganish uchun eng mashhur model.',
    datasheetSnippetUz: 'DIP-8 paket. Pin 2: Inverting, Pin 3: Non-inverting, Pin 6: Output, Pin 7: VCC+, Pin 4: VCC-.',
    pins: [
      { id: 'offset1', label: '1: Offset', relativePosition: { x: -PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'passive', descriptionUz: 'Balans 1' },
      { id: 'in_neg', label: '2: IN (-)', relativePosition: { x: -PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Invertor kirish' },
      { id: 'in_pos', label: '3: IN (+)', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'No-invertor kirish' },
      { id: 'vee', label: '4: V-', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'ground', descriptionUz: 'Manfiy quvvat (GND)' },
      { id: 'offset2', label: '5: Offset', relativePosition: { x: PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'passive', descriptionUz: 'Balans 2' },
      { id: 'out', label: '6: OUT', relativePosition: { x: PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'output', descriptionUz: 'Chiqish' },
      { id: 'vcc', label: '7: V+', relativePosition: { x: PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'power', descriptionUz: 'Musbat quvvat' },
      { id: 'nc', label: '8: NC', relativePosition: { x: PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'passive', descriptionUz: 'Ulanmaydi' }
    ],
    defaultParameters: { vcc: 12.0, gain: 200000 },
    parameterUnits: { vcc: 'V', gain: 'V/V' },
    modelDimensions: { width: 1.0, depth: 1.2, height: 0.45 }
  },

  // ------------------- RESISTORS -------------------
  resistor_220: {
    type: 'resistor_220',
    category: 'resistors',
    nameUz: '220Ω Rezistor (LED uchun)',
    code: 'RES-220R',
    descriptionUz: '220 Om rezistor. 5V zanjirda LED diodlarini kuyishdan himoya qilish uchun ideal qiymat.',
    datasheetSnippetUz: 'Rang belgilari: Qizil - Qizil - Jigarrang - Oltin (220Ω ±5%). Quvvat: 0.25W.',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '1-terminal' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '2-terminal' }
    ],
    defaultParameters: { resistance: 220, power_rating: 0.25 },
    parameterUnits: { resistance: 'Ω', power_rating: 'W' },
    modelDimensions: { width: 1.2, depth: 0.3, height: 0.3 }
  },
  resistor_330: {
    type: 'resistor_330',
    category: 'resistors',
    nameUz: '330Ω Rezistor',
    code: 'RES-330R',
    descriptionUz: '330 Om rezistor. Standart oqim cheklovchi rezistor.',
    datasheetSnippetUz: 'Ranglar: Zarg‘aldoq - Zarg‘aldoq - Jigarrang - Oltin. Quvvat: 0.25W.',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '1-terminal' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '2-terminal' }
    ],
    defaultParameters: { resistance: 330, power_rating: 0.25 },
    parameterUnits: { resistance: 'Ω', power_rating: 'W' },
    modelDimensions: { width: 1.2, depth: 0.3, height: 0.3 }
  },
  resistor_1k: {
    type: 'resistor_1k',
    category: 'resistors',
    nameUz: '1kΩ Rezistor',
    code: 'RES-1K',
    descriptionUz: '1000 Om (1 kiloOm) rezistor. Tranzistor bazasini cheklash va bo‘luvchi zanjirlar uchun.',
    datasheetSnippetUz: 'Ranglar: Jigarrang - Qora - Qizil - Oltin. Quvvat: 0.25W.',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '1-terminal' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '2-terminal' }
    ],
    defaultParameters: { resistance: 1000, power_rating: 0.25 },
    parameterUnits: { resistance: 'Ω', power_rating: 'W' },
    modelDimensions: { width: 1.2, depth: 0.3, height: 0.3 }
  },
  resistor_10k: {
    type: 'resistor_10k',
    category: 'resistors',
    nameUz: '10kΩ Rezistor (Pull-Up)',
    code: 'RES-10K',
    descriptionUz: '10 kiloOm rezistor. Tugmalar va mikrosxemalarda Pull-Up / Pull-Down sifatida keng ishlatiladi.',
    datasheetSnippetUz: 'Ranglar: Jigarrang - Qora - Zarg‘aldoq - Oltin.',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '1-terminal' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '2-terminal' }
    ],
    defaultParameters: { resistance: 10000, power_rating: 0.25 },
    parameterUnits: { resistance: 'Ω', power_rating: 'W' },
    modelDimensions: { width: 1.2, depth: 0.3, height: 0.3 }
  },
  resistor_100k: {
    type: 'resistor_100k',
    category: 'resistors',
    nameUz: '100kΩ Rezistor',
    code: 'RES-100K',
    descriptionUz: '100 kiloOm yuqori qarshilikli rezistor. Taymer va filtr zanjirlarida vaqt doimiysini o‘rnatadi.',
    datasheetSnippetUz: 'Ranglar: Jigarrang - Qora - Sariq - Oltin.',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '1-terminal' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '2-terminal' }
    ],
    defaultParameters: { resistance: 100000, power_rating: 0.25 },
    parameterUnits: { resistance: 'Ω', power_rating: 'W' },
    modelDimensions: { width: 1.2, depth: 0.3, height: 0.3 }
  },
  potentiometer_10k: {
    type: 'potentiometer_10k',
    category: 'resistors',
    nameUz: '10kΩ Potensiometr (Reostat)',
    code: 'POT-10K',
    descriptionUz: 'O‘zgaruvchan qarshilik. O‘rtadagi oyoq (Wiper) orqali kuchlanishni 0 dan maksimalgacha bo‘lib beradi.',
    datasheetSnippetUz: 'Terminal 1 va 3 orasidagi to‘liq qarshilik: 10kΩ. Terminal 2: harakatlanuvchi kontakt.',
    pins: [
      { id: 'p1', label: '1-terminal (VCC)', relativePosition: { x: -PITCH, y: -PITCH, z: -0.15 }, pinType: 'passive', descriptionUz: 'Chekka terminal 1' },
      { id: 'wiper', label: '2-Wiper (Chiqish)', relativePosition: { x: 0, y: PITCH, z: -0.15 }, pinType: 'output', descriptionUz: 'O‘rtadagi sozlanuvchi chiqish' },
      { id: 'p3', label: '3-terminal (GND)', relativePosition: { x: PITCH, y: -PITCH, z: -0.15 }, pinType: 'passive', descriptionUz: 'Chekka terminal 3' }
    ],
    defaultParameters: { total_resistance: 10000, wiper_ratio: 0.5 },
    parameterUnits: { total_resistance: 'Ω', wiper_ratio: '%' },
    modelDimensions: { width: 0.8, depth: 0.8, height: 1.0 }
  },
  photoresistor_ldr: {
    type: 'photoresistor_ldr',
    category: 'resistors',
    nameUz: 'Fotorezistor (LDR)',
    code: 'LDR-GL5528',
    descriptionUz: 'Yorug‘likka sezgir rezistor. Yorug‘lik tushganda qarshiligi kamayadi, qorong‘ida esa megaomlargacha oshadi.',
    datasheetSnippetUz: 'Qorong‘ilikdagi qarshilik: ~1MΩ, Yorug‘likdagi qarshilik: ~10kΩ.',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Terminal 1' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Terminal 2' }
    ],
    defaultParameters: { resistance: 10000, light_level: 50 },
    parameterUnits: { resistance: 'Ω', light_level: '%' },
    modelDimensions: { width: 0.6, depth: 0.4, height: 0.5 }
  },

  // ------------------- CAPACITORS -------------------
  capacitor_ceramic_100n: {
    type: 'capacitor_ceramic_100n',
    category: 'capacitors',
    nameUz: '100nF Keramik Kondensator',
    code: 'CAP-104',
    descriptionUz: '0.1µF (104) qutbsiz keramik kondensator. Shovqinlarni filtrlovchi dekoupling kondensatori.',
    datasheetSnippetUz: 'Sig‘im: 100nF, Qutbsiz (har qanday yo‘nalishda ulanadi).',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Terminal 1' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Terminal 2' }
    ],
    defaultParameters: { capacitance: 1e-7, max_voltage: 50 },
    parameterUnits: { capacitance: 'F', max_voltage: 'V' },
    modelDimensions: { width: 0.5, depth: 0.25, height: 0.6 }
  },
  capacitor_electrolytic_10u: {
    type: 'capacitor_electrolytic_10u',
    category: 'capacitors',
    nameUz: '10µF Elektrolitik Kondensator',
    code: 'CAP-10UF',
    descriptionUz: '10 mikrofarad qutbli elektrolitik kondensator. Qutblanishga qat’iy rioya qiling!',
    datasheetSnippetUz: 'Sig‘im: 10µF, 25V. Oq chiziq tomoni manfiy (-) oyoq bo‘lib, zaminga ulanishi shart.',
    pins: [
      { id: 'pos', label: 'Musbat (+ uzun)', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Musbat qutb' },
      { id: 'neg', label: 'Manfiy (- oq chiziq)', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Manfiy qutb' }
    ],
    defaultParameters: { capacitance: 1e-5, max_voltage: 25 },
    parameterUnits: { capacitance: 'F', max_voltage: 'V' },
    modelDimensions: { width: 0.5, depth: 0.5, height: 0.9 }
  },
  capacitor_electrolytic_100u: {
    type: 'capacitor_electrolytic_100u',
    category: 'capacitors',
    nameUz: '100µF Elektrolitik Kondensator',
    code: 'CAP-100UF',
    descriptionUz: '100 mikrofarad quvvat filtr kondensatori. Kuchlanish o‘zgarishlarini tekislaydi.',
    datasheetSnippetUz: 'Sig‘im: 100µF, 25V. Qutbli.',
    pins: [
      { id: 'pos', label: 'Musbat (+)', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Musbat qutb' },
      { id: 'neg', label: 'Manfiy (-)', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Manfiy qutb' }
    ],
    defaultParameters: { capacitance: 1e-4, max_voltage: 25 },
    parameterUnits: { capacitance: 'F', max_voltage: 'V' },
    modelDimensions: { width: 0.7, depth: 0.7, height: 1.1 }
  },
  capacitor_film_1u: {
    type: 'capacitor_film_1u',
    category: 'capacitors',
    nameUz: '1µF Plyonkali Kondensator',
    code: 'CAP-FILM-1U',
    descriptionUz: '1µF qutbsiz poliester plyonkali kondensator. Ovoz va filtr zanjirlari uchun.',
    datasheetSnippetUz: 'Sig‘im: 1.0µF, 100V. Yuqori stabillik.',
    pins: [
      { id: 'p1', label: '1-oyoq', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Terminal 1' },
      { id: 'p2', label: '2-oyoq', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Terminal 2' }
    ],
    defaultParameters: { capacitance: 1e-6, max_voltage: 100 },
    parameterUnits: { capacitance: 'F', max_voltage: 'V' },
    modelDimensions: { width: 1.1, depth: 0.5, height: 0.8 }
  },

  // ------------------- INTEGRATED CIRCUITS -------------------
  ic_ne555: {
    type: 'ic_ne555',
    category: 'ics',
    nameUz: 'NE555 Taymer Mikrosxemasi',
    code: 'NE555P',
    descriptionUz: 'Eng mashhur taymer va impuls generatori. Astabil (generator) va monostabil rejimlarda ishlaydi.',
    datasheetSnippetUz: 'DIP-8 paket. Pin 1: GND, Pin 2: TRIG, Pin 3: OUT, Pin 4: RESET, Pin 5: CTRL, Pin 6: THRES, Pin 7: DISCH, Pin 8: VCC (+5V..+15V).',
    pins: [
      { id: 'pin1_gnd', label: '1: GND', relativePosition: { x: -PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'ground', descriptionUz: 'Zamin' },
      { id: 'pin2_trig', label: '2: TRIG', relativePosition: { x: -PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Trigger kirish' },
      { id: 'pin3_out', label: '3: OUT', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'output', descriptionUz: 'Impuls chiqishi' },
      { id: 'pin4_rst', label: '4: RESET', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Qayta yuklash (VCC ga ulanadi)' },
      { id: 'pin5_ctrl', label: '5: CTRL', relativePosition: { x: PITCH * 1.5, y: -PITCH * 1.5, z: -0.15 }, pinType: 'passive', descriptionUz: 'Boshqaruv' },
      { id: 'pin6_thr', label: '6: THRESH', relativePosition: { x: PITCH * 1.5, y: -PITCH * 0.5, z: -0.15 }, pinType: 'input', descriptionUz: 'Bo‘sag‘a' },
      { id: 'pin7_dis', label: '7: DISCH', relativePosition: { x: PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'output', descriptionUz: 'Razryad' },
      { id: 'pin8_vcc', label: '8: VCC', relativePosition: { x: PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'power', descriptionUz: 'Quvvat (+5V..+12V)' }
    ],
    defaultParameters: { vcc: 5.0 },
    parameterUnits: { vcc: 'V' },
    modelDimensions: { width: 1.0, depth: 1.2, height: 0.45 }
  },
  ic_74hc04: {
    type: 'ic_74hc04',
    category: 'ics',
    nameUz: '74HC04 Mantiqiy Invertor (NOT)',
    code: '74HC04N',
    descriptionUz: 'DIP-14 paketdagi 6 ta mustaqil mantiqiy invertor (NOT elementi). Kirish 1 bo‘lsa chiqish 0, va aksincha.',
    datasheetSnippetUz: 'VCC: Pin 14, GND: Pin 7. 1-chi invertor: Kirish 1A (pin 1), Chiqish 1Y (pin 2).',
    pins: [
      { id: 'pin1_1a', label: '1: 1A', relativePosition: { x: -PITCH * 1.5, y: PITCH * 2.5, z: -0.15 }, pinType: 'input', descriptionUz: '1-invertor kirish' },
      { id: 'pin2_1y', label: '2: 1Y', relativePosition: { x: -PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'output', descriptionUz: '1-invertor chiqish' },
      { id: 'pin7_gnd', label: '7: GND', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 2.5, z: -0.15 }, pinType: 'ground', descriptionUz: 'Zamin' },
      { id: 'pin14_vcc', label: '14: VCC', relativePosition: { x: PITCH * 1.5, y: PITCH * 2.5, z: -0.15 }, pinType: 'power', descriptionUz: 'Quvvat (+5V)' }
    ],
    defaultParameters: { vcc: 5.0 },
    parameterUnits: { vcc: 'V' },
    modelDimensions: { width: 1.0, depth: 1.8, height: 0.45 }
  },
  ic_74hc08: {
    type: 'ic_74hc08',
    category: 'ics',
    nameUz: '74HC08 Mantiqiy VA (AND)',
    code: '74HC08N',
    descriptionUz: '4 ta 2-kirishli mantiqiy VA (AND) elementlari. Ikkala kirish 1 bo‘lsagina chiqish 1 bo‘ladi.',
    datasheetSnippetUz: 'VCC: Pin 14, GND: Pin 7. 1-chi element: Kirishlar 1A (pin 1), 1B (pin 2), Chiqish 1Y (pin 3).',
    pins: [
      { id: 'pin1_1a', label: '1: 1A', relativePosition: { x: -PITCH * 1.5, y: PITCH * 2.5, z: -0.15 }, pinType: 'input', descriptionUz: '1A kirish' },
      { id: 'pin2_1b', label: '2: 1B', relativePosition: { x: -PITCH * 1.5, y: PITCH * 1.5, z: -0.15 }, pinType: 'input', descriptionUz: '1B kirish' },
      { id: 'pin3_1y', label: '3: 1Y', relativePosition: { x: -PITCH * 1.5, y: PITCH * 0.5, z: -0.15 }, pinType: 'output', descriptionUz: '1Y chiqish' },
      { id: 'pin7_gnd', label: '7: GND', relativePosition: { x: -PITCH * 1.5, y: -PITCH * 2.5, z: -0.15 }, pinType: 'ground', descriptionUz: 'Zamin' },
      { id: 'pin14_vcc', label: '14: VCC', relativePosition: { x: PITCH * 1.5, y: PITCH * 2.5, z: -0.15 }, pinType: 'power', descriptionUz: 'Quvvat (+5V)' }
    ],
    defaultParameters: { vcc: 5.0 },
    parameterUnits: { vcc: 'V' },
    modelDimensions: { width: 1.0, depth: 1.8, height: 0.45 }
  },

  // ------------------- SWITCHES & OTHERS -------------------
  switch_push_button: {
    type: 'switch_push_button',
    category: 'switches',
    nameUz: 'Tugmali Kalit (Push Button)',
    code: 'SW-TACT-4PIN',
    descriptionUz: 'Bosilganda tutashuvchi (Normally Open) 4-oyoqli taktli tugma. Breadboardga to‘liq mos tushadi.',
    datasheetSnippetUz: 'Bosilganda qarshilik < 0.05Ω (yopiq), qo‘yib yuborilganda uzuq zanjir.',
    pins: [
      { id: 'p1a', label: '1A', relativePosition: { x: -PITCH * 1.5, y: PITCH, z: -0.15 }, pinType: 'passive', descriptionUz: 'A tomon' },
      { id: 'p1b', label: '1B', relativePosition: { x: -PITCH * 1.5, y: -PITCH, z: -0.15 }, pinType: 'passive', descriptionUz: 'A tomon (1A ga ulangan)' },
      { id: 'p2a', label: '2A', relativePosition: { x: PITCH * 1.5, y: PITCH, z: -0.15 }, pinType: 'passive', descriptionUz: 'B tomon' },
      { id: 'p2b', label: '2B', relativePosition: { x: PITCH * 1.5, y: -PITCH, z: -0.15 }, pinType: 'passive', descriptionUz: 'B tomon (2A ga ulangan)' }
    ],
    defaultParameters: { is_pressed: 0 },
    parameterUnits: { is_pressed: '0/1' },
    modelDimensions: { width: 0.9, depth: 0.9, height: 0.6 }
  },
  switch_slide: {
    type: 'switch_slide',
    category: 'switches',
    nameUz: 'Suriluvchi Kalit (Slide Switch)',
    code: 'SW-SLIDE-SPDT',
    descriptionUz: 'SPDT tipidagi 3-oyoqli siljitma kalit. O‘rtadagi kontaktni chap yoki o‘ng kontaktga ulaydi.',
    datasheetSnippetUz: 'O‘rta oyoq umumiy (Common), ikki chekkasi 1 va 2 yo‘nalish.',
    pins: [
      { id: 'p1', label: '1-holat', relativePosition: { x: -PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'Chap terminal' },
      { id: 'common', label: 'Umumiy (COM)', relativePosition: { x: 0, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'O‘rta umumiy' },
      { id: 'p2', label: '2-holat', relativePosition: { x: PITCH, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: 'O‘ng terminal' }
    ],
    defaultParameters: { state: 1 },
    parameterUnits: { state: '1/2' },
    modelDimensions: { width: 0.8, depth: 0.4, height: 0.6 }
  },
  buzzer_piezo: {
    type: 'buzzer_piezo',
    category: 'other',
    nameUz: 'Pyezo Buzzer (Ovoz Dinamigi)',
    code: 'BUZZER-5V',
    descriptionUz: 'Tovush generatori. 5V kuchlanish berilganda baland ovozda signal chaladi.',
    datasheetSnippetUz: 'Ishchi kuchlanish: 3V - 12V DC, Nominal tok: ~20mA.',
    pins: [
      { id: 'pos', label: 'Musbat (+)', relativePosition: { x: -PITCH * 2, y: 0, z: -0.15 }, pinType: 'passive', descriptionUz: '+ terminal' },
      { id: 'neg', label: 'Manfiy (-)', relativePosition: { x: PITCH * 2, y: 0, z: -0.15 }, pinType: 'ground', descriptionUz: '- terminal' }
    ],
    defaultParameters: { v_nom: 5.0, resistance: 200 },
    parameterUnits: { v_nom: 'V', resistance: 'Ω' },
    modelDimensions: { width: 1.2, depth: 1.2, height: 0.9 }
  },
  ground_terminal: {
    type: 'ground_terminal',
    category: 'other',
    nameUz: 'Umumiy Zamin (GND Terminal)',
    code: 'GND-REF',
    descriptionUz: '0V Malumot Zamin (GND) ulanish nuqtasi.',
    datasheetSnippetUz: 'Potensial: 0.00V (Simulyatsiya hisoblash nol nuqtasi).',
    pins: [
      { id: 'gnd', label: 'GND (0V)', relativePosition: { x: 0, y: 0, z: -0.15 }, pinType: 'ground', descriptionUz: 'Nol potensial nuqtasi' }
    ],
    defaultParameters: { voltage: 0.0 },
    parameterUnits: { voltage: 'V' },
    modelDimensions: { width: 0.6, depth: 0.6, height: 0.5 }
  }
};
