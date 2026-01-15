
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Artist, Release } from '../types';

const ArtistMiniCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  const { navigateTo } = useAppContext();
  return (
    <div 
      className="bg-brand-surface rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all hover:scale-105 min-w-[140px]"
      onClick={() => navigateTo('artist', artist.id)}
    >
      <img className="w-24 h-24 rounded-full mb-3 object-cover shadow-lg border-2 border-brand-primary/20" src={artist.coverImage} alt={artist.name} />
      <h3 className="text-sm font-bold text-center truncate w-full">{artist.name}</h3>
      <p className="text-xs text-brand-text-secondary">{artist.genre}</p>
    </div>
  );
};

interface GrowingToken {
    release: Release;
    artist: Artist;
    growth: number;
}

const GrowingTokenCard: React.FC<{ data: GrowingToken, rank: number }> = ({ data, rank }) => {
    const { navigateTo } = useAppContext();
    return (
        <div 
            onClick={() => navigateTo('artist', data.artist.id)}
            className="flex items-center bg-brand-surface/40 hover:bg-brand-surface p-3 rounded-xl min-w-[280px] border border-white/5 cursor-pointer transition-all"
        >
            <span className="text-2xl font-black text-white/20 mr-4 w-6 italic">#{rank}</span>
            <img src={data.release.coverImage} className="w-12 h-12 rounded-lg object-cover mr-3" alt={data.release.title} />
            <div className="flex-grow overflow-hidden">
                <p className="font-bold text-sm truncate">{data.release.title}</p>
                <p className="text-xs text-brand-text-secondary truncate">{data.artist.name}</p>
            </div>
            <div className="text-right ml-2">
                <p className="text-brand-primary font-bold text-sm">+{data.growth.toFixed(0)}%</p>
                <p className="text-[10px] text-brand-text-secondary uppercase">Growth</p>
            </div>
        </div>
    );
}

const HomeScreen: React.FC = () => {
  // FIX: Added navigateTo to the context destructuring to resolve "Cannot find name 'navigateTo'" error.
  const { artists, navigateTo } = useAppContext();

  // Calculate Top 10 Growth
  const topGrowing = useMemo(() => {
    const allReleasesWithGrowth: GrowingToken[] = artists.flatMap(artist => 
        artist.releases.map(release => ({
            release,
            artist,
            growth: ((release.tokenValue - release.initialTokenValue) / release.initialTokenValue) * 100
        }))
    );
    return allReleasesWithGrowth.sort((a, b) => b.growth - a.growth).slice(0, 10);
  }, [artists]);

  // Group by Genre
  const genres = useMemo(() => {
      const grouped: Record<string, Artist[]> = {};
      artists.forEach(a => {
          if (!grouped[a.genre]) grouped[a.genre] = [];
          grouped[a.genre].push(a);
      });
      return grouped;
  }, [artists]);

  return (
    <div className="p-4 pb-20 space-y-8">
      
      {/* Top 10 Growing Tokens Section */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-2xl font-bold text-brand-text-primary">🚀 Top 10 Tokens</h2>
            <span className="text-xs text-brand-primary font-semibold uppercase tracking-widest">Growing Fast</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {topGrowing.map((item, idx) => (
                <GrowingTokenCard key={item.release.id} data={item} rank={idx + 1} />
            ))}
        </div>
      </section>

      {/* Genres Sections */}
      {/* FIX: Explicitly cast Object.entries(genres) to ensure artistsInGenre is correctly typed as Artist[] instead of unknown. */}
      {(Object.entries(genres) as [string, Artist[]][]).map(([genre, artistsInGenre]) => (
          <section key={genre}>
            <h2 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-primary rounded-full"></span>
                {genre}
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                {artistsInGenre.map(artist => (
                    <ArtistMiniCard key={artist.id} artist={artist} />
                ))}
            </div>
          </section>
      ))}

      {/* Explore All */}
      <section>
          <h2 className="text-xl font-bold mb-4">Explore All Artists</h2>
          <div className="grid grid-cols-2 gap-4">
              {artists.map(artist => (
                  <div key={artist.id} onClick={() => navigateTo('artist', artist.id)} className="bg-brand-surface p-2 rounded-xl flex items-center gap-3 cursor-pointer">
                      <img src={artist.coverImage} className="w-10 h-10 rounded-lg object-cover" alt={artist.name} />
                      <div>
                          <p className="text-sm font-bold truncate">{artist.name}</p>
                          <p className="text-[10px] text-brand-text-secondary uppercase">{artist.genre}</p>
                      </div>
                  </div>
              ))}
          </div>
      </section>

    </div>
  );
};

export default HomeScreen;
