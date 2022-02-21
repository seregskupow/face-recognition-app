import { UserDto } from '@modules/user/dto/user.dto';

export type googlePayload = {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  googleId: string;
};

export type Done = (err: Error, user: UserDto) => void;
