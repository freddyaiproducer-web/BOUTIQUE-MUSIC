
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { AppContextType, User, Artist, Screen, PresaleState, Release } from '../types';
import { ARTISTS_DATA, INITIAL_DEPOSIT_USD } from '../constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: 'Guest',
    isActivated: false,
    tokenBalance: 0,
    investments: {},
    contribution: {},
    votes: {},
  });
  
  const [artists, setArtists] = useState<Artist[]>(ARTISTS_DATA);
  const [currentScreen, setCurrentScreen] = useState<Screen>('discover');
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);

  const [presaleState, setPresaleState] = useState<PresaleState>({
    sold: 7,
    total: 25,
  });

  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(false);
  const [currentPlayingReleaseId, setCurrentPlayingReleaseId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for better UX on first load

  const currentPlayingIndexRef = useRef(0);

  const navigateTo = useCallback((screen: Screen, artistId?: number) => {
    setCurrentScreen(screen);
    if (artistId !== undefined) {
      setSelectedArtistId(artistId);
    }
  }, []);
  
  const simulatePlay = useCallback((releaseId: number) => {
      setUser(prevUser => ({
          ...prevUser,
          contribution: {
              ...prevUser.contribution,
              [releaseId]: (prevUser.contribution[releaseId] || 0) + 1,
          }
      }));
      setArtists(prevArtists => prevArtists.map(artist => ({
        ...artist,
        releases: artist.releases.map(release => 
          release.id === releaseId && release.currentPlays < release.monthlyGoal
            ? { ...release, currentPlays: release.currentPlays + 1 }
            : release
        )
      })));
  }, []);

  const investInRelease = useCallback((releaseId: number): boolean => {
    if (user.tokenBalance > 0) {
      setUser(prevUser => {
        const currentInvestedAmount = prevUser.investments[releaseId] || 0;
        return {
          ...prevUser,
          tokenBalance: prevUser.tokenBalance - 1,
          investments: {
            ...prevUser.investments,
            [releaseId]: currentInvestedAmount + 1,
          },
          contribution: currentInvestedAmount === 0 
            ? { ...prevUser.contribution, [releaseId]: 0 }
            : prevUser.contribution,
        };
      });
      return true;
    }
    return false;
  }, [user.tokenBalance]);

  const reservePresaleToken = useCallback(() => {
    setPresaleState(prevState => ({
      ...prevState,
      sold: prevState.sold < prevState.total ? prevState.sold + 1 : prevState.sold,
    }));
  }, []);

  const buyTokens = useCallback((amount: number) => {
    setUser(prevUser => ({
      ...prevUser,
      tokenBalance: prevUser.tokenBalance + amount,
    }));
  }, []);

  const activateAccount = useCallback(() => {
    setUser(prevUser => ({
      ...prevUser,
      isActivated: true,
      tokenBalance: 0,
    }));
  }, []);

  const voteForVersion = useCallback((releaseId: number, version: 'A' | 'B') => {
    setUser(prev => ({
        ...prev,
        votes: { ...prev.votes, [releaseId]: version }
    }));
    setArtists(prev => prev.map(artist => ({
        ...artist,
        releases: artist.releases.map(rel => {
            if (rel.id === releaseId && rel.versions) {
                return {
                    ...rel,
                    versions: {
                        ...rel.versions,
                        [version]: {
                            ...rel.versions[version],
                            votes: rel.versions[version].votes + 1
                        }
                    }
                };
            }
            return rel;
        })
    })));
  }, []);

  const togglePlaylist = useCallback(() => {
    if (!isPlaylistPlaying) {
        const investedReleaseIds = Object.keys(user.investments).map(Number).filter(id => user.investments[id] > 0);
        if (investedReleaseIds.length > 0 && currentPlayingReleaseId === null) {
            const firstReleaseId = investedReleaseIds[0];
            setCurrentPlayingReleaseId(firstReleaseId);
        }
    }
    setIsPlaylistPlaying(prev => !prev);
  }, [isPlaylistPlaying, user.investments, currentPlayingReleaseId]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    const investedReleaseIds = Object.keys(user.investments).map(Number).filter(id => user.investments[id] > 0);
    const investedReleases = artists.flatMap(artist => 
        artist.releases.filter(release => investedReleaseIds.includes(release.id))
    );

    if (isPlaylistPlaying && investedReleases.length > 0) {
      if (currentPlayingIndexRef.current >= investedReleases.length) {
          currentPlayingIndexRef.current = 0;
      }
      
      interval = window.setInterval(() => {
        const releaseToPlay = investedReleases[currentPlayingIndexRef.current];
        if (releaseToPlay) {
            simulatePlay(releaseToPlay.id);
            setCurrentPlayingReleaseId(releaseToPlay.id);
            currentPlayingIndexRef.current = (currentPlayingIndexRef.current + 1) % investedReleases.length;
        }
      }, 2000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isPlaylistPlaying, user.investments, artists, simulatePlay]);

  const value: AppContextType = {
    user,
    artists,
    currentScreen,
    selectedArtistId,
    investInRelease,
    navigateTo,
    simulatePlay,
    presaleState,
    reservePresaleToken,
    buyTokens,
    activateAccount,
    voteForVersion,
    isPlaylistPlaying,
    togglePlaylist,
    currentPlayingReleaseId,
    isMuted,
    toggleMute,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
