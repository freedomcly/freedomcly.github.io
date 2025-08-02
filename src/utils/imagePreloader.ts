/**
 * 图片预加载工具
 */

interface PreloadImageOptions {
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 预加载单个图片
 */
export function preloadImage(src: string, options: PreloadImageOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      options.onLoad?.();
      resolve();
    };

    img.onerror = () => {
      options.onError?.();
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(
  sources: string[],
  options: PreloadImageOptions = {}
): Promise<void[]> {
  const promises = sources.map(src => preloadImage(src, options));
  return Promise.all(promises);
}

/**
 * 预加载关键图片（在页面加载时调用）
 */
export async function preloadCriticalImages() {
  const criticalImages = [
    '/images/tracy-400.jpg',
    '/images/me-800.jpg',
  ];

  // 预加载优化后的版本
  const optimizedImages = await Promise.all(
    criticalImages.map(url => getOptimizedImageUrl(url))
  );

  // 使用 requestIdleCallback 在浏览器空闲时预加载
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadImages(optimizedImages).catch(console.error);
    });
  } else {
    // 降级方案：使用 setTimeout
    setTimeout(() => {
      preloadImages(optimizedImages).catch(console.error);
    }, 100);
  }
}

/**
 * 创建 WebP 支持检测
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * 获取优化后的图片 URL（如果支持 WebP）
 */
export async function getOptimizedImageUrl(originalUrl: string): Promise<string> {
  if (typeof window === 'undefined') return originalUrl;

  const isWebPSupported = await supportsWebP();

  if (isWebPSupported && originalUrl.endsWith('.jpg')) {
    // 将原始 URL 转换为优化后的 WebP URL
    let optimizedUrl = originalUrl;

    // 处理不同的图片文件
    if (originalUrl.includes('/images/tracy-400.jpg')) {
      optimizedUrl = '/images/tracy-400.webp';
    } else if (originalUrl.includes('/images/me-400.jpg')) {
      optimizedUrl = '/images/me-800.webp';
    } else {
      // 通用处理：尝试添加 -400 后缀并转换为 webp
      optimizedUrl = originalUrl.replace('.jpg', '.webp');
    }

    try {
      await preloadImage(optimizedUrl);
      return optimizedUrl;
    } catch {
      // 如果 WebP 版本加载失败，尝试优化后的 JPG 版本
      const fallbackUrl = optimizedUrl.replace('.webp', '.jpg');
      try {
        await preloadImage(fallbackUrl);
        return fallbackUrl;
      } catch {
        return originalUrl;
      }
    }
  }

  return originalUrl;
}