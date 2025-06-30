// src/services/spotifyAuth.js
function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);
  values.forEach((val) => {
    result += charset[val % charset.length];
  });
  return result;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function getAuthUrl() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read'
  ];

  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const authUrl =
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

  return authUrl;
}

// Check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem('spotify_access_token');
  const tokenExpiry = localStorage.getItem('spotify_token_expiry');
  
  if (!token || !tokenExpiry) {
    return false;
  }
  
  // Check if token is expired
  const now = Date.now();
  if (now >= parseInt(tokenExpiry)) {
    // Token expired, remove it
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    return false;
  }
  
  return true;
}

// Get current access token
export function getAccessToken() {
  if (!isAuthenticated()) {
    return null;
  }
  return localStorage.getItem('spotify_access_token');
}

// Refresh access token
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error_description || 'Token refresh failed');
    }
    
    // Store new access token
    localStorage.setItem('spotify_access_token', data.access_token);
    
    // Store new refresh token if provided
    if (data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
    }
    
    // Calculate and store expiry time (expires_in is in seconds)
    const expiryTime = Date.now() + (data.expires_in - 300) * 1000; // Subtract 5 minutes for safety
    localStorage.setItem('spotify_token_expiry', expiryTime.toString());
    
    console.log('✅ Access token refreshed');
    return data.access_token;
    
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    // Clear all tokens on refresh failure
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    throw error;
  }
}

// Logout user
export function logout() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('spotify_code_verifier');
  console.log('✅ User logged out');
}