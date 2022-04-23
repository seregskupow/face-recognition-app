import { dataURItoBlob } from '@/utils/dataUriToBlob';
import { GetServerSidePropsContext } from 'next';
import { NextRequest } from 'next/server';
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

  async checkAuthClient() {
    const data: UserDto = await Api.get('/users/me');
    return data;
  },
  async checkAuthMiddleware(req: NextRequest) {
    let isAuth: boolean = true;
    const cookie = req?.cookies;
    let cookieStr = '';
    for (let key in cookie) {
      cookieStr += `${key}=${cookie[key]};`;
    }
    await fetch('http://localhost:1337/api/v1/users/me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: cookieStr,
      },
    })
      .then((res) => {
        if (res.status === 403) isAuth = false;
      })
      .catch((err) => {
        isAuth = false;
      });
    return isAuth;
  },

  async checkAuthSSR(ctx: GetServerSidePropsContext) {
    let isAuth: boolean = true;
    const cookie = ctx.req?.headers.cookie || '';
    await Api.get('/users/me', {
      headers: {
        cookie: cookie,
      },
    }).catch((error) => {
      isAuth = false;
    });
    return isAuth;
  },

  logout() {
    return Api.get('/auth/logout');
  },

  async confirmEmail() {},

  async recoverPassword() {},
};
