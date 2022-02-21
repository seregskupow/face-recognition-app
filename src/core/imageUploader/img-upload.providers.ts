import { IMG_UPLOADER, DEVELOPMENT, TEST, PRODUCTION } from '@core/constants';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from './uploader.config';

export const providers = [
  {
    provide: IMG_UPLOADER,
    useFactory: () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = cloudinaryConfig.development;
          break;
        case TEST:
          config = cloudinaryConfig.test;
          break;
        case PRODUCTION:
          config = cloudinaryConfig.production;
          break;
        default:
          config = cloudinaryConfig.development;
      }
      cloudinary.config(config);
      return cloudinary.uploader;
    },
  },
];
