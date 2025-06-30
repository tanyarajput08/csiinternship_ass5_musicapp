import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlineMenu,
  HiOutlinePhotograph,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';

import geetbeatsLogo from '../assets/geetbeats.jpeg';
import { links } from '../assets/constants';
import { useAuth } from '../hooks/useAuth';

const handleLogin = () => {
  window.location.href = '/login';
};

const handleLogout = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('spotify_code_verifier');
  window.location.href = '/login';
};

const NavLinks = ({ handleClick }) => {
  const isAuth = useAuth();

  const closeMenu = () => {
    if (handleClick) {
      handleClick();
    }
  };

  return (
    <div className="mt-10">
      {links.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-row justify-start items-center my-8 text-sm font-medium transition-colors ${
              isActive ? 'text-[#e34814]' : 'text-gray-400 hover:text-[#e34814]'
            }`
          }
          onClick={closeMenu}
        >
          <item.icon className="w-6 h-6 mr-2" />
          {item.name}
        </NavLink>
      ))}

      {isAuth ? (
        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-[#e34814] hover:bg-[#c43e11] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="w-full text-center mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          🎷 Login with Spotify
        </button>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#131314]">
        <img src={geetbeatsLogo} alt="logo" className="w-full h-25 object-contain" />
        <NavLinks />
      </div>

      <div className="absolute md:hidden block top-6 right-3 z-20">
        {!mobileMenuOpen ? (
          <HiOutlineMenu className="w-6 h-6 text-white" onClick={() => setMobileMenuOpen(true)} />
        ) : (
          <RiCloseLine className="w-6 h-6 text-white" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>

      <div
        className={`absolute top-0 h-screen w-2/3 bg-[#131314] z-10 p-6 md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'left-0' : '-left-full'
        }`}
      >
        <img src={geetbeatsLogo} alt="logo" className="w-full h-20 object-contain" />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;

