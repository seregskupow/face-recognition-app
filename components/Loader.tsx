import clsx from 'clsx';
import { CSSProperties, FC } from 'react';

interface LoaderProps {
  position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
  border?: string;
  background?: string;
  blur?: boolean;
  scale?: number;
}

const Loader: FC<LoaderProps> = ({
  position = 'absolute',
  border = 'inherit',
  blur = false,
  scale = 1
}) => {
  return (
    <div
      className={clsx('loader', blur && 'blur')}
      style={{
        position: position,
        borderRadius: border,
        zIndex: '9'
      }}
    >
      <div className="loader-wrapper">
        <svg width="0" height="0">
          <filter id="gooey-black-hole">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="20"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -16"
              result="goo"
            />
          </filter>
        </svg>
        <div className="black-hole" style={{ transform: `scale(${scale})` }}>
          <ul className="gooey-container">
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
            <li className="bubble"></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loader;
