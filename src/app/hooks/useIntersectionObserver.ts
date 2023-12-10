import { useEffect, useRef } from 'react';

export function useIntersectionObserver(onObserve: () => void, deps: unknown[]) {
  const observerTargetRef = useRef(null);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) {
      return;
    }

    const handleObserve: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
        onObserve();
      }
    };
    const observer = new IntersectionObserver(handleObserve, { threshold: 1 });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, deps);

  return observerTargetRef;
}
