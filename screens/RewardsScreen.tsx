
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Release } from '../types';

interface RewardRelease extends Release {
    artistName: string;
}

const RewardItemCard: React.FC<{ release: RewardRelease }> = ({ release }) => {
    const percentageIncrease = ((release.tokenValue - release.initialTokenValue) / release.initialTokenValue) * 100;
    return (
        <div className="bg-brand-surface rounded-lg p-4 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-4">
                <img src={release.coverImage} alt={release.title} className="w-12 h-12 rounded-md object-cover" />
                <div>
                    <p className="font-bold">{release.title}</p>
                    <p className="text-sm text-brand-text-secondary">Token Value</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold">${release.tokenValue}</p>
                <p className="text-sm font-semibold text-brand-primary">+{percentageIncrease.toFixed(0)}%</p>
            </div>
        </div>
    );
};


const RewardsScreen: React.FC = () => {
    const { user, artists, navigateTo } = useAppContext();

    const appreciatedReleases: RewardRelease[] = artists
        .flatMap(artist => artist.releases.map(release => ({ ...release, artistName: artist.name })))
        .filter(release => 
            (user.investments[release.id] || 0) > 0 && release.tokenValue > release.initialTokenValue
        );

    const hasAppreciatedReleases = appreciatedReleases.length > 0;

    if (!hasAppreciatedReleases) {
        return (
            <div className="p-6 text-center h-full flex flex-col justify-center items-center min-h-[80vh]">
                <h2 className="text-2xl font-bold mb-4">No Rewards Yet</h2>
                <p className="text-brand-text-secondary max-w-xs">Your token values will appear here once they grow. Keep supporting your artists' releases!</p>
            </div>
        );
    }

    return (
        <div className="p-4 min-h-[80vh]">
             <div className="w-full max-w-md mx-auto text-center">
                 <img 
                    src="https://firebasestorage.googleapis.com/v0/b/genai-ui.appspot.com/o/2024-05-20T16%3A33%3A19.986Z_treasure.png?alt=media&token=c194d210-e7a2-466a-b44c-3e3c0d8b584a" 
                    alt="Treasure Chest" 
                    className="w-40 h-40 mx-auto -mb-10"
                />
                <h2 className="text-3xl font-bold mb-2">Your Rewards</h2>
                <p className="text-brand-text-secondary mb-6">Congratulations! Some of your investments have grown.</p>
            </div>
            
            <div className="w-full max-w-md mx-auto space-y-4">
                {appreciatedReleases.map(release => (
                    <RewardItemCard key={release.id} release={release} />
                ))}
            </div>

            {hasAppreciatedReleases && (
                 <div className="w-full max-w-md mx-auto mt-8">
                    <button
                        onClick={() => navigateTo('presale')}
                        className="w-full bg-brand-primary text-black font-bold py-3 px-6 rounded-xl text-md hover:opacity-90 transition-transform transform hover:scale-105"
                    >
                        Acceder a preventa del proximo lanzamiento
                    </button>
                 </div>
            )}
        </div>
    );
};

export default RewardsScreen;