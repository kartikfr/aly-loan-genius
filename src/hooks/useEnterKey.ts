import { useEffect, useCallback } from 'react';

interface UseEnterKeyOptions {
  onEnter?: () => void;
  enabled?: boolean;
  dependencies?: any[];
}

export const useEnterKey = ({ 
  onEnter, 
  enabled = true, 
  dependencies = [] 
}: UseEnterKeyOptions) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      onEnter?.();
    }
  }, [onEnter]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled, ...dependencies]);
}; 