/* eslint-disable react/require-default-props */
import { FC } from 'react';
import styles from './panel.module.scss';

interface panelProps {
  children: React.ReactNode;
  padding?: number;
  width?: number | 'auto';
  margin?: number;
}
const Panel: FC<panelProps> = ({
  children,
  padding = 15,
  width = 'auto',
  margin = 0,
}) => {
  return (
    <div
      className={styles.panel}
      style={{
        margin: `${margin.toString()}px`,
        padding: `${padding.toString()}px`,
        width: width !== 'auto' ? `${width.toString()}%` : width,
      }}
    >
      {children}
    </div>
  );
};

export default Panel;
