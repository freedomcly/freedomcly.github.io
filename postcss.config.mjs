// PostCSS 配置 - ES 模块格式
export default {
  plugins: {
    // 自动添加浏览器前缀
    autoprefixer: {},
    
    // 生产环境启用 cssnano 压缩
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: 'default',
      },
    }),
  },
};