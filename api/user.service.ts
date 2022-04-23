import { LoadHistoryResponse } from '@/types';
import { Api } from './index';

export const UserService = {
  async loadHistory(pageNumber: number = 0) {
    const data: any = await Api.get(
      `/users/user_history?page_number=${pageNumber}`
    );
    console.log({ axios: data });
    return data;
  },
};
