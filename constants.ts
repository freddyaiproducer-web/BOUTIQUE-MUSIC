
import { Artist, Fan } from './types';

export const INITIAL_DEPOSIT_USD = 20;

export const ARTISTS_DATA: Artist[] = [
  {
    id: 1,
    name: 'Ola',
    genre: 'Pop',
    coverImage: 'https://images.pexels.com/photos/2118046/pexels-photo-2118046.jpeg?auto=compress&cs=tinysrgb&w=600',
    // Link de teste estável do Pixabay (substitua pelo seu link do GitHub Raw quando carregar lá)
    audioPreviewUrl: 'https://cdn.pixabay.com/audio/2022/10/14/audio_32307212d0.mp3',
    estimatedROI: 15,
    ranking: 34,
    instagramHandle: '@ola.music',
    presentationVideoUrl: 'https://www.youtube.com/embed/S_IAqwrvG_Y',
    socialLinks: { spotify: '#', youtube: '#', tiktok: '#' },
    releases: [
      { 
        id: 101, 
        title: 'Ocean Dreams', 
        coverImage: 'https://images.pexels.com/photos/3359734/pexels-photo-3359734.jpeg?auto=compress&cs=tinysrgb&w=600', 
        monthlyGoal: 6000000, 
        currentPlays: 4012398, 
        tokenValue: 25, 
        initialTokenValue: 12, 
        valueHistory: [{ time: 0, value: 12 }, { time: 1, value: 15 }, { time: 2, value: 14 }, { time: 3, value: 20 }, { time: 4, value: 22 }, { time: 5, value: 25 }],
      },
    ],
  },
  {
    id: 2,
    name: 'Marta',
    genre: 'Hip-hop',
    coverImage: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioPreviewUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    estimatedROI: 8,
    ranking: 102,
    instagramHandle: '@marta.hiphop',
    presentationVideoUrl: 'https://www.youtube.com/embed/5-3o_MvrxQw',
    socialLinks: { spotify: '#', youtube: '#', tiktok: '#' },
    releases: [
      { 
        id: 103, 
        title: 'Concrete Jungle', 
        coverImage: 'https://images.pexels.com/photos/4039163/pexels-photo-4039163.jpeg?auto=compress&cs=tinysrgb&w=600', 
        monthlyGoal: 10000000, 
        currentPlays: 1923904, 
        tokenValue: 28, 
        initialTokenValue: 15, 
        valueHistory: [{ time: 0, value: 15 }, { time: 3, value: 18 }, { time: 6, value: 24 }, { time: 9, value: 28 }] 
      }
    ],
  },
  {
    id: 3,
    name: 'Felix',
    genre: 'Jazz',
    coverImage: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioPreviewUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c35ef05d7b.mp3',
    estimatedROI: 2,
    ranking: 88,
    instagramHandle: '@felix.jazz',
    presentationVideoUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    socialLinks: { spotify: '#', youtube: '#', tiktok: '#' },
    releases: [
      { 
        id: 104, 
        title: 'Midnight Sax', 
        coverImage: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=600', 
        monthlyGoal: 22000000, 
        currentPlays: 2702219, 
        tokenValue: 19, 
        initialTokenValue: 20, 
        valueHistory: [{ time: 0, value: 20 }, { time: 4, value: 22 }, { time: 8, value: 18 }, { time: 9, value: 19 }] 
      }
    ],
  }
];

export const FANS_DATA: Fan[] = [
  { id: 1, name: 'Alex', plays: 1024, shares: 50, avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 2, name: 'Ben', plays: 980, shares: 45, avatar: 'https://i.pravatar.cc/150?u=ben' },
];
