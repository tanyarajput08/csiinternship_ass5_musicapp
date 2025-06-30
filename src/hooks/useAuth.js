// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { isAuthenticated } from '../spotifyAuth';

/**
 * A custom hook to track the user's authentication status.
 * It forces a re-render when the authentication status changes,
 * which is useful for components that need to react to login/logout events.
 */
export const useAuth = () => {
  // Initialize state from localStorage to handle existing sessions
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const onStorageChange = () => {
      setIsAuth(isAuthenticated());
    };

    // Listen for changes in localStorage (e.g., login/logout from another tab)
    window.addEventListener('storage', onStorageChange);
    
    // Also check on mount in case the state has changed since initialization
    setIsAuth(isAuthenticated());

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  return isAuth;
};