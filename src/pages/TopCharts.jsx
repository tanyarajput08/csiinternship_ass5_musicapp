import React from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetUserTopTracksQuery } from '../redux/services/spotifyCore';
import { useAuth } from '../hooks/useAuth';

const TopCharts = () => {
  const isAuth = useAuth();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  // Fetch the user's personal top tracks
  const { data: topTracksData, isFetching, error } = useGetUserTopTracksQuery('', {
    skip: !isAuth,
  });

  if (isFetching) return <Loader title="Loading your top charts..." />;

  if (error) return <Error />;

  const tracks = topTracksData?.items;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Your Top Charts</h2>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {tracks?.map((song, i) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={tracks}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default TopCharts;

