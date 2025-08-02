'use client';

import { useEffect } from 'react';
import { preloadCriticalImages } from '@/utils/imagePreloader';

export default function ImagePreloader() {
  useEffect(() => {
    // 在组件挂载后预加载关键图片
    preloadCriticalImages();
  }, []);

  return null; // 这个组件不渲染任何内容
}