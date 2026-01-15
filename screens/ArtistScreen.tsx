
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, InstagramIcon, SpotifyIcon, PlayIcon, Volume2Icon, VolumeXIcon } from '../components/Icons';
import { Release } from '../types';
import Visualizer from '../components/Visualizer';

const ABTestCard: React.FC<{ release: Release }> = ({ release }) => {
    const { user, voteForVersion } = useAppContext();
    if (!release.versions) return null;

    const vA = release.versions.A;
    const vB = release.versions.B;
    const totalVotes = vA.votes + vB.votes;
    const userVote = user.votes[release.id];

    const getPercent = (v: number) => totalVotes === 0 ? 0 : Math.round((v / totalVotes) * 100);

    return (
        <div className="bg-brand-surface rounded-2xl p-6 mb-8 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-black mb-1 text-brand-primary uppercase italic tracking-tighter">🔥 A/B Voting</h3>
            <p className="text-xs text-brand-text-secondary mb-6 font-bold uppercase tracking-widest">Choose the next drop for "{release.title}"</p>
            
            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border-2 transition-all ${userVote === 'A' ? 'border-brand-primary bg-brand-primary/5' : 'border-white/5 bg-black/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Mix A</span>
                        <PlayIcon className="w-4 h-4 text-brand-primary" />
                    </div>
                    <p className="font-bold text-xs mb-4 h-8 overflow-hidden">{vA.name}</p>
                    <div className="text-center">
                        <p className="text-2xl font-black mb-1 italic">{getPercent(vA.votes)}%</p>
                        <button 
                            disabled={!!userVote}
                            onClick={() => voteForVersion(release.id, 'A')}
                            className={`w-full py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${userVote === 'A' ? 'bg-brand-primary text-black' : 'bg-white text-black hover:scale-105 disabled:opacity-50'}`}
                        >
                            {userVote === 'A' ? 'Votado' : 'Votar A'}
                        </button>
                    </div>
                </div>

                <div className={`p-4 rounded-xl border-2 transition-all ${userVote === 'B' ? 'border-brand-primary bg-brand-primary/5' : 'border-white/5 bg-black/20'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Mix B</span>
                        <PlayIcon className="w-4 h-4 text-brand-primary" />
                    </div>
                    <p className="font-bold text-xs mb-4 h-8 overflow-hidden">{vB.name}</p>
                    <div className="text-center">
                        <p className="text-2xl font-black mb-1 italic">{getPercent(vB.votes)}%</p>
                        <button 
                            disabled={!!userVote}
                            onClick={() => voteForVersion(release.id, 'B')}
                            className={`w-full py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest ${userVote === 'B' ? 'bg-brand-primary text-black' : 'bg-white text-black hover:scale-105 disabled:opacity-50'}`}
                        >
                            {userVote === 'B' ? 'Votado' : 'Votar B'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ReleaseCard: React.FC<{ release: Release, artistName: string }> = ({ release, artistName }) => {
  const { user, investInRelease, navigateTo } = useAppContext();
  const goalPercentage = (release.currentPlays / release.monthlyGoal) * 100;
  const investedAmount = user.investments[release.id] || 0;
  
  const handleInvest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.tokenBalance >= 1) {
      investInRelease(release.id);
    } else {
      navigateTo('buyTokens');
    }
  };

  return (
    <div className="bg-brand-surface rounded-2xl p-5 mb-4 border border-white/5 shadow-xl">
      <div className="flex items-center gap-5 mb-4">
        <img src={release.coverImage} alt={release.title} className="w-16 h-16 rounded-xl object-cover shadow-lg" />
        <div className="flex-grow">
          <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none">{release.title}</h3>
          <p className="text-xs text-brand-text-secondary font-bold uppercase tracking-widest mt-1">{artistName}</p>
          <div className="mt-2 text-sm flex items-center gap-3">
             <span className="font-black text-brand-primary">${release.tokenValue} <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold ml-1">Current Value</span></span>
          </div>
        </div>
      </div>

      <div className="bg-black/20 p-3 rounded-xl border border-white/5 mb-4">
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div className="bg-brand-primary h-full shadow-[0_0_10px_rgba(29,185,84,0.4)] transition-all duration-1000" style={{ width: `${goalPercentage}%` }}></div>
        </div>
        <div className="flex justify-between text-[9px] font-black text-white/40 mt-2 uppercase tracking-widest">
          <span>{release.currentPlays.toLocaleString()} / {release.monthlyGoal.toLocaleString()} plays</span>
          <span className="text-brand-primary">{goalPercentage.toFixed(1)}%</span>
        </div>
      </div>

      <button
        onClick={handleInvest}
        className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-brand-primary text-black hover:scale-[1.02] active:scale-95 shadow-lg"
      >
        {investedAmount > 0 ? `Comprar mais Tokens ($${release.initialTokenValue})` : `Adquirir Token ($${release.initialTokenValue})`}
      </button>
      {investedAmount > 0 && <p className="text-center text-[9px] font-bold text-brand-text-secondary mt-2 uppercase tracking-widest">Você possui {investedAmount} tokens deste lançamento</p>}
    </div>
  );
};

const ArtistScreen: React.FC = () => {
    const { artists, selectedArtistId, navigateTo, isMuted, toggleMute } = useAppContext();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const artist = artists.find(a => a.id === selectedArtistId);

    useEffect(() => {
        if (!audioRef.current || !artist?.audioPreviewUrl) return;
        if (!isMuted) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [isMuted, artist]);

    if (!artist) return <div className="p-10 text-center font-bold">Artist loading...</div>;

    const releaseWithVoting = artist.releases.find(r => r.versions);

    return (
        <div className="relative min-h-screen bg-brand-bg pb-32">
            {artist.audioPreviewUrl && (
                <audio ref={audioRef} src={artist.audioPreviewUrl} loop preload="auto" />
            )}

            <div className="fixed top-6 left-6 z-30">
                <button onClick={() => navigateTo('discover')} className="bg-black/60 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-black/80 transition-all">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="fixed top-6 right-6 z-30 flex items-center gap-3">
                {isPlaying && (
                    <div className="bg-black/60 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                        <Visualizer isPlaying={isPlaying} />
                    </div>
                )}
                <button onClick={toggleMute} className="bg-black/60 backdrop-blur-xl rounded-xl p-3 border border-white/10 hover:bg-black/80 transition-all">
                    {isMuted ? <VolumeXIcon className="w-5 h-5" /> : <Volume2Icon className="w-5 h-5" />}
                </button>
            </div>

            <div className="h-[45vh] w-full relative">
                <img src={artist.coverImage} alt={artist.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent"></div>
            </div>

            <div className="px-6 -mt-32 relative z-10">
                <span className="inline-block bg-brand-primary text-black text-[10px] font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest shadow-lg">
                    Ranking #{artist.ranking} Global
                </span>
                {/* TIPOGRAFIA ORIGINAL PROTEGIDA */}
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-[0.85] mb-1">{artist.name}</h1>
                <p className="text-lg font-bold text-brand-text-secondary uppercase tracking-widest mb-8">{artist.genre}</p>
                
                <div className="grid grid-cols-4 gap-3 mb-12">
                    <a href="#" className="bg-brand-surface h-14 rounded-xl flex items-center justify-center border border-white/5 hover:bg-brand-primary hover:text-black transition-all"><InstagramIcon className="w-5 h-5" /></a>
                    <a href="#" className="bg-brand-surface h-14 rounded-xl flex items-center justify-center border border-white/5 hover:bg-brand-primary hover:text-black transition-all"><SpotifyIcon className="w-5 h-5" /></a>
                    <button className="col-span-2 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all">Follow</button>
                </div>

                {releaseWithVoting && <ABTestCard release={releaseWithVoting} />}

                <div className="mb-12">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter mb-4 flex items-center gap-3">
                        <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                        Artist Pitch
                    </h2>
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-brand-surface">
                        <iframe className="w-full h-full" src={artist.presentationVideoUrl} frameBorder="0" allowFullScreen></iframe>
                    </div>
                </div>

                <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                    Drops Disponíveis
                </h2>
                {artist.releases.map(release => (
                    <ReleaseCard key={release.id} release={release} artistName={artist.name} />
                ))}
            </div>
        </div>
    );
};

export default ArtistScreen;
