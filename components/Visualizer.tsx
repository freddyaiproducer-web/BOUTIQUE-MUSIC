
import React from 'react';

const Visualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="flex items-end gap-[2px] h-4 w-6">
      <div className={`w-[3px] bg-brand-primary rounded-full transition-all duration-300 ${isPlaying ? 'animate-[music-bar_0.6s_ease-in-out_infinite]' : 'h-1'}`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`w-[3px] bg-brand-primary rounded-full transition-all duration-300 ${isPlaying ? 'animate-[music-bar_0.8s_ease-in-out_infinite]' : 'h-2'}`} style={{ animationDelay: '0.3s' }}></div>
      <div className={`w-[3px] bg-brand-primary rounded-full transition-all duration-300 ${isPlaying ? 'animate-[music-bar_0.5s_ease-in-out_infinite]' : 'h-1.5'}`} style={{ animationDelay: '0.5s' }}></div>
      <div className={`w-[3px] bg-brand-primary rounded-full transition-all duration-300 ${isPlaying ? 'animate-[music-bar_0.7s_ease-in-out_infinite]' : 'h-2.5'}`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

export default Visualizer;
