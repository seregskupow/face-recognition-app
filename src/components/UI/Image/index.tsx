import Loader from '@/components/Loader';
import { FC, Fragment, ReactElement, useEffect, useRef, useState } from 'react';
import { isConditionalExpression } from 'typescript';
import styles from './image.module.scss';
import PlaceHolder from './placeholder.jpg';
interface ImageProps {
  src: string;
  className?: string;
  alt?: string;
}

const placeholserSrc: string =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920px' height='1080px'%3E%3C/svg%3E";

const ImageComponent: FC<ImageProps> = ({ src, className, alt }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [image, setImage] = useState<any>(placeholserSrc);
  const [loaderScale, setLoaderScale] = useState(0);
  const heightRef = useRef<HTMLDivElement>(null);
  const loadImage = (src: string) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      setImage(image.src);
      setImageLoading(false);
    };
    image.onerror = () => {
      setImage(PlaceHolder);
      setImageLoading(false);
    };
  };
  const calcLoaderScale = (height: number): number => {
    //maximum scale value for loader circle
    const x = 1;
    //max image height when loader should stop to scale
    const y = 300;
    const loaderScale = (x / y) * height;
    return loaderScale;
  };
  useEffect(() => {
    loadImage(src);
    const imageHeight = heightRef.current?.clientHeight;
    imageHeight && setLoaderScale(calcLoaderScale(imageHeight));
  }, []);

  const renderImage = (): ReactElement => {
    return (
      <div ref={heightRef} className={styles.ImageWrapper}>
        <img src={image} className={className} alt={alt} />
        {imageLoading && (
          <Loader position="absolute" scale={loaderScale} blur />
        )}
      </div>
    );
  };
  return <Fragment>{renderImage()}</Fragment>;
};
export default ImageComponent;
