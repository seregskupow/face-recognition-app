import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { IMG_UPLOADER } from '../constants';
import { UploaderType } from './types';

@Injectable()
export class ImgUploadService {
  constructor(
    @Inject(IMG_UPLOADER) private readonly uploader: typeof UploaderType,
  ) {}

  private uploadImg(
    dataUri: string,
    folder: string,
    width = 384,
    height = 384,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.uploader.upload(
        dataUri,
        {
          folder: `${process.env.CLOUDINARY_MAIN_FOLDER}/${folder}`,
          use_filename: true,
          transformation: {
            width: width,
            height: height,
            crop: 'fill',
          },
        },
        (err, url) => {
          if (err) return reject(err);
          return resolve(url);
        },
      );
    });
  }

  public uploadAvatar(dataUri: string) {
    return this.uploadImg(
      dataUri,
      process.env.CLOUDINARY_AVATARS_FOLDER,
      384,
      384,
    );
  }

  public uploadUserHistory(dataUri: string) {
    return this.uploadImg(
      dataUri,
      process.env.CLOUDINARY_HISTORY_FOLDER,
      1280,
      720,
    );
  }
}
