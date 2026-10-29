import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { SimulatorView } from './SimulatorView';

export const ElectroHandApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'simulator'>('landing');

  return (
    <div className="w-full min-h-screen bg-[#070d19] text-slate-100 font-sans">
      {currentView === 'landing' ? (
        <LandingPage onStart={() => setCurrentView('simulator')} />
      ) : (
        <SimulatorView onBackToLanding={() => setCurrentView('landing')} />
      )}
    </div>
  );
};

export default ElectroHandApp;
