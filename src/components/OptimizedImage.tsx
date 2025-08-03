'use client';

import Image, { ImageProps } from 'next/image';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string; // 明确要求 alt 属性
}

export default function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
  const { src: optimizedSrc } = useOptimizedImage(src);

  return <Image src={optimizedSrc} alt={alt} {...props} />;
}