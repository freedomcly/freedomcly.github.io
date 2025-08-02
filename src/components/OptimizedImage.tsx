'use client';

import Image, { ImageProps } from 'next/image';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export default function OptimizedImage({ src, ...props }: OptimizedImageProps) {
  const { src: optimizedSrc } = useOptimizedImage(src);

  return <Image src={optimizedSrc} {...props} />;
}