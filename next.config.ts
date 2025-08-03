import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 静态导出需要保持 unoptimized: true
    formats: ['image/webp', 'image/avif'], // 支持现代图片格式
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 启用压缩（Next.js 内置）
  compress: true, // 启用 gzip 压缩
  
  // SWC 压缩在 Next.js 15+ 中默认启用，无需显式配置
  
  // 启用实验性功能以获得更好的性能
  experimental: {
    optimizePackageImports: ['next/image', 'react', 'react-dom'],
  },
  
  trailingSlash: true, // 静态导出建议开启

  // 编译器优化（Next.js 内置）
  compiler: {
    // 生产环境移除 console.log
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'] // 保留 console.error 和 console.warn
    } : false,
    
    // 移除 React DevTools 相关代码（生产环境）
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
