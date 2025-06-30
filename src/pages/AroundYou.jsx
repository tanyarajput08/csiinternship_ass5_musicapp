import React from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetUserPlaylistsQuery, useGetPlaylistByIdQuery } from '../redux/services/spotifyCore';
import { useAuth } from '../hooks/useAuth';

const AroundYou = () => {
  const isAuth = useAuth();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const targetPlaylistName = 'English romantic songs';

  // Step 1: Fetch all of the user's playlists (created and followed), increasing limit to 50
  const { data: userPlaylistsData, isFetching: isFetchingPlaylists, error: playlistsError } = useGetUserPlaylistsQuery({ limit: 50 }, {
    skip: !isAuth,
  });

  // Step 2: Find the specific playlist by name from the user's library
  const targetPlaylist = userPlaylistsData?.items?.find(
    (playlist) => playlist.name.toLowerCase() === targetPlaylistName.toLowerCase(),
  );
  const targetPlaylistId = targetPlaylist?.id;

  // Step 3: Fetch the tracks for that specific playlist ID
  const { data: playlistData, isFetching: isFetchingTracks, error: tracksError } = useGetPlaylistByIdQuery(targetPlaylistId, {
    skip: !isAuth || !targetPlaylistId, // Skip if not authenticated or if the playlist wasn't found
  });

  if (isFetchingPlaylists || isFetchingTracks) return <Loader title={`Searching for '${targetPlaylistName}'...`} />;

  // Handle case where the playlist isn't in the user's library
  if (!targetPlaylistId && !isFetchingPlaylists) {
    return <Error title={`Please add a playlist named '${targetPlaylistName}' to your Spotify library.`} />;
  }

  if (playlistsError || tracksError) return <Error />;

  const tracks = playlistData?.tracks?.items?.map((item) => item.track).filter(Boolean);
  const playlistName = playlistData?.name;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around You
      </h2>

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

export default AroundYou;

