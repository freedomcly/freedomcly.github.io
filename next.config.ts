import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // 静态导出需要保持 unoptimized: true
    formats: ['image/webp', 'image/avif'], // 支持现代图片格式
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  // 启用实验性功能以获得更好的性能
  experimental: {
    optimizePackageImports: ['next/image'],
  },
};

export default nextConfig;
