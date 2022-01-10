import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '..';

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};
export interface IUserState {
  id: number;
  name: string;
  email: string;
  avatar: string;
}
export const initialUserState: IUserState = {
  id: 0,
  name: '',
  email: '',
  avatar: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser: (state: IUserState, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    }
  },
  extraReducers: {}
});

export const userActions = userSlice.actions;

//export const userSelector = (state: AppState) => state.user;

export default userSlice;
