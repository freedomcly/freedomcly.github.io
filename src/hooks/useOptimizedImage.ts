'use client';

import { useState, useEffect } from 'react';
import { getOptimizedImageUrl } from '@/utils/imagePreloader';

export function useOptimizedImage(originalSrc: string) {
  const [optimizedSrc, setOptimizedSrc] = useState(originalSrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOptimizedImage() {
      try {
        const optimized = await getOptimizedImageUrl(originalSrc);
        if (isMounted) {
          setOptimizedSrc(optimized);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load optimized image:', error);
        if (isMounted) {
          setOptimizedSrc(originalSrc);
          setIsLoading(false);
        }
      }
    }

    loadOptimizedImage();

    return () => {
      isMounted = false;
    };
  }, [originalSrc]);

  return { src: optimizedSrc, isLoading };
}