
import React from 'react';
import { useAppContext } from '../context/AppContext';
import LineChart from '../components/LineChart';
import { Release } from '../types';

interface InvestedRelease extends Release {
  artistName: string;
}

const AssetCard: React.FC<{ release: InvestedRelease }> = ({ release }) => {
  const { user } = useAppContext();
  const tokensOwned = user.investments[release.id] || 0;
  if (tokensOwned === 0) return null;

  const initialCost = tokensOwned * release.initialTokenValue;
  const currentValue = tokensOwned * release.tokenValue;
  const profitLoss = currentValue - initialCost;
  const profitLossPercent = initialCost > 0 ? (profitLoss / initialCost) * 100 : 0;
  
  const isProfit = profitLoss >= 0;

  return (
    <div className="bg-brand-surface rounded-lg p-4 animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
            <img src={release.coverImage} alt={release.title} className="w-12 h-12 rounded-md object-cover" />
            <div>
              <p className="font-bold">{release.title}</p>
              <p className="text-sm text-brand-text-secondary">{release.artistName}</p>
            </div>
        </div>
        <div className="w-24 h-10">
            <LineChart data={release.valueHistory} color={isProfit ? '#1DB954' : '#EF4444'} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
              <p className="text-xs text-brand-text-secondary">Tokens</p>
              <p className="font-semibold">{tokensOwned}</p>
          </div>
          <div>
              <p className="text-xs text-brand-text-secondary">Value</p>
              <p className="font-semibold">${currentValue.toFixed(2)}</p>
          </div>
          <div>
              <p className="text-xs text-brand-text-secondary">P/L</p>
              <p className={`font-semibold ${isProfit ? 'text-brand-primary' : 'text-red-500'}`}>
                {isProfit ? '+' : ''}${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(1)}%)
              </p>
          </div>
      </div>
    </div>
  );
};


const FinanceScreen: React.FC = () => {
    const { user, artists, navigateTo } = useAppContext();

    const investedReleases: InvestedRelease[] = artists
        .flatMap(artist => artist.releases.map(release => ({ ...release, artistName: artist.name })))
        .filter(release => (user.investments[release.id] || 0) > 0);

    const totalInitialCost = investedReleases.reduce((sum, release) => {
        const tokensOwned = user.investments[release.id] || 0;
        return sum + (tokensOwned * release.initialTokenValue);
    }, 0);

    const totalCurrentValue = investedReleases.reduce((sum, release) => {
        const tokensOwned = user.investments[release.id] || 0;
        return sum + (tokensOwned * release.tokenValue);
    }, 0);

    const totalProfitLoss = totalCurrentValue - totalInitialCost;
    const totalProfitLossPercent = totalInitialCost > 0 ? (totalProfitLoss / totalInitialCost) * 100 : 0;
    const isTotalProfit = totalProfitLoss >= 0;

    if (investedReleases.length === 0) {
        return (
            <div className="p-6 text-center h-full flex flex-col justify-center items-center min-h-[80vh]">
                <h2 className="text-2xl font-bold mb-4">No Investments Yet</h2>
                <p className="text-brand-text-secondary mb-6 max-w-xs">Your financial portfolio will appear here once you invest in an artist's release.</p>
                <button onClick={() => navigateTo('discover')} className="bg-brand-primary text-black font-bold py-2 px-6 rounded-lg">
                    Discover Artists
                </button>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
            
            <div className="bg-brand-surface rounded-lg p-4 mb-6 animate-fade-in-up">
                <p className="text-sm text-brand-text-secondary">Total Balance</p>
                <p className="text-4xl font-bold">${totalCurrentValue.toFixed(2)}</p>
                <p className={`font-semibold mt-1 ${isTotalProfit ? 'text-brand-primary' : 'text-red-500'}`}>
                    {isTotalProfit ? '+' : ''}${totalProfitLoss.toFixed(2)} ({totalProfitLossPercent.toFixed(1)}%) All Time
                </p>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Your Assets</h3>
            <div className="space-y-4">
                {investedReleases.map(release => (
                    <AssetCard key={release.id} release={release} />
                ))}
            </div>
        </div>
    );
};

export default FinanceScreen;