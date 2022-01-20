import FoundActors from '@/components/FaceMatchPage/FoundActors';
import RecognitionPhoto from '@/components/FaceMatchPage/RecognitionPhoto';
import UploadPhoto from '@/components/FaceMatchPage/UploadPhoto';
import WikiResults from '@/components/FaceMatchPage/WikiResults';
import clsx from 'clsx';

import { FC, useEffect, useState } from 'react';
import { useNavigationType } from 'react-router-dom';
import styles from './facematch.module.scss';
import Test from './test.png';

const FaceMatch: FC = () => {
  const [photo, setPhoto] = useState<string | null>(Test);
  const [showImageUploader, setShowImageUploader] = useState(true);
  const [recognitionLoading, setRecognitionLoading] = useState(true);
  const [actorNames, setActorNames] = useState<string[] | null>(null);

  const UploadPhotoHanlder = (photo: string) => {
    setPhoto(photo);
    setShowImageUploader(false);
  };

  if (showImageUploader) {
    return (
      <div className={styles.UploaderWrapper}>
        <UploadPhoto onPhotoUpload={(photo) => UploadPhotoHanlder(photo)} />
      </div>
    );
  }
  if (!showImageUploader && photo) {
    return (
      <div className={styles.Page}>
        <div className={clsx(styles.RecognitionImageWrapper, 'mb-20')}>
          <RecognitionPhoto
            displayImage={photo as string}
            loading={recognitionLoading}
          />
          <WikiResults names={actorNames} />
        </div>
        <FoundActors names={[]} />
      </div>
    );
  }
  return <div style={{ marginTop: '60px' }}>Loading...</div>;
};

export default FaceMatch;
