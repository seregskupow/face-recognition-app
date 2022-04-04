import { SessionUser } from '@modules/user/dto/sessionUser.dto';

declare global {
  type SessionRequest = Request & { user: SessionUser };
}

export {};
