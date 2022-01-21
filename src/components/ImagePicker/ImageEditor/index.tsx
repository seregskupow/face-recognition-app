import styles from './imageEditor.module.scss';
import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Button from '@/components/UI/Button';
import { motion } from 'framer-motion';
import Panel from '@/components/UI/Panel';
import { disableScrolling, enableScrolling } from '@/utils/windowScroll';
import { useActions } from '@/store/useActions';

type Position = {
  x: number;
  y: number;
};

export interface IimgOptions {
  scale: number;
  rotate: number;
  position: Position;
}
export const defaultImgOptions = {
  scale: 1,
  rotate: 0,
  position: {
    x: 0.5,
    y: 0.5
  }
};

interface IImageEditor {
  image: string;
  getImage: (image: string) => void;
  getOptions?: (imgOptions: IimgOptions) => void;
  closePicker?: () => void;
  imgOptions?: IimgOptions;
}
const variantsPicker = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};
const variantsBg = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const ImageEditor: FC<IImageEditor> = ({
  image,
  getImage,
  getOptions = () => {},
  closePicker = () => {},
  imgOptions = defaultImgOptions
}) => {
  const { setMessage } = useActions();
  let Editor: any;
  const [scale, setScale] = useState<number>(imgOptions.scale);
  const [rotate, setRotate] = useState<number>(imgOptions.rotate);
  const [position, setPosition] = useState(imgOptions.position);
  const scrollZoom = (e: React.WheelEvent) => {
    let scaleVal: number = scale + (e.deltaY > 0 ? -0.1 : 0.1);
    if (scaleVal > 10 || scaleVal < 0.5) return;
    scaleVal = parseFloat(Math.min(Math.max(scaleVal, 0.5), 10).toFixed(2));
    setScale(scaleVal);
  };
  useEffect(() => {
    scale === 1 && setPosition({ x: 0.5, y: 0.5 });
  }, [scale]);
  useEffect(() => {
    disableScrolling();
    return () => {
      enableScrolling();
    };
  }, []);
  return (
    <div className={styles.avatar__picker__container}>
      <motion.div
        key="picker_bg"
        variants={variantsBg}
        initial="initial"
        animate="animate"
        exit="exit"
        className={styles.avatar__picker__bg}
        onClick={() => closePicker()}
      ></motion.div>
      <motion.div
        key="picker"
        variants={variantsPicker}
        initial="initial"
        animate="animate"
        exit="exit"
        className={styles.avatar__picker}
      >
        <div className={styles.avatar__picker__inner}>
          <div className={styles.editor__wrapper} onWheel={scrollZoom}>
            <AvatarEditor
              ref={(editor: any) => (Editor = editor)}
              image={image}
              width={1920}
              height={1080}
              border={10}
              scale={scale}
              rotate={rotate}
              position={position}
              borderRadius={5}
              onPositionChange={(pos: Position) => {
                setPosition(pos);
              }}
            />
          </div>
          <div className={styles.editor__control__panel}>
            <div className={styles.avatar__settings}>
              {/* Scale */}
              <Fragment>
                <div className={styles.avatar__picker__control}>
                  <span className={`${styles.control__label}`}>Scale:</span>
                  <Button
                    text="Reset"
                    color="contrast"
                    event={() => {
                      setScale(defaultImgOptions.scale);
                    }}
                  />
                </div>
                <div className={styles.avatar__picker__control}>
                  <div className={styles.slider}>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.1}
                      value={scale}
                      onChange={(e) => setScale(+e.target.value)}
                    />
                  </div>
                  <div className={styles.value}>
                    <span className={styles.value__item}>{scale}</span>
                  </div>
                </div>
              </Fragment>
              {/* Rotation */}
              <Fragment>
                <div className={styles.avatar__picker__control}>
                  <span className={`${styles.control__label}`}>Rotation:</span>
                  <Button
                    text="Reset"
                    color="contrast"
                    event={() => {
                      setRotate(defaultImgOptions.rotate);
                    }}
                  />
                </div>
                <div className={styles.avatar__picker__control}>
                  <div className={styles.slider}>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={1}
                      value={rotate}
                      onChange={(e) => setRotate(+e.target.value)}
                    />
                  </div>
                  <div className={styles.value}>
                    <span className={styles.value__item}>{rotate}°</span>
                  </div>
                </div>
              </Fragment>
              {/* X */}
              <Fragment>
                <div className={styles.avatar__picker__control}>
                  <span className={`${styles.control__label}`}>X:</span>
                  <Button
                    text="Reset"
                    color="contrast"
                    event={() => {
                      setPosition({
                        ...position,
                        x: defaultImgOptions.position.x
                      });
                    }}
                  />
                </div>
                <div className={styles.avatar__picker__control}>
                  <div className={styles.slider}>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={position.x}
                      onChange={(e) =>
                        setPosition({ ...position, x: +e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.value}>
                    <span className={styles.value__item}>
                      {position.x.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Fragment>
              {/* Y */}
              <Fragment>
                <div className={styles.avatar__picker__control}>
                  <span className={`${styles.control__label}`}>Y:</span>
                  <Button
                    text="Reset"
                    color="contrast"
                    event={() => {
                      setPosition({
                        ...position,
                        y: defaultImgOptions.position.y
                      });
                    }}
                  />
                </div>
                <div className={styles.avatar__picker__control}>
                  <div className={styles.slider}>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={position.y}
                      onChange={(e) =>
                        setPosition({ ...position, y: +e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.value}>
                    <span className={styles.value__item}>
                      {position.y.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Fragment>
            </div>
            <div className={styles.form__controls}>
              <Button
                className="mr-5"
                fontSize={1.5}
                text="Apply"
                color="contrast"
                event={() => {
                  // setMessage({
                  //   type: 'success',
                  //   msg: 'Changes applied successfully'
                  // });
                  getImage(Editor.getImageScaledToCanvas().toDataURL());
                  getOptions({ rotate, scale, position });
                  closePicker();
                }}
              />
              <Button
                className="ml-5"
                fontSize={1.5}
                text="Close"
                event={closePicker}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageEditor;
