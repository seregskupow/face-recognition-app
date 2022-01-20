import { Api } from './index';

export const UserService = {
  async getAll() {
    const { data } = await Api.get('/users');
    return data;
  },
  async register(dto: any) {
    const { data } = await Api.post('/auth/register', dto);
    return data;
  },
  async login(dto: any) {
    const { data } = await Api.post('/auth/login', dto);
    return data;
  },
  async getMe() {
    const { data } = await Api.get('/users/me');
    return data;
  }
};
