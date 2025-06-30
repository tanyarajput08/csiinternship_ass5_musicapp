// src/components/Callback.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedToken = useRef(false); // Prevent double-running in StrictMode

  useEffect(() => {
    const fetchToken = async () => {
      // Prevent the effect from running twice in development
      if (hasFetchedToken.current) {
        return;
      }
      hasFetchedToken.current = true;

      try {
        const code = new URLSearchParams(window.location.search).get('code');
        const error = new URLSearchParams(window.location.search).get('error');
        
        // Check if user denied access
        if (error) {
          console.error('❌ User denied access:', error);
          setError('Access denied. Please try logging in again.');
          setIsLoading(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        const codeVerifier = localStorage.getItem('spotify_code_verifier');
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

        // Debug logs
        console.log('📥 Authorization Code:', code ? '✅ Present' : '❌ Missing');
        console.log('🔐 Code Verifier:', codeVerifier ? '✅ Present' : '❌ Missing');
        console.log('🪪 Client ID:', clientId ? '✅ Present' : '❌ Missing');
        console.log('↩️ Redirect URI:', redirectUri ? '✅ Present' : '❌ Missing');

        if (!code || !codeVerifier || !clientId || !redirectUri) {
          console.error('❌ Missing required data for token exchange');
          setError('Missing authentication data. Please try logging in again.');
          setIsLoading(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          code_verifier: codeVerifier,
        });

        console.log('🔄 Exchanging code for tokens...');
        
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('❌ Token exchange failed:', data);
          setError(data.error_description || 'Authentication failed. Please try again.');
          setIsLoading(false);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (data.access_token) {
          // Store access token
          localStorage.setItem('spotify_access_token', data.access_token);
          
          // Store refresh token if provided
          if (data.refresh_token) {
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
          }
          
          // Calculate and store expiry time (expires_in is in seconds)
          const expiryTime = Date.now() + (data.expires_in - 300) * 1000; // Subtract 5 minutes for safety
          localStorage.setItem('spotify_token_expiry', expiryTime.toString());
          
          // Clean up code verifier
          localStorage.removeItem('spotify_code_verifier');
          
          console.log('✅ Authentication successful!');
          console.log('🔐 Access token stored');
          console.log('⏰ Token expires at:', new Date(expiryTime).toLocaleString());
          
          setIsLoading(false);
          
          // Force a full page reload to clear state and solve race conditions
          window.location.href = '/';
          
        } else {
          console.error('❌ Token response missing access_token:', data);
          setError('Authentication incomplete. Please try again.');
          setIsLoading(false);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('❌ Error during token exchange:', err);
        setError('Network error. Please check your connection and try again.');
        setIsLoading(false);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    fetchToken();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-black">
        <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500/30">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-red-300 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-black">
      <div className="text-center p-8">
        <div className="animate-spin text-green-400 text-6xl mb-4">🎵</div>
        <h2 className="text-white text-xl font-semibold mb-2">
          {isLoading ? 'Authenticating with Spotify...' : 'Success!'}
        </h2>
        <p className="text-gray-300">
          {isLoading ? 'Please wait while we log you in' : 'Taking you to your music...'}
        </p>
        <div className="mt-4">
          <div className="inline-block animate-pulse">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callback;