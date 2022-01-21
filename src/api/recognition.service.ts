import { setMessage } from '@/store/slices/message.slice';
import { AxiosError } from 'axios';
import { RecognitionResponse } from '@/types';
import { Api, dispatch } from './index';
import { dataURItoBlob } from '@/utils/dataUriToBlob';

export const RecognitionService = {
  async uploadPhoto(base64Photo: string): Promise<RecognitionResponse> {
    const formData = new FormData();

    const blob = dataURItoBlob(base64Photo);
    const file = new File([blob], 'actor.jpg', { type: 'image/jpeg' });

    formData.append('actor', file);

    const data: RecognitionResponse = await Api.post(
      '/api/recognition/upload',
      formData
    );
    return data;
  }
};

// try {
// } catch (error) {
//   dispatch(
//     setMessage({
//       msg:
//         (error as AxiosError).response?.data.message ||
//         (error as AxiosError).message,
//       type: 'error'
//     })
//   );
//   return { detectedActors: [], imgSrc: '' };
// }
