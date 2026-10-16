import React, { useState } from 'react';
import { Menu, X, ArrowRight, Eye, Sparkles, BookOpen, Search, Heart, GraduationCap, Home, Camera } from 'lucide-react';
import { NavPage, AppModule } from '../../types';

interface NavbarProps {
  currentPage: NavPage;
  currentModule: AppModule;
  onNavigatePage: (page: NavPage) => void;
  onSelectModule: (module: AppModule) => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  fontSizeLarge: boolean;
  onToggleFontSize: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  currentModule,
  onNavigatePage,
  onSelectModule,
  isHighContrast,
  onToggleHighContrast,
  fontSizeLarge,
  onToggleFontSize
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const modulesList: { id: AppModule; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Boshqaruv', icon: <Home className="w-4 h-4" /> },
    { id: 'darskoprik', label: 'DarsKo‘prik', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'imolab', label: 'ImoLab', icon: <Search className="w-4 h-4" /> },
    { id: 'oilasign', label: 'OilaSign', icon: <Heart className="w-4 h-4" /> },
    { id: 'signassistant', label: 'AI Yordamchi', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'camera', label: 'Imo-Kamera', icon: <Camera className="w-4 h-4" /> },
    { id: 'teacher', label: 'O‘qituvchi', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surdo-cream/95 backdrop-blur-md border-b border-surdo-beige/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Wordmark */}
          <button
            onClick={() => {
              if (currentPage === 'app') {
                onSelectModule('overview');
              } else {
                onNavigatePage('landing');
              }
            }}
            className="flex items-center gap-3 group text-left"
            aria-label="SURDO AI bosh sahifasiga o‘tish"
          >
            <div className="w-10 h-10 rounded-2xl bg-surdo-forest text-surdo-cream flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-surdo-green transition-colors">
              🤲
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-surdo-forest font-display">
                  SURDO
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-surdo-green text-surdo-cream font-bold tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-surdo-brown font-semibold tracking-wider uppercase hidden sm:block">
                Inklyuziv Ta’lim & Imo-ishora
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          {currentPage === 'landing' ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-surdo-darkest">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-surdo-forest transition-colors"
              >
                Bosh sahifa
              </button>
              <a
                href="#features-section"
                className="hover:text-surdo-forest transition-colors"
              >
                Imkoniyatlar
              </a>
              <button
                onClick={() => {
                  onNavigatePage('app');
                  onSelectModule('signassistant');
                }}
                className="hover:text-surdo-forest transition-colors"
              >
                AI Avatarlar
              </button>
              <button
                onClick={() => {
                  onNavigatePage('app');
                  onSelectModule('camera');
                }}
                className="hover:text-surdo-forest transition-colors flex items-center gap-1 text-emerald-800"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kamera Tahlili</span>
              </button>
              <button
                onClick={() => {
                  onNavigatePage('app');
                  onSelectModule('darskoprik');
                }}
                className="hover:text-surdo-forest transition-colors"
              >
                DarsKo‘prik
              </button>
              <button
                onClick={() => {
                  onNavigatePage('app');
                  onSelectModule('oilasign');
                }}
                className="hover:text-surdo-forest transition-colors"
              >
                OilaSign
              </button>
            </nav>
          ) : (
            /* Main App Module Tabs */
            <nav className="hidden lg:flex items-center gap-1 bg-surdo-sand/70 p-1 rounded-2xl border border-surdo-beige">
              {modulesList.map((m) => {
                const isActive = currentModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectModule(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-surdo-forest text-surdo-cream shadow-sm'
                        : 'text-surdo-darkest hover:text-surdo-forest hover:bg-white/60'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Buttons & Accessibility Toolbar */}
          <div className="flex items-center gap-3">
            {/* Accessibility: Font Size Toggle */}
            <button
              onClick={onToggleFontSize}
              className={`p-2 rounded-xl border border-surdo-beige text-xs font-bold transition-colors ${
                fontSizeLarge
                  ? 'bg-surdo-forest text-surdo-cream border-surdo-forest'
                  : 'bg-white text-surdo-forest hover:bg-surdo-sand'
              }`}
              title="Shrift o‘lchamini kattalashtirish (A+)"
              aria-label="Shrift o‘lchamini kattalashtirish"
            >
              A{fontSizeLarge ? '−' : '+'}
            </button>

            {/* Accessibility: Contrast Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`p-2 rounded-xl border border-surdo-beige text-xs font-bold transition-colors ${
                isHighContrast
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-surdo-forest hover:bg-surdo-sand'
              }`}
              title="Yuqori kontrast rejimi"
              aria-label="Yuqori kontrast rejimi"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Main Action Button */}
            {currentPage === 'landing' ? (
              <button
                onClick={() => {
                  onNavigatePage('app');
                  onSelectModule('overview');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-surdo-forest hover:bg-surdo-green text-surdo-cream font-bold text-sm shadow-sm transition-all"
              >
                <span>Boshlash</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onNavigatePage('landing')}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-surdo-sand text-surdo-forest border border-surdo-beige font-bold text-xs transition-colors"
                title="Bosh sahifaga qaytish"
              >
                <span>Saytga qaytish</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-surdo-forest hover:bg-surdo-sand rounded-xl lg:hidden transition-colors"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-surdo-beige/80 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {currentPage === 'landing' ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onNavigatePage('app');
                    onSelectModule('overview');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-surdo-forest text-surdo-cream font-bold text-sm flex items-center justify-between"
                >
                  <span>Boshlash (Ilovaga kirish)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#features-section"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-surdo-sand text-sm font-semibold text-surdo-darkest block"
                >
                  Imkoniyatlar
                </a>
                <button
                  onClick={() => {
                    onNavigatePage('app');
                    onSelectModule('camera');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-surdo-sand text-sm font-semibold text-emerald-800 text-left flex items-center gap-2"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Kamera orqali aniqlash</span>
                </button>
                <button
                  onClick={() => {
                    onNavigatePage('app');
                    onSelectModule('signassistant');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-surdo-sand text-sm font-semibold text-surdo-darkest text-left"
                >
                  AI Sign Assistant
                </button>
                <button
                  onClick={() => {
                    onNavigatePage('app');
                    onSelectModule('darskoprik');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-surdo-sand text-sm font-semibold text-surdo-darkest text-left"
                >
                  DarsKo‘prik
                </button>
                <button
                  onClick={() => {
                    onNavigatePage('app');
                    onSelectModule('imolab');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-surdo-sand text-sm font-semibold text-surdo-darkest text-left"
                >
                  ImoLab Lug‘at
                </button>
                <button
                  onClick={() => {
                    onNavigatePage('app');
                    onSelectModule('oilasign');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl hover:bg-surdo-sand text-sm font-semibold text-surdo-darkest text-left"
                >
                  OilaSign
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {modulesList.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModule(m.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all text-left ${
                      currentModule === m.id
                        ? 'bg-surdo-forest text-surdo-cream'
                        : 'hover:bg-surdo-sand text-surdo-darkest'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
                <div className="pt-2 border-t border-surdo-beige">
                  <button
                    onClick={() => {
                      onNavigatePage('landing');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center p-2.5 rounded-xl bg-white border border-surdo-beige text-xs font-bold text-surdo-forest"
                  >
                    Bosh sahifaga qaytish
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
