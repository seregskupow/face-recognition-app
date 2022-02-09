import { RefObject, useEffect } from 'react';

let listenerCallbacks = new WeakMap<Element, () => void>();

let observer: IntersectionObserver;

const observerCallback: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (listenerCallbacks.has(entry.target)) {
      let cb = listenerCallbacks.get(entry.target) as () => void;

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        observer.unobserve(entry.target);
        listenerCallbacks.delete(entry.target);
        cb();
      }
    }
  });
};

const getObserver = (): IntersectionObserver => {
  if (observer === undefined) {
    observer = new IntersectionObserver(observerCallback, {
      rootMargin: '20px',
      threshold: 0
    });
    return observer;
  }

  return observer;
};

export const useIntersection = (
  imgRef: RefObject<HTMLDivElement>,
  callback: () => void
) => {
  useEffect(() => {
    let target = imgRef?.current;
    if (target !== null) {
      let observer = getObserver();
      listenerCallbacks.set(target, callback);
      observer.observe(target);
    }
    return () => {
      if (target !== null) {
        listenerCallbacks.delete(target);
        observer.unobserve(target);
      }
    };
  }, []);
};
