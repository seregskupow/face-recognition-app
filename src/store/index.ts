import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { Action } from 'redux';
import userSlice from './slices/user.slice';
import authSlice from './slices/auth.slice';
import messageSlice from './slices/message.slice';

const makeStore = () =>
  configureStore({
    reducer: {
      [messageSlice.name]: messageSlice.reducer
      // [userSlice.name]: userSlice.reducer,
      // [authSlice.name]: authSlice.reducer
    },
    devTools: true
  });

export const store = configureStore({
  reducer: {
    [messageSlice.name]: messageSlice.reducer
    // [userSlice.name]: userSlice.reducer,
    // [authSlice.name]: authSlice.reducer
  },
  devTools: true
});

// export type AppStore = ReturnType<typeof makeStore>;
// export type AppState = ReturnType<AppStore['getState']>;
// export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
