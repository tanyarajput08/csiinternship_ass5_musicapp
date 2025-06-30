import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetUserTopTracksQuery, useGetUserTopArtistsQuery } from '../redux/services/spotifyCore';
import { useAuth } from '../hooks/useAuth';

import 'swiper/css';
import 'swiper/css/free-mode';

const TopChartCard = ({ song, i, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (
  <div className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeSong?.name === song?.name ? 'bg-[#4c426e]' : 'bg-transparent'} py-1 p-4 rounded-lg cursor-pointer mb-1`}>
    <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img className="w-12 h-12 rounded-lg" src={song?.album?.images?.[0]?.url} alt={song?.name} />
      <div className="flex-1 flex flex-col justify-center mx-3">
        <Link to={`/songs/${song?.id}`}>
          <p className="text-base font-bold text-white">{song?.name}</p>
        </Link>
        <Link to={`/artists/${song?.artists?.[0]?.id}`}>
          <p className="text-xs text-gray-300 mt-1">{song?.artists?.[0]?.name}</p>
        </Link>
      </div>
    </div>
    <PlayPause
      isPlaying={isPlaying}
      activeSong={activeSong}
      song={song}
      handlePause={handlePauseClick}
      handlePlay={() => handlePlayClick(song, i)}
    />
  </div>
);

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const isAuth = useAuth();
  const divRef = useRef(null);

  // Use the user's personal top tracks for the chart
  const { data: topTracksData } = useGetUserTopTracksQuery('', { skip: !isAuth });
  // Fetch Top Artists
  const { data: artistsData } = useGetUserTopArtistsQuery('', { skip: !isAuth });

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  const topPlays = topTracksData?.items?.slice(0, 5);
  const topArtists = artistsData?.items?.slice(0, 5);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: topTracksData?.items, i }));
    dispatch(playPause(true));
  };

  return (
    <div ref={divRef} className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col overflow-y-auto pb-40">
      {/* Top Charts */}
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-[#e34814] font-bold text-2xl">Your Top Songs</h2>
          <Link to="/top-charts">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {topPlays?.map((song, i) => (
            <TopChartCard
              key={song.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={handlePlayClick}
            />
          ))}
        </div>
      </div>

      {/* Top Artists */}
      <div className="w-full flex flex-col mt-8">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-[#e34814] font-bold text-2xl">Top Artists</h2>
          <Link to="/top-artists">
            <p className="text-gray-300 text-base cursor-pointer">See more</p>
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4"
        >
          {topArtists?.map((artist) => (
            <SwiperSlide
              key={artist?.id}
              style={{ width: '20%', height: 'auto' }}
              className="shadow-lg rounded-full"
            >
              <Link to={`/artists/${artist?.id}`}>
                <img
                  src={artist?.images?.[0]?.url}
                  alt={artist?.name}
                  className="rounded-full w-full h-full object-cover"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopPlay;
