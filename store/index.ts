import { configureStore, createSlice, ThunkAction } from '@reduxjs/toolkit';
import { Action } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import userSlice from './slices/user.slice';
import authSlice from './slices/auth.slice';
import messageSlice from './slices/message.slice';

export const store = configureStore({
  reducer: {
    [messageSlice.name]: messageSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [authSlice.name]: authSlice.reducer,
  },
  devTools: true,
});

const makeStore = () => store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
export const wrapper = createWrapper<AppStore>(makeStore);
