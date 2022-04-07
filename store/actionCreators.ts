import { authActions } from './slices/auth.slice';
import { messageActions } from './slices/message.slice';
import { userActions } from './slices/user.slice';

export const allActionCreators = {
  ...messageActions,
  ...authActions,
  ...userActions,
};
