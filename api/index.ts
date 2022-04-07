import axios, { AxiosInstance } from 'axios';
import { UserService } from './user.service';
import { ActorsService } from './actors.service';
import { AuthService } from './auth.service';
import { RecognitionService } from './recognition.service';
import { EnhancedStore } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

let store: EnhancedStore;
export let dispatch: AppDispatch;

export const injectStore = (_store: EnhancedStore) => {
  store = _store;
  dispatch = store.dispatch;
};

export const Api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

Api.interceptors.response.use(function (response) {
  return response.data;
});

export const setToken = (token: string): void => {
  console.log({ token });
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  Api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

export const removeToken = (): void => {
  axios.defaults.headers.common['Authorization'] = '';
  Api.defaults.headers.common['Authorization'] = '';
};

export { UserService, ActorsService, AuthService, RecognitionService };
