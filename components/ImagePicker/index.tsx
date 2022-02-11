import ReactTestUtils from 'react-dom/test-utils';
import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ImageEditor, { defaultImgOptions, IimgOptions } from './ImageEditor';
import AvatarPlaceholder from './testio_placeholder.jpg';
import { AnimatePresence } from 'framer-motion';
import { checkIfImage } from '@/utils/imageExtention';
import styles from './imagePicker.module.scss';
import { loadImage } from '@/utils/loadImage';
import DropZone from './DropZone';
import { useActions } from '@/store/useActions';
import axios from 'axios';

export const useImagePicker = (
  initialImage: string = AvatarPlaceholder.src
) => {
  const { setMessage } = useActions();

  useEffect(() => {
    console.log({ initialImage });
  }, []);
  const [imageUpload, setImgUpload] = useState<HTMLInputElement | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(
    initialImage
  );
  const [initImage, setinitImage] = useState<string | null>(initialImage);
  const [imgOptions, setImageoptions] =
    useState<IimgOptions>(defaultImgOptions);
  const [avatar, setAvatar] = useState<string | null>(null);
  const triggerInput = () => {
    imageUpload?.click();
  };
  const resetImage = () => {
    setAvatar(initImage);
    setOriginalImage(initImage);
    setImageoptions(defaultImgOptions);
  };
  const urlUpload = async (url: string) => {
    try {
      const { data: blob } = await axios.get(url, {
        responseType: 'blob',
      });
      const imgFile = new File([blob], 'actor.jpg');
      const dt = new DataTransfer();
      dt.items.add(imgFile);
      if (imageUpload) {
        imageUpload.files = dt.files;
        ReactTestUtils.Simulate.change(imageUpload);
      }
    } catch (e) {
      setMessage({ msg: 'Error fetching image', type: 'error' });
    }
  };
  const onPasteHandler = (e: Event) => {
    try {
      const clipboardEvent: ClipboardEvent = e as ClipboardEvent;
      if (clipboardEvent.clipboardData?.files.length) {
        if (clipboardEvent.clipboardData?.files.length > 1) {
          setMessage({ msg: 'Paste only one file', type: 'warning' });
          return;
        }
        if (imageUpload) {
          imageUpload.files = clipboardEvent.clipboardData?.files;
          ReactTestUtils.Simulate.change(imageUpload);
        }
      } else {
        setMessage({
          msg: 'No image detected in the clipboard',
          type: 'warning',
        });
      }
    } catch (e) {
      setMessage({ msg: 'Error reading imagefrom clipboard', type: 'error' });
    }
  };

  useEffect(() => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    initialImage &&
      loadImage(
        initialImage,
        (img) => {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx: CanvasRenderingContext2D = canvas.getContext(
            '2d'
          ) as CanvasRenderingContext2D;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const newImage = canvas.toDataURL();
          setOriginalImage(newImage);
          setAvatar(newImage);
          setinitImage(newImage);
        },
        (msg) => {
          setMessage({ type: 'error', msg });
        }
      );
    return () => {
      canvas.remove();
    };
  }, [initialImage]);

  useEffect(() => {
    if (imageUpload) {
      window.addEventListener('paste', onPasteHandler);
    }

    return () => {
      window.removeEventListener('paste', onPasteHandler);
    };
  }, [imageUpload]);

  const ImagePicker = useCallback(
    ({ getImage = () => {} }) => {
      return (
        <Fragment>
          <DropZone
            onFileDrop={(files) => {
              if (imageUpload) {
                imageUpload.files = files;
                ReactTestUtils.Simulate.change(imageUpload);
              }
            }}
          />
          <input
            className={styles.file__input}
            ref={(upload) => {
              setImgUpload(upload);
            }}
            id='avatar'
            type='file'
            accept='image/*'
            onChange={(e) => {
              if (e.target?.files?.length) {
                if (!checkIfImage(e.target.value)) {
                  setMessage({
                    type: 'warning',
                    msg: 'Only .jpg, .jpeg, .png, .gif files are allowed',
                  });
                  return;
                }
                if (e.target?.files[0].size > 5242880) {
                  setMessage({
                    type: 'warning',
                    msg: 'Maximum file size allowed is 5mb',
                  });
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  setMessage({
                    type: 'info',
                    msg: 'Successful image upload',
                  });
                  const img = reader.result?.toString() as string;
                  setOriginalImage(img);
                  setAvatar(img);
                  setImageoptions(defaultImgOptions);
                  setShowAvatarPicker(true);
                };
                reader.readAsDataURL(e.target?.files[0]);
                reader.onerror = () => {
                  setMessage({
                    type: 'error',
                    msg: 'FileReader error occured',
                  });
                };
              }
            }}
          />
          <AnimatePresence>
            {showAvatarPicker && (
              <ImageEditor
                image={originalImage as string}
                getImage={(image) => {
                  setAvatar(image);
                  getImage(image);
                }}
                getOptions={setImageoptions}
                imgOptions={imgOptions}
                closePicker={() => setShowAvatarPicker(false)}
              />
            )}
          </AnimatePresence>
        </Fragment>
      );
    },
    [showAvatarPicker, originalImage, setAvatar, setImageoptions, imgOptions]
  );

  return {
    ImagePicker,
    setShowAvatarPicker,
    triggerInput,
    resetImage,
    urlUpload,
    avatar,
  };
};
