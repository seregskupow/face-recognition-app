import { FC, useEffect } from 'react';
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button';
import styles from './uploadPhoto.module.scss';
import 'react-awesome-button/dist/themes/theme-blue.css';

import AlPacino from './demoImages/al.jpg';
import Trio from './demoImages/trio.png';
import Harley from './demoImages/harley.jpg';
import Angelina from './demoImages/angelina.jpg';
import Stark from './demoImages/stark.png';
import { useImagePicker } from '@/components/ImagePicker';
import clsx from 'clsx';

type Actor = {
  name: string;
  photo: string;
};

const actors: Array<Actor> = [
  { name: 'AlPacino', photo: AlPacino },
  { name: 'Trio', photo: Trio },
  { name: 'Harley', photo: Harley },
  { name: 'Angelina', photo: Angelina },
  { name: 'Stark', photo: Stark }
];
interface UploadPhotoProps {
  onPhotoUpload: (photo: string) => void;
}

const UploadPhoto: FC<UploadPhotoProps> = ({ onPhotoUpload }) => {
  const { ImagePicker, triggerInput, urlUpload } = useImagePicker(Harley);
  return (
    <div className={styles.uploadPhotoWrapper}>
      <ImagePicker getImage={(photo: string) => onPhotoUpload(photo)} />
      <div className={styles.panel}>
        <div className={styles.inner}>
          <h2 className={styles.uploadPrompt}>
            Upload file to recognize an actor
          </h2>
          <div className={styles.uploadPhotoPanel}>
            <div className={styles.uploadFromDiskButtonWrapper}>
              <div className={styles.AwesomeBtnWrapper}>
                <AwesomeButton
                  type="primary"
                  size="large"
                  onPress={() => {
                    triggerInput();
                  }}
                  button-hover-pressure="3"
                >
                  <span>Upload from disk</span>
                </AwesomeButton>
              </div>
            </div>

            <p className={styles.pastePrompt}>
              Drag-n-drop OR just Ctrl+V
              <br />
              No image? try one of these
            </p>
            <div className={styles.demoImagesWrapper}>
              {actors.map((actor: Actor) => (
                <div
                  className={styles.demoImage}
                  onClick={() => {
                    urlUpload(actor.photo);
                    //onPhotoUpload(actor.photo)
                  }}
                >
                  <img
                    className={clsx(styles.originalImage)}
                    src={actor.photo}
                    alt={actor.name}
                  />
                  <img
                    className={styles.blurEffect}
                    src={actor.photo}
                    alt={actor.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;

{
  /* <div style={{ visibility: 'hidden', opacity: '0' }} id="dropzone">
					<div id="textnode">Drop anywhere!</div>
				</div>
      <p className={styles.test_class}>sdfsdfsdf</p> */
}
