
export interface ReleaseVersion {
  id: string;
  name: string;
  url: string; // Placeholder for demo
  votes: number;
}

export interface Release {
  id: number;
  title: string;
  coverImage: string;
  monthlyGoal: number;
  currentPlays: number;
  tokenValue: number;
  initialTokenValue: number;
  valueHistory: { time: number; value: number }[];
  versions?: {
    A: ReleaseVersion;
    B: ReleaseVersion;
  };
}

export interface Artist {
  id: number;
  name: string;
  genre: string;
  coverImage: string;
  audioPreviewUrl?: string; // NEW: Link for background music
  estimatedROI: number; // Artist-level aggregate or average
  ranking: number;
  instagramHandle: string;
  presentationVideoUrl: string; // YouTube embed URL
  socialLinks: {
    spotify: string;
    youtube: string;
    tiktok: string;
  };
  releases: Release[];
}

export interface Fan {
  id: number;
  name: string;
  plays: number;
  shares: number;
  avatar: string;
}

export interface User {
  name:string;
  isActivated: boolean;
  tokenBalance: number;
  investments: Record<number, number>; // Release ID -> token count
  contribution: Record<number, number>; // Release ID -> number of plays
  votes: Record<number, 'A' | 'B'>; // Release ID -> choice
}

export interface PresaleState {
  sold: number;
  total: number;
}

export type Screen = 'onboarding' | 'discover' | 'artist' | 'campaign' | 'rewards' | 'presale' | 'buyTokens' | 'finance';

export interface AppContextType {
  user: User;
  artists: Artist[];
  currentScreen: Screen;
  selectedArtistId: number | null;
  investInRelease: (releaseId: number) => boolean;
  navigateTo: (screen: Screen, artistId?: number) => void;
  simulatePlay: (releaseId: number) => void;
  presaleState: PresaleState;
  reservePresaleToken: () => void;
  buyTokens: (amount: number) => void;
  activateAccount: () => void;
  voteForVersion: (releaseId: number, version: 'A' | 'B') => void;
  isPlaylistPlaying: boolean;
  togglePlaylist: () => void;
  currentPlayingReleaseId: number | null;
  // NEW: Audio control states
  isMuted: boolean;
  toggleMute: () => void;
}
