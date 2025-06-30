/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';

import PlayPause from './PlayPause';

const SongBar = ({ song, i, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
  const coverImage = artistId
    ? song?.album?.images?.[0]?.url
    : song?.track?.album?.images?.[0]?.url || song?.album?.images?.[0]?.url;

  const songTitle = artistId
    ? song?.name
    : song?.track?.name || song?.name;

  const artistName = artistId
    ? song?.album?.name
    : song?.track?.artists?.[0]?.name || song?.artists?.[0]?.name;

  const songId = artistId
    ? song?.id
    : song?.track?.id || song?.id;

  return (
    <div className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeSong?.name === songTitle ? 'bg-[#4c426e]' : 'bg-transparent'} py-2 p-4 rounded-lg cursor-pointer mb-2`}>
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>

      <div className="flex-1 flex flex-row justify-between items-center">
        <img className="w-20 h-20 rounded-lg object-cover" src={coverImage} alt={songTitle} />
        <div className="flex-1 flex flex-col justify-center mx-3">
          <Link to={`/songs/${songId}`}>
            <p className="text-xl font-bold text-white truncate">{songTitle}</p>
          </Link>
          <p className="text-base text-gray-300 mt-1 truncate">
            {artistName}
          </p>
        </div>
      </div>

      {!artistId && (
        <PlayPause
          isPlaying={isPlaying}
          activeSong={activeSong}
          song={song.track || song}
          handlePause={handlePauseClick}
          handlePlay={() => handlePlayClick(song.track || song, i)}
        />
      )}
    </div>
  );
};

export default SongBar;
