import { useState, useEffect } from 'react';

/**
 * Hook that returns the scroll progress of the page (0 to 1)
 * and the raw scroll Y position
 */
export function useScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? currentScrollY / totalHeight : 0;

      setScrollY(currentScrollY);
      setProgress(Math.min(currentProgress, 1));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { scrollY, progress };
}
