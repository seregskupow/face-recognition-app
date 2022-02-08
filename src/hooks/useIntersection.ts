import { ArrowFunction } from 'typescript';

let listenerCallbacks = new WeakMap();

let observer: IntersectionObserver;

const observerCallback: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (listenerCallbacks.has(entry.target)) {
      let cb = listenerCallbacks.get(entry.target);

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
  target: HTMLElement,
  callback: () => void
)=> {
 useEffect(() => {
	let observer = 


	 return () => {
		 effect
	 };
 }, []);
};
