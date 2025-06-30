import { configureStore } from '@reduxjs/toolkit';
import { spotifyCoreApi } from './services/spotifyCore';
import playerReducer from './features/playerSlice';

export const store = configureStore({
  reducer: {
    [spotifyCoreApi.reducerPath]: spotifyCoreApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spotifyCoreApi.middleware),
});
