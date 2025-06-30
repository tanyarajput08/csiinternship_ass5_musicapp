import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { DetailsHeader, Error, Loader, RelatedSongs } from '../components';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import {
  useGetTrackDetailsQuery,
  useGetRecommendationsQuery,
} from '../redux/services/spotifyCore';

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    error,
  } = useGetTrackDetailsQuery(songid);

  const {
    data: recommendedData,
    isFetching: isFetchingRelatedSongs,
  } = useGetRecommendationsQuery({ seed_tracks: songid }); // ✅ Fix is here

  if (isFetchingSongDetails || isFetchingRelatedSongs)
    return <Loader title="Searching song details..." />;
  if (error) return <Error />;

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: recommendedData?.tracks, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader artistId={songData?.artists?.[0]?.id} songData={songData} />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Preview:</h2>
        {songData?.preview_url ? (
          <audio controls className="mt-4">
            <source src={songData.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p className="text-gray-400 text-base my-1">No preview available</p>
        )}
      </div>

      <RelatedSongs
        data={recommendedData?.tracks}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;

