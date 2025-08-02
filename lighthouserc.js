export default {
  ci: {
    collect: {
      // 要测试的URL列表 - 使用静态文件服务器
      url: [
        'http://localhost:8080',
        'http://localhost:8080/articles/zumba'
      ],
      // 每个URL运行3次取平均值
      numberOfRuns: 3,
      // 静态目录
      staticDistDir: './out',
      // 设置设备类型
      settings: {
        // 使用桌面预设
        preset: 'desktop',
        // 桌面端设置
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    },
    assert: {
      // 性能预算设置
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 1600 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // 资源大小限制
        'total-byte-weight': ['warn', { maxNumericValue: 1000000 }], // 1MB
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
        'unused-javascript': ['warn', { maxNumericValue: 20000 }],
        
        // 图片优化
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-responsive-images': 'warn',
        
        // 缓存策略
        'uses-long-cache-ttl': 'warn',
        
        // 字体优化
        'font-display': 'warn'
      }
    },
    upload: {
      // 如果你想要持久化存储结果，可以配置这里
      // 暂时注释掉，使用临时存储
      // target: 'temporary-public-storage'
    }
  }
};