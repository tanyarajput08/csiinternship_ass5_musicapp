import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  // A fallback image if the artist has no images
  const artistImage = artist?.images?.[0]?.url || 'https://via.placeholder.com/250';

  return (
    <div
      className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer"
      onClick={() => navigate(`/artists/${artist?.id}`)}
    >
      <img alt={artist?.name} src={artistImage} className="w-full h-56 rounded-lg" />
      <p className="mt-4 font-semibold text-lg text-white truncate">
        {artist?.name}
      </p>
    </div>
  );
};

export default ArtistCard;
