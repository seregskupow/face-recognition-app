import UploadPhoto from '@/components/FaceMatchPage/UploadPhoto';
import { FC } from 'react';
import styles from './facematch.module.scss';

const FaceMatch: FC = () => {
  const UploadPhotoHanlder = () => {};

  return (
    <div className={styles.Page}>
      <UploadPhoto onPhotoUpload={UploadPhotoHanlder} />
    </div>
  );
};

export default FaceMatch;
