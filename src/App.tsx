import React, { useState, useEffect } from 'react';
import { NavPage, AppModule } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AppOverviewView } from './components/modules/AppOverviewView';
import { DarsKoprikView } from './components/modules/DarsKoprik/DarsKoprikView';
import { ImoLabView } from './components/modules/ImoLab/ImoLabView';
import { OilaSignView } from './components/modules/OilaSign/OilaSignView';
import { SignAssistantView } from './components/modules/SignAssistant/SignAssistantView';
import { TeacherDashboardView } from './components/modules/TeacherDashboard/TeacherDashboardView';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('landing');
  const [currentModule, setCurrentModule] = useState<AppModule>('overview');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [fontSizeLarge, setFontSizeLarge] = useState<boolean>(false);

  // Scroll to top on page/module switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, currentModule]);

  const handleStartApp = () => {
    setCurrentPage('app');
    setCurrentModule('overview');
  };

  const handleSelectModule = (mod: AppModule) => {
    setCurrentPage('app');
    setCurrentModule(mod);
  };

  const handleNavigateToAssistantWithWord = (word?: string) => {
    setCurrentPage('app');
    setCurrentModule('signassistant');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isHighContrast
          ? 'bg-stone-900 text-stone-100'
          : 'bg-surdo-cream text-surdo-darkest'
      } ${fontSizeLarge ? 'text-lg' : 'text-base'}`}
    >
      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        currentModule={currentModule}
        onNavigatePage={setCurrentPage}
        onSelectModule={handleSelectModule}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        fontSizeLarge={fontSizeLarge}
        onToggleFontSize={() => setFontSizeLarge(!fontSizeLarge)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'landing' ? (
          <LandingPage
            onStartApp={handleStartApp}
            onSelectModule={handleSelectModule}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {currentModule === 'overview' && (
              <AppOverviewView
                onSelectModule={handleSelectModule}
                onNavigateToAssistantWithWord={handleNavigateToAssistantWithWord}
              />
            )}
            {currentModule === 'darskoprik' && <DarsKoprikView />}
            {currentModule === 'imolab' && (
              <ImoLabView onNavigateToAssistant={handleNavigateToAssistantWithWord} />
            )}
            {currentModule === 'oilasign' && <OilaSignView />}
            {currentModule === 'signassistant' && <SignAssistantView />}
            {currentModule === 'teacher' && <TeacherDashboardView />}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectModule={handleSelectModule} />
    </div>
  );
};

export default App;
