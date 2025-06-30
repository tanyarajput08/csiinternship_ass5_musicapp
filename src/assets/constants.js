import { HiOutlineHome, HiOutlinePhotograph, HiOutlineUserGroup, HiOutlineHashtag, HiOutlineMusicNote } from 'react-icons/hi';

export const genres = [
  { title: 'Pop', value: 'POP' },
  { title: 'Hip-Hop and Rap', value: 'HIP_HOP_RAP' },
  { title: 'Dance', value: 'DANCE' },
  { title: 'Electronic', value: 'ELECTRONIC' },
  { title: 'Rock', value: 'ROCK' },
  { title: 'Alternative', value: 'ALTERNATIVE' },
];

export const genrePlaylistMap = {
  POP: '37i9dQZF1DXcBWIGoYBM5M',
  HIP_HOP_RAP: '37i9dQZF1DX0XUsuxWHRQd',
  DANCE: '37i9dQZF1DXaXB8fQg7xif',
  ELECTRONIC: '37i9dQZF1DX4dyzvuaRJ0n',
  ROCK: '37i9dQZF1DWXRqgorJj26U',
  ALTERNATIVE: '37i9dQZF1DX82pCGH5USnM',
};

export const links = [
  { name: 'Discover', to: '/', icon: HiOutlineHome, end: true },
  { name: 'Around You', to: '/around-you', icon: HiOutlinePhotograph },
  { name: 'Top Artists', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Top Charts', to: '/top-charts', icon: HiOutlineHashtag },
  { name: 'Top 50 India', to: '/top-india', icon: HiOutlineMusicNote },
];
