import React from 'react';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { BsArrowRepeat, BsFillPauseFill, BsFillPlayFill, BsShuffle } from 'react-icons/bs';

const Controls = ({ isPlaying, repeat, setRepeat, shuffle, setShuffle, currentSongs, handlePlayPause, handlePrevSong, handleNextSong }) => (
  <div className="flex items-center justify-around md:w-36 lg:w-52 2xl:w-80">
    <BsArrowRepeat size={20} color={repeat ? '#ff4d00' : 'white'} onClick={() => setRepeat((prev) => !prev)} className="hidden sm:block cursor-pointer" />
    {currentSongs?.length && <MdSkipPrevious size={30} color="#FFF" className="cursor-pointer" onClick={handlePrevSong} />}
    {isPlaying ? (
      <button
        type="button"
        onClick={handlePlayPause}
        className="mx-4 p-4 rounded-full bg-[#ff4d00] text-white text-2xl shadow-[0_0_20px_rgba(255,77,0,0.5)] transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_35px_rgba(255,77,0,0.8)]"
      >
        <BsFillPauseFill />
      </button>
    ) : (
      <button
        type="button"
        onClick={handlePlayPause}
        className="mx-4 p-4 rounded-full bg-[#ff4d00] text-white text-2xl shadow-[0_0_20px_rgba(255,77,0,0.5)] transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_35px_rgba(255,77,0,0.8)]"
      >
        <BsFillPlayFill />
      </button>
    )}
    {currentSongs?.length && <MdSkipNext size={30} color="#FFF" className="cursor-pointer" onClick={handleNextSong} />}
    <BsShuffle size={20} color={shuffle ? '#ff4d00' : 'white'} onClick={() => setShuffle((prev) => !prev)} className="hidden sm:block cursor-pointer" />
  </div>
);

export default Controls;
