import axios, { AxiosInstance } from 'axios';
import { UserService } from './user.service';
import { ActorsService } from './actors.service';
import { AuthService } from './auth.service';

export const Api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000'
});

export const setToken = (token: string): void => {
  axios.defaults.headers.common['Auth-Token'] = 'Bearer ' + token;
};

export const removeToken = (): void => {
  axios.defaults.headers.common['Auth-Token'] = '';
};

export { UserService, ActorsService, AuthService };
