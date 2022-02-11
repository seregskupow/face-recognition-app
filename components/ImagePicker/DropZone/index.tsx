import { useActions } from '@/store/useActions';
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './dropZone.module.scss';

interface DropZoneProps {
  onFileDrop: (files: FileList) => void;
}

const DropZone: FC<DropZoneProps> = ({ onFileDrop }) => {
  const { setMessage } = useActions();
  const dragZoneRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  let lastTarget: any = null;
  const dragEnterHadnler = (e: DragEvent) => {
    console.log('Enter fired');
    lastTarget = e.target;
    setShowOverlay(true);
  };
  const dragLeaveHandler = (e: DragEvent) => {
    e.preventDefault();

    if (e.target === document || e.target === lastTarget) {
      console.log('Leave fired');
      setShowOverlay(false);
    }
  };
  const onDropHandler = (e: DragEvent) => {
    e.preventDefault();
    setShowOverlay(false);
    if (e.dataTransfer?.files.length !== 0) {
      if ((e.dataTransfer?.files.length as number) > 1) {
        setMessage({ msg: 'Upload only 1 file', type: 'warning' });
        return;
      }
      onFileDrop(e.dataTransfer?.files as FileList);
    }
  };

  useEffect(() => {
    document.addEventListener('dragenter', dragEnterHadnler);
    document.addEventListener('dragleave', dragLeaveHandler);
    document.addEventListener('drop', onDropHandler);
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    return () => {
      document.removeEventListener('dragenter', dragEnterHadnler);
      document.removeEventListener('dragleave', dragLeaveHandler);
      document.removeEventListener('drop', onDropHandler);
    };
  }, []);
  return (
    <div
      ref={dragZoneRef}
      className={clsx(styles.dropZoneContainer, showOverlay && styles.show)}
    >
      <p>Drop anywhere!</p>
    </div>
  );
};

export default DropZone;
