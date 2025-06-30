import React from 'react';

import { Error, Loader } from '../components';
import { useGetNewReleasesQuery } from '../redux/services/spotifyCore';
import { useAuth } from '../hooks/useAuth';

// An AlbumCard component to display album data.
const AlbumCard = ({ album }) => (
  <div className="flex flex-col w-[320px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
    <div className="relative w-full h-72 group">
      <img alt="album_img" src={album.images?.[0]?.url} className="w-full h-full rounded-lg" />
    </div>
    <div className="mt-4 flex flex-col">
      <p className="font-bold text-lg text-[#e34814] truncate">{album.name}</p>
      <p className="text-sm truncate text-gray-300 mt-1">
        {album.artists.map((artist) => artist.name).join(', ')}
      </p>
    </div>
  </div>
);

const Discover = () => {
  const isAuth = useAuth();
  const { data, isFetching, error } = useGetNewReleasesQuery(null, {
    skip: !isAuth,
  });

  if (isFetching) return <Loader title="Loading new releases..." />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">New Releases</h2>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.albums?.items?.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;
