import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Add a small delay to ensure the page has rendered
    const timer = setTimeout(() => {
      // Smooth scroll to top when pathname changes
      try {
        // Try smooth scrolling first (modern browsers)
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        // Fallback for older browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);
}; 