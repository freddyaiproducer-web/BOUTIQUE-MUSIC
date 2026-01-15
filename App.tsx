
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import ArtistScreen from './screens/ArtistScreen';
import CampaignScreen from './screens/CampaignScreen';
import RewardsScreen from './screens/RewardsScreen';
import PresaleScreen from './screens/PresaleScreen';
import BuyTokensScreen from './screens/BuyTokensScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import FinanceScreen from './screens/FinanceScreen';
import { DiscoverIcon, CampaignIcon, TrophyIcon, PlusCircleIcon, LineChartIcon } from './components/Icons';
import { Screen } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import NowPlayingBar from './components/NowPlayingBar';

const Header: React.FC = () => {
    const { user, navigateTo, currentScreen } = useAppContext();
    if (!user.isActivated || currentScreen === 'discover') return null;
    return (
        <header className="sticky top-0 bg-brand-surface p-4 flex justify-between items-center z-20">
            <h1 className="text-xl font-bold text-brand-text-primary">Boutique Music</h1>
            <div className="text-right flex items-center gap-3">
                <div>
                    <p className="text-sm text-brand-text-secondary">Tokens</p>
                    <p className="font-bold text-lg text-brand-primary">{user.tokenBalance}</p>
                </div>
                <button onClick={() => navigateTo('buyTokens')} className="text-brand-primary hover:opacity-80">
                    <PlusCircleIcon className="w-8 h-8"/>
                </button>
            </div>
        </header>
    );
};

const BottomNav: React.FC = () => {
    const { currentScreen, navigateTo, user } = useAppContext();
    const hasInvestment = Object.keys(user.investments).length > 0;

    const navItems = [
        { name: 'Discover', screen: 'discover' as Screen, icon: DiscoverIcon },
        { name: 'Finance', screen: 'finance' as Screen, icon: LineChartIcon, disabled: !hasInvestment },
        { name: 'Campaign', screen: 'campaign' as Screen, icon: CampaignIcon, disabled: !hasInvestment },
        { name: 'Rewards', screen: 'rewards' as Screen, icon: TrophyIcon, disabled: !hasInvestment },
    ];
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface z-20">
            <div className="flex justify-around">
                {navItems.map(item => (
                     <button
                        key={item.name}
                        onClick={() => !item.disabled && navigateTo(item.screen)}
                        disabled={item.disabled}
                        className={`flex flex-col items-center p-2 w-full transition-colors ${item.disabled ? 'text-gray-600' : currentScreen === item.screen ? 'text-brand-primary' : 'text-brand-text-secondary hover:text-brand-primary'}`}
                    >
                        <item.icon className="w-7 h-7 mb-1" />
                        <span className="text-xs">{item.name}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

const AppContent: React.FC = () => {
  const { currentScreen, user } = useAppContext();

  if (!user.isActivated) {
    return <OnboardingScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'discover':
        return <DiscoverScreen />;
      case 'artist':
        return <ArtistScreen />;
      case 'campaign':
        return <CampaignScreen />;
      case 'rewards':
        return <RewardsScreen />;
      case 'presale':
        return <PresaleScreen />;
      case 'buyTokens':
        return <BuyTokensScreen />;
      case 'finance':
        return <FinanceScreen />;
      default:
        return <DiscoverScreen />;
    }
  };
  
  const showLayout = currentScreen !== 'discover';
  const hasInvestments = Object.keys(user.investments).length > 0;
  const showPlayer = showLayout && hasInvestments;
  const mainPaddingBottom = showPlayer ? 'pb-36' : 'pb-20';

  return (
    <div className="min-h-screen bg-brand-bg">
        {showLayout && <Header/>}
        <main className={`flex-grow ${showLayout ? mainPaddingBottom : ''}`}>
            {renderScreen()}
        </main>
        {showPlayer && <NowPlayingBar />}
        {showLayout && <BottomNav/>}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;