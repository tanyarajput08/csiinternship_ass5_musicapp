// src/services/spotifyCoreApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  getAccessToken,
  refreshAccessToken,
  isAuthenticated,
} from '../../spotifyAuth'; // ✅ FIXED: relative import

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.spotify.com/v1/', // Base URL for all requests
  prepareHeaders: (headers, { getState }) => {
    const token = getAccessToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Check for authentication before any request
  if (!isAuthenticated()) {
    console.warn('⚠️ User not authenticated, skipping API call.');
    // Return a specific error structure that RTK Query can handle
    return {
      error: {
        status: 401,
        statusText: 'Unauthorized',
        data: 'User not authenticated. Please log in.',
      },
    };
  }
  
  console.log(`🚀 Making request: ${typeof args === 'string' ? args : JSON.stringify(args)}`);

  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, it might be an expired token, try to refresh it
  if (result.error && result.error.status === 401) {
    console.log('🔄 Access token expired, attempting refresh...');
    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        console.log('✅ Token refreshed successfully.');
        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Handle case where refresh fails but doesn't throw
        throw new Error('Failed to obtain new access token.');
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      // Ensure user is logged out or redirected if refresh fails
      // For now, just return the error
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'Session expired. Please log in again.',
        },
      };
    }
  }

  return result;
};

const baseQueryWithLogging = async (args, api, extraOptions) => {
  console.log('🚀 Making request:', args.url || args);
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    console.error('🔥 API Error:', {
      status: result.error.status,
      data: result.error.data,
      request: args.url || args,
    });
  }
  return result;
};

export const spotifyCoreApi = createApi({
  reducerPath: 'spotifyCoreApi',
  baseQuery: baseQueryWithLogging,
  tagTypes: ['Playlist', 'Artist', 'Track'],
  endpoints: (builder) => ({
    getPlaylistById: builder.query({
      query: (playlistId) => `/playlists/${playlistId}`,
      providesTags: (result, error, playlistId) => [
        { type: 'Playlist', id: playlistId },
      ],
    }),
    searchTracksAndArtists: builder.query({
      query: (searchTerm) => {
        if (!searchTerm || searchTerm.trim() === '') {
          throw new Error('Search term cannot be empty');
        }
        return `search?q=${encodeURIComponent(searchTerm.trim())}&type=track,artist&limit=20`;
      },
    }),
    getArtistDetails: builder.query({
      query: (artistId) => `artists/${artistId}`,
      providesTags: (result, error, artistId) => [
        { type: 'Artist', id: artistId },
      ],
    }),
    getArtistTopTracks: builder.query({
      query: (artistId) => `artists/${artistId}/top-tracks?market=IN`,
      providesTags: (result, error, artistId) => [
        { type: 'Artist', id: `${artistId}-top-tracks` },
      ],
    }),
    getRelatedArtists: builder.query({
      query: (artistId) => `artists/${artistId}/related-artists`,
      providesTags: (result, error, artistId) => [
        { type: 'Artist', id: `${artistId}-related` },
      ],
    }),
    getNewReleases: builder.query({
      query: () => 'browse/new-releases?limit=20',
    }),
    getTrackDetails: builder.query({
      query: (trackId) => `tracks/${trackId}`,
      providesTags: (result, error, trackId) => [
        { type: 'Track', id: trackId },
      ],
    }),
    getMultipleTracks: builder.query({
      query: (trackIds) => {
        const ids = Array.isArray(trackIds) ? trackIds.join(',') : trackIds;
        return `tracks?ids=${ids}`;
      },
    }),
    getRecommendations: builder.query({
      query: ({ seed_tracks, seed_artists, seed_genres, limit = 20 }) => {
        const params = new URLSearchParams();
        if (seed_tracks) params.append('seed_tracks', seed_tracks);
        if (seed_artists) params.append('seed_artists', seed_artists);
        if (seed_genres) params.append('seed_genres', seed_genres);
        params.append('limit', limit.toString());
        return `recommendations?${params.toString()}`;
      },
    }),
    getAvailableGenres: builder.query({
      query: () => 'recommendations/available-genre-seeds',
    }),
    getCurrentUser: builder.query({
      query: () => 'me',
    }),
    getUserPlaylists: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        // Default to 20 if no limit is provided, max is 50.
        params.append('limit', args?.limit || '20');
        return `me/playlists?${params.toString()}`;
      },
    }),
    getUserTopTracks: builder.query({
      query: ({ time_range = 'medium_term', limit = 20 } = {}) =>
        `me/top/tracks?time_range=${time_range}&limit=${limit}`,
    }),
    getUserTopArtists: builder.query({
      query: ({ time_range = 'medium_term', limit = 20 } = {}) =>
        `me/top/artists?time_range=${time_range}&limit=${limit}`,
    }),
  }),
});

export const {
  useGetPlaylistByIdQuery,
  useGetNewReleasesQuery,
  useSearchTracksAndArtistsQuery,
  useGetArtistDetailsQuery,
  useGetArtistTopTracksQuery,
  useGetRelatedArtistsQuery,
  useGetTrackDetailsQuery,
  useGetMultipleTracksQuery,
  useGetRecommendationsQuery,
  useGetAvailableGenresQuery,
  useGetCurrentUserQuery,
  useGetUserPlaylistsQuery,
  useGetUserTopTracksQuery,
  useGetUserTopArtistsQuery,
} = spotifyCoreApi;
