import FoundActors from '@/components/FaceMatchPage/FoundActors';
import RecognitionPhoto from '@/components/FaceMatchPage/RecognitionPhoto';
import UploadPhoto from '@/components/FaceMatchPage/UploadPhoto';
import WikiResults from '@/components/FaceMatchPage/WikiResults';
import { useActions } from '@/store/useActions';
import { RecognitionResponse } from '@/types';
import clsx from 'clsx';

import { FC, useEffect, useState } from 'react';
import { useNavigationType } from 'react-router-dom';
import { RecognitionService } from 'src/api/recognition.service';
import styles from './facematch.module.scss';
import Test from './test.png';

const FaceMatch: FC = () => {
  const { setMessage } = useActions();
  const [photo, setPhoto] = useState<string | null>(Test);
  const [showImageUploader, setShowImageUploader] = useState(true);
  const [recognitionLoading, setRecognitionLoading] = useState(false);
  const [recognitionFailed, setRecognitionFailed] = useState(false);
  const [actorNames, setActorNames] = useState<string[]>([]);

  const UploadPhotoHanlder = async (photo: string) => {
    try {
      setPhoto(photo);
      setRecognitionLoading(true);
      setShowImageUploader(false);
      const { detectedActors, imageSrc }: RecognitionResponse =
        await RecognitionService.uploadPhoto(photo);
      setRecognitionLoading(false);
      if (detectedActors.length === 0) {
        setRecognitionFailed(true);
        setMessage({
          msg: 'Could not find any actor in the photo',
          type: 'error'
        });
        return;
      }
      setPhoto(imageSrc);
      setActorNames(detectedActors);
    } catch (e) {
      console.log({ e });
      setMessage({ msg: (e as Error).message, type: 'error' });
      setRecognitionLoading(false);
      setShowImageUploader(true);
    }
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
          <WikiResults
            names={actorNames}
            recognitionFailed={recognitionFailed}
          />
        </div>
        <FoundActors
          names={actorNames}
          recognitionFailed={recognitionFailed}
          photo={photo}
        />
      </div>
    );
  }
  return <div style={{ marginTop: '60px' }}>Loading...</div>;
};

export default FaceMatch;
