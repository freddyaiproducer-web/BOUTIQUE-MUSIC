
import React, { useRef, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Artist } from '../types';
import { Volume2Icon, VolumeXIcon, PlayIcon } from '../components/Icons';
import LineChart from '../components/LineChart';
import Visualizer from '../components/Visualizer';

const ArtistSlide: React.FC<{ artist: Artist; isMuted: boolean; hasInteracted: boolean }> = ({ artist, isMuted, hasInteracted }) => {
    const { navigateTo } = useAppContext();
    const slideRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.6, rootMargin: '0px' }
        );
        if (slideRef.current) observer.observe(slideRef.current);
        return () => {
            if (slideRef.current) observer.unobserve(slideRef.current);
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !hasInteracted) return;
        
        const handlePlay = async () => {
            if (isVisible && !isMuted) {
                try {
                    audio.currentTime = 0;
                    await audio.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.error("Autoplay blocked or failed:", err);
                    setIsPlaying(false);
                }
            } else {
                audio.pause();
                setIsPlaying(false);
            }
        };

        handlePlay();
    }, [isVisible, isMuted, hasInteracted]);

    const mainRelease = artist.releases[0];
    const growth = (((mainRelease.tokenValue - mainRelease.initialTokenValue) / mainRelease.initialTokenValue) * 100).toFixed(0);

    return (
        <div ref={slideRef} className="h-screen w-screen snap-start relative flex items-end overflow-hidden bg-black">
            {artist.audioPreviewUrl && (
                <audio 
                    ref={audioRef} 
                    src={artist.audioPreviewUrl} 
                    loop 
                    preload="auto"
                />
            )}
            
            <div className="absolute inset-0 pointer-events-none">
                <img 
                    src={artist.coverImage} 
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isVisible ? 'opacity-80 scale-100' : 'opacity-20 scale-110'}`} 
                    alt={artist.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
            
            <div className={`absolute top-24 left-8 z-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                    <span className="text-brand-primary font-bold text-[11px] uppercase tracking-tighter">ROI Est. {artist.estimatedROI}%</span>
                    <span className="w-[1px] h-3 bg-white/20"></span>
                    <span className="text-white font-bold text-[11px] uppercase tracking-tighter">#{artist.ranking} Global</span>
                </div>
            </div>

            <div className="relative z-10 w-full p-8 pb-28 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        {isPlaying && <Visualizer isPlaying={true} />}
                        <p className="text-brand-text-secondary font-bold uppercase tracking-[0.2em] text-[10px]">{artist.genre}</p>
                    </div>
                    <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.85] mb-6 italic uppercase">
                        {artist.name}
                    </h2>
                     <button
                        onClick={() => navigateTo('artist', artist.id)}
                        className="bg-brand-primary text-black font-black py-4 px-14 rounded-full uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(29,185,84,0.4)]"
                    >
                        Investir Agora
                    </button>
                </div>

                <div className={`flex flex-col items-end transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl w-full max-w-[240px]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[9px] text-white/50 uppercase font-bold tracking-widest">Token Growth</span>
                            <span className="text-xs font-bold text-brand-primary">+{growth}%</span>
                        </div>
                        <div className="h-16 w-full mb-3">
                            <LineChart data={mainRelease.valueHistory} width={190} height={64} color="#1DB954" />
                        </div>
                        <div className="flex justify-between items-end">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Current Value</p>
                            <p className="text-2xl font-black text-white tracking-tighter">${mainRelease.tokenValue}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DiscoverScreen: React.FC = () => {
    const { artists, isMuted, toggleMute } = useAppContext();
    const [hasInteracted, setHasInteracted] = useState(false);

    const handleStart = () => {
        if (!hasInteracted) {
            // Unblock audio context for the browser
            const audio = new Audio();
            audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
            audio.play().then(() => {
                audio.pause();
                setHasInteracted(true);
                if (isMuted) toggleMute();
            }).catch(e => {
                console.error("Audio unlock failed", e);
                setHasInteracted(true); // Proceed anyway
            });
        }
    };

    return (
        <div 
            className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black no-scrollbar relative select-none"
            onClick={handleStart}
        >
            {!hasInteracted && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                    <div className="relative flex flex-col items-center group cursor-pointer transition-all duration-500">
                        <div className="absolute inset-0 bg-brand-primary/10 blur-[150px] rounded-full scale-150 animate-pulse"></div>
                        <div className="w-40 h-40 border border-white/10 rounded-full flex items-center justify-center bg-white/5 shadow-2xl mb-10 group-hover:scale-105 transition-transform">
                             <PlayIcon className="w-14 h-14 text-brand-primary ml-2" />
                        </div>
                        <h2 className="text-white font-black uppercase tracking-[1em] text-xs mb-4 ml-[1em]">Descobrir</h2>
                        <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] animate-pulse">Toque para ouvir</p>
                    </div>
                </div>
            )}

            <div className="fixed top-12 left-10 right-10 z-50 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto">
                    <h1 className="text-white/40 font-bold uppercase tracking-[0.5em] text-[10px]">Boutique</h1>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    className="pointer-events-auto bg-black/40 backdrop-blur-xl p-4 rounded-full border border-white/10 text-white"
                >
                    {isMuted ? <VolumeXIcon className="w-4 h-4 opacity-50" /> : <Volume2Icon className="w-4 h-4 text-brand-primary" />}
                </button>
            </div>

            <div className="h-full w-full">
                {artists.map((artist) => (
                    <ArtistSlide 
                        key={artist.id} 
                        artist={artist} 
                        isMuted={isMuted} 
                        hasInteracted={hasInteracted} 
                    />
                ))}
            </div>
            
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-30 animate-bounce pointer-events-none">
                <div className="w-px h-12 bg-white"></div>
                <span className="text-[8px] text-white uppercase tracking-[0.5em] font-black ml-[0.5em]">Scroll</span>
            </div>
        </div>
    );
};

export default DiscoverScreen;
