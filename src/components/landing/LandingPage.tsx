import React from 'react';
import { HeroSection } from './HeroSection';
import { AvatarShowcase } from './AvatarShowcase';
import { FeatureShowcase } from './FeatureShowcase';
import { SocialImpactSection } from './SocialImpactSection';
import { AppModule } from '../../types';

interface LandingPageProps {
  onStartApp: () => void;
  onSelectModule: (module: AppModule) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartApp,
  onSelectModule
}) => {
  const handleScrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col">
      <HeroSection
        onStartApp={onStartApp}
        onExploreFeatures={handleScrollToFeatures}
      />

      <AvatarShowcase
        onOpenAssistant={() => {
          onStartApp();
          onSelectModule('signassistant');
        }}
      />

      <FeatureShowcase
        onSelectModule={(mod) => {
          onStartApp();
          onSelectModule(mod);
        }}
      />

      <SocialImpactSection onStartApp={onStartApp} />
    </div>
  );
};
