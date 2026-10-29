import React from 'react';
import {
  Zap,
  Hand,
  ShieldCheck,
  Video,
  Play,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
  Lock,
  MousePointer
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-sans">
      
      {/* Background Circuit Grid & Glowing Nodes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle radial gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 w-[700px] h-[400px] bg-emerald-600/10 rounded-full blur-[160px]" />

        {/* Electrical grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-20 border-b border-[#1e325c]/60 bg-[#070d19]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-extrabold shadow-neon-cyan">
              <Zap className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-wider flex items-center gap-1.5">
                ElectroHand
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  v1.0
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                3D ELECTRICAL LAB SIMULATOR
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
              Qanday ishlaydi?
            </a>
            <a href="#circuit-features" className="hover:text-cyan-400 transition-colors">
              Imkoniyatlar
            </a>
            <a href="#privacy" className="hover:text-cyan-400 transition-colors">
              Maxfiylik kafolati
            </a>
          </nav>

          {/* Start CTA Button in Navbar */}
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-neon-cyan hover:shadow-cyan-500/50 transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Boshlash</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e1a38] border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-card-glow animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            MediaPipe AI & Three.js 3D texnologiyasi
          </div>

          {/* Main Heading in Uzbek */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
            Elektr zanjirlarini{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              qo‘l harakatingiz
            </span>{' '}
            bilan boshqaring.
          </h1>

          {/* Subtitle in Uzbek */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Kamerangiz orqali 3D kabellarni ushlang, harakatlantiring va kerakli portlarga ulang.
            Hech qanday maxsus qurilma talab qilinmaydi — faqat oddiy veb-kamera!
          </p>

          {/* Primary CTA Button */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-lg shadow-neon-cyan hover:shadow-cyan-400/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Boshlash</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#0e1a38] hover:bg-[#13234d] text-slate-200 border border-[#1e325c] font-semibold text-base transition-all"
            >
              <span>Qo‘llanma bilan tanishish</span>
            </a>
          </div>

          {/* Feature Badges under CTA */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ro‘yxatdan o‘tish talab etilmaydi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Bepul va brauzerda ishlaydi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Xavfsiz va shaxsiy maxfiylik</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive 3D Preview Visual Card */}
        <div className="mt-16 relative rounded-3xl bg-[#0c162c] border border-[#1e325c] p-3 sm:p-5 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400" />

          {/* Terminal / Preview Mock */}
          <div className="rounded-2xl bg-[#070e1c] border border-slate-800 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2">
                <Activity className="w-4 h-4 animate-pulse" />
                INTERAKTIV 3D LABORATORIYA
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Mikrokontroller va LED Zanjiri
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                3 ta asosiy elektr kabeli: 🔴 <strong>+5V VCC Quvvat</strong>, ⚫ <strong>GND Zamin</strong>, va 🔵 <strong>LED Signal</strong> simlarini barmoqlaringizni chimchilab ushlang va mos keluvchi portlarga ulang.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium">
                  🔴 +5V Quvvat kabeli
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-700/40 border border-slate-600 text-slate-300 text-xs font-medium">
                  ⚫ GND Zamin kabeli
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                  🔵 Signal boshqaruv kabeli
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <button
                onClick={onStart}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 hover:scale-105 transition-transform flex items-center justify-center shadow-neon-cyan group-hover:shadow-cyan-400/80 cursor-pointer"
              >
                <Play className="w-10 h-10 text-black fill-black ml-1" />
              </button>
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Simulyatorni ochish
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-[#1e325c]/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
            QO‘L BILAN BOSHQARISH
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
            Qanday ishlaydi?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Uchta oddiy harakat orqali 3D fazoda elektr kabellarini haqiqiy ustaxonadagidek ulang:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Pinch */}
          <div className="rounded-2xl bg-[#0c162c] border border-[#1e325c] p-6 hover:border-cyan-500/60 transition-all hover:shadow-card-glow group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Hand className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-cyan-400 mb-1">01-QADAM</div>
            <h3 className="text-xl font-bold text-white mb-2">1. Chimchilang (Pinch)</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Bosh barmoq va ko‘rsatkich barmog‘ingizni bir-biriga yaqinlashtiring. Kabel ulagichi (connector) yaqinida chimchilasangiz, u qo‘lingizga ushlanadi.
            </p>
          </div>

          {/* Step 2: Drag */}
          <div className="rounded-2xl bg-[#0c162c] border border-[#1e325c] p-6 hover:border-blue-500/60 transition-all hover:shadow-card-glow group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-blue-400 mb-1">02-QADAM</div>
            <h3 className="text-xl font-bold text-white mb-2">2. Harakatlantiring (Drag)</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Qo‘lingizni ekranda chapga, o‘ngga, yuqoriga yoki pastga siljiting. 3D kabel mos ravishda egilib, sizning harakatingiz bo‘yicha terminal tomon siljiydi.
            </p>
          </div>

          {/* Step 3: Release */}
          <div className="rounded-2xl bg-[#0c162c] border border-[#1e325c] p-6 hover:border-emerald-500/60 transition-all hover:shadow-card-glow group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-400 mb-1">03-QADAM</div>
            <h3 className="text-xl font-bold text-white mb-2">3. Qo‘yib yuboring (Snap)</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Kabelni kerakli port ustiga olib kelib, barmoqlaringizni oching. Kabel to‘g‘ri portga aniq ulanadi va zanjir ishga tushadi!
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Notice Section */}
      <section id="privacy" className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-[#1e325c]/50">
        <div className="rounded-3xl bg-[#0c162c]/90 border border-emerald-500/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Kamera Maxfiyligi Kafolati
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  ElectroHand sizning shaxsiy xavfsizligingizni to‘liq hurmat qiladi. Veb-kamera tasvirlari 
                  faqat qurilmangizdagi brauzer ichida MediaPipe sun’iy intellekt modeli yordamida tahlil qilinadi.
                  Hech qanday fotosurat yoki video yozuv serverlarga yuborilmaydi va saqlanmaydi.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={onStart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-neon-green transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Kamerani yoqish va boshlash</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1e325c]/60 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 ElectroHand. 3D Elektr Zanjirlari Simulyatori. Barcha huquqlar himoyalangan.</p>
        <p className="mt-1 text-slate-600 font-mono">
          Three.js • MediaPipe Tasks Vision • WebRTC • Web Audio API
        </p>
      </footer>
    </div>
  );
};
