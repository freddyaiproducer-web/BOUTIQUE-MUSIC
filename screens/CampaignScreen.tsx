
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FANS_DATA } from '../constants';
import { PlayIcon } from '../components/Icons';
import { Fan } from '../types';

const Leaderboard: React.FC<{ fans: Fan[] }> = ({ fans }) => (
    <div className="bg-brand-surface rounded-lg p-4">
        <h3 className="text-xl font-bold mb-4">Monthly Ranking</h3>
        <ul className="space-y-3">
            {fans.slice(0, 10).map((fan, index) => (
                <li key={fan.id} className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-center">
                        <span className="text-lg font-semibold w-8 text-brand-text-secondary">{index + 1}</span>
                        <img src={fan.avatar} alt={fan.name} className="w-10 h-10 rounded-full mr-3" />
                        <span className="font-semibold">{fan.name}</span>
                    </div>
                    <span className="font-bold text-brand-primary">{fan.plays.toLocaleString()} plays</span>
                </li>
            ))}
        </ul>
    </div>
);


const CampaignScreen: React.FC = () => {
    const { artists, user, navigateTo, isPlaylistPlaying, togglePlaylist, currentPlayingReleaseId } = useAppContext();
    const [selectedReleaseId, setSelectedReleaseId] = useState<number | null>(null);

    const investedReleaseIds = Object.keys(user.investments).map(Number);
  
    const investedReleases = artists.flatMap(artist => 
      artist.releases.filter(release => investedReleaseIds.includes(release.id))
        .map(release => ({ ...release, artistName: artist.name }))
    );
    
    const activeRelease = investedReleases.find(r => r.id === selectedReleaseId) || investedReleases[0];

    if (investedReleases.length === 0) {
        return (
            <div className="p-6 text-center h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">No Active Campaign</h2>
                <p className="text-brand-text-secondary mb-6">Invest in an artist's release to join their campaign!</p>
                <button onClick={() => navigateTo('discover')} className="bg-brand-primary text-black font-bold py-2 px-6 rounded-lg">
                    Discover Artists
                </button>
            </div>
        );
    }
    
    if (!activeRelease) {
        return <div className="p-4 text-center">Loading campaign...</div>
    }
    
    const goalPercentage = (activeRelease.currentPlays / activeRelease.monthlyGoal) * 100;

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-3xl font-bold text-center">Campaigns</h2>
            
            {investedReleases.length > 1 && (
                 <div className="mb-4">
                    <label htmlFor="campaign-select" className="block text-sm font-medium text-brand-text-secondary mb-1">Inspect Campaign</label>
                    <select 
                        id="campaign-select"
                        value={selectedReleaseId || activeRelease.id}
                        onChange={(e) => setSelectedReleaseId(Number(e.target.value))}
                        className="bg-brand-surface border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
                    >
                        {investedReleases.map(release => (
                        <option key={release.id} value={release.id}>
                            {release.title} - {release.artistName}
                        </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="bg-brand-surface rounded-lg p-4 text-center">
                <p className="text-lg text-brand-text-secondary">Global Goal for "{activeRelease.title}"</p>
                <p className="text-4xl font-bold text-brand-primary my-2">{activeRelease.monthlyGoal.toLocaleString()} plays</p>
                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-brand-primary h-4 rounded-full transition-all duration-500" style={{ width: `${goalPercentage}%` }}></div>
                </div>
                <p className="mt-2 text-sm">{activeRelease.currentPlays.toLocaleString()} plays ({goalPercentage.toFixed(1)}%)</p>
            </div>

            <div className="bg-brand-surface rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Your Active Playlist</h3>
                    <button 
                        onClick={togglePlaylist}
                        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-colors ${isPlaylistPlaying ? 'bg-red-600 text-white' : 'bg-brand-primary text-black'}`}
                    >
                        <PlayIcon className="w-5 h-5"/>
                        {isPlaylistPlaying ? 'Stop' : 'Play'}
                    </button>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {investedReleases.map((release) => (
                        <div 
                            key={release.id} 
                            className={`p-2 rounded-md transition-all ${currentPlayingReleaseId === release.id ? 'bg-brand-primary/20' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{release.title}</p>
                                    <p className="text-sm text-brand-text-secondary">{release.artistName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-brand-primary">{(user.contribution[release.id] || 0).toLocaleString()}</p>
                                    <p className="text-xs text-brand-text-secondary">plays</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <Leaderboard fans={[...FANS_DATA].sort((a, b) => b.plays - a.plays)} />
        </div>
    );
};

export default CampaignScreen;