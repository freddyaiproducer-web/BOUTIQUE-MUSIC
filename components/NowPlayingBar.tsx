
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PauseIcon, PlayIcon } from './Icons';

const NowPlayingBar: React.FC = () => {
    const { artists, user, currentPlayingReleaseId, isPlaylistPlaying, togglePlaylist } = useAppContext();

    const investedReleases = artists
        .flatMap(artist => artist.releases.map(release => ({ ...release, artistName: artist.name })))
        .filter(release => (user.investments[release.id] || 0) > 0);
    
    if (investedReleases.length === 0) {
        return null;
    }

    const releaseToShowId = currentPlayingReleaseId ?? investedReleases[0]?.id;
    const releaseToShow = investedReleases.find(r => r.id === releaseToShowId);
    
    if (!releaseToShow) {
        return null;
    }

    return (
        <div className="fixed bottom-16 left-0 right-0 bg-brand-surface/90 backdrop-blur-sm z-10 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <div className="flex items-center justify-between p-2 max-w-screen-xl mx-auto">
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={releaseToShow.coverImage} alt={releaseToShow.title} className="w-12 h-12 rounded-md object-cover" />
                    <div className="overflow-hidden">
                        <p className="font-bold text-sm truncate text-brand-text-primary">{releaseToShow.title}</p>
                        <p className="text-xs truncate text-brand-text-secondary">{releaseToShow.artistName}</p>
                    </div>
                </div>
                <button
                    onClick={togglePlaylist}
                    className="p-2 rounded-full bg-brand-primary text-black flex-shrink-0"
                    aria-label={isPlaylistPlaying ? 'Pause Playlist' : 'Play Playlist'}
                >
                    {isPlaylistPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                </button>
            </div>
        </div>
    );
};

export default NowPlayingBar;