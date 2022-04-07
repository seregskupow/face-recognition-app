import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, AppState } from '..';
import { setMessage } from './message.slice';
import { initialUserState, User } from './user.slice';
import { userActions } from './user.slice';
import axios, { AxiosError } from 'axios';
import { dataURItoBlob } from '@/utils/dataUriToBlob';
import { LoginDto } from 'api/dto/login.dto';
import { UserDto } from 'api/dto/user.dto';
import { AuthService } from 'api/auth.service';
import { RegisterDto } from 'api/dto/register.dto';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
});

// export interface LoginDTO {
//   email: string;
//   password: string;
// }

// export interface RegisterDTO {
//   email: string;
//   password: string;
//   name: string;
//   avatar: string;
// }

export interface IAuthState {
  authenticationLoading: boolean;
  loading: boolean;
  loggedIn: boolean;
}
const initialState: IAuthState = {
  authenticationLoading: true,
  loading: false,
  loggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state: IAuthState, action: PayloadAction<boolean>) => {
      state.authenticationLoading = action.payload;
    },
    setLoading: (state: IAuthState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoggedIn: (state: IAuthState, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
  },
  extraReducers: {},
});
const { setLoading, setLoggedIn, setAuthLoading } = authSlice.actions;

const loginUser = (user: LoginDto) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const data: UserDto = await AuthService.login(user);
      dispatch(userActions.setUser(data));
      dispatch(setLoggedIn(true));
      dispatch(setMessage({ type: 'success', msg: 'Successful login' }));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoggedIn(false));
      dispatch(setLoading(false));
      dispatch(
        setMessage({
          type: 'error',
          msg:
            (error as AxiosError).response?.data.message ||
            (error as AxiosError).message,
        })
      );
    }
  };
};

const registerUser = (user: RegisterDto) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const data: UserDto = await AuthService.register(user);
      dispatch(userActions.setUser(data));
      dispatch(setLoggedIn(true));
      dispatch(setMessage({ type: 'success', msg: 'Successful register' }));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoggedIn(false));
      dispatch(setLoading(false));
      dispatch(
        setMessage({
          type: 'error',
          msg:
            (error as AxiosError).response?.data.message ||
            (error as AxiosError).message,
        })
      );
    }
  };
};

const authenticateUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setAuthLoading(true));
      const user: UserDto = await AuthService.checkAuth();
      console.log({ AUTHUSER: user });
      dispatch(userActions.setUser(user));
      dispatch(setLoggedIn(true));
      dispatch(setAuthLoading(false));
      dispatch(
        setMessage({ type: 'success', msg: `Logged in as ${user.name}` })
      );
    } catch (error) {
      dispatch(setLoggedIn(false));
      dispatch(setAuthLoading(false));
      const axiosError = error as AxiosError;
      if (
        axiosError.response?.status === 403 ||
        axiosError.response?.status === 401
      ) {
        dispatch(
          setMessage({ type: 'info', msg: 'You are not authenticated' })
        );
      } else {
        dispatch(
          setMessage({
            type: 'error',
            msg:
              (error as AxiosError).response?.data.message ||
              (error as AxiosError).message,
          })
        );
      }
    }
  };
};

const logoutUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      await AuthService.logout();
      dispatch(userActions.setUser(initialUserState));
      dispatch(setLoggedIn(false));
      dispatch(setMessage({ type: 'success', msg: 'Successful logout' }));
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          msg:
            (error as AxiosError).response?.data.message ||
            (error as AxiosError).message,
        })
      );
    }
  };
};

export const authActions = {
  ...authSlice.actions,
  loginUser,
  registerUser,
  logoutUser,
  authenticateUser,
};

export const authSelector = (state: AppState) => state.auth;

export default authSlice;
