// src/components/Login.jsx
import React from 'react';

// Helper: random string
const generateRandomString = (length) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
};

// Helper: generate PKCE challenge
const generateCodeChallenge = async (codeVerifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const Login = () => {
  const handleLogin = async () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

    // 1. Generate Code Verifier
    const codeVerifier = generateRandomString(128);
    localStorage.setItem('spotify_code_verifier', codeVerifier); // 💾 Store for callback

    // 2. Generate Code Challenge from Verifier
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // 3. Build Spotify authorization URL
    const scope = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    // 4. Redirect to Spotify login
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <button
        onClick={handleLogin}
        className="bg-green-500 text-black px-6 py-3 rounded-full hover:bg-green-600 transition font-semibold text-lg"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
