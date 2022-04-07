import { dataURItoBlob } from '@/utils/dataUriToBlob';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from './dto/user.dto';
import { Api } from './index';

export const AuthService = {
  async login(dto: LoginDto) {
    const data: UserDto = await Api.post('/auth/login', dto);
    return data;
  },
  async register(dto: RegisterDto) {
    const bodyFormData = new FormData();
    const blob = dataURItoBlob(dto.avatar);
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
    bodyFormData.append('avatar', file);
    bodyFormData.append('name', dto.name);
    bodyFormData.append('email', dto.email);
    bodyFormData.append('password', dto.password);

    const data: UserDto = await Api.post('/auth/register', bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async checkAuth() {
    const data: UserDto = await Api.get('/users/me');
    return data;
  },

  logout() {
    return Api.get('/auth/logout');
  },

  async confirmEmail() {},

  async recoverPassword() {},
};
