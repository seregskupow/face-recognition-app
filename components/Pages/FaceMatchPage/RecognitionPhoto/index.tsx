import Loader from '@/components/Loader';
import { FC } from 'react';
import styles from './recognitionPhoto.module.scss';

interface RecognitionPhotoProps {
  displayImage: string;
  loading: boolean;
}

const RecognitionPhoto: FC<RecognitionPhotoProps> = ({
  displayImage,
  loading,
}) => {
  console.log({ displayImage });
  return (
    <div className={styles.PhotoBackground}>
      <div className={styles.ImageWrapper}>
        {loading && <Loader position={'absolute'} border='15px' blur />}
        <img src={displayImage} alt='recognition' />
      </div>
    </div>
  );
};

export default RecognitionPhoto;
