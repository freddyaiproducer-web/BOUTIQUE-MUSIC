
import React from 'react';
import { useAppContext } from '../context/AppContext';

const OnboardingScreen: React.FC = () => {
  const { activateAccount } = useAppContext();

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 text-center">
      
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-brand-text-primary mb-4 animate-fade-in-up">Boutique Music</h1>
        <p className="text-lg text-brand-text-secondary mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          The future of music is in your hands.
          <br /> 
          Discover, invest, and grow with emerging artists.
        </p>
      </div>

      <button
        onClick={activateAccount}
        className="bg-brand-primary text-black font-bold py-4 px-10 rounded-full text-lg hover:opacity-90 transition-opacity animate-fade-in-up"
        style={{animationDelay: '0.4s'}}
      >
        Discover Artists
      </button>

    </div>
  );
};

export default OnboardingScreen;