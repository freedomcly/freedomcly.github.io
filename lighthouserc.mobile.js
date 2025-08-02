export default {
  ci: {
    collect: {
      // 要测试的URL列表
      url: [
        'http://localhost:8080',
        'http://localhost:8080/articles/zumba'
      ],
      // 每个URL运行3次取平均值
      numberOfRuns: 3,
      // 静态目录
      staticDistDir: './out',
      // 移动端设置
      settings: {
        // 使用性能预设
        preset: 'perf',
        // 移动端特定设置
        formFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 150 * 3.75,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675
        },
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false
        },
        emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.101 Mobile Safari/537.36'
      }
    },
    assert: {
      // 移动端性能预算（更严格）
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }], // 移动端稍微放宽
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        
        // Core Web Vitals - 移动端标准
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'first-meaningful-paint': ['warn', { maxNumericValue: 2000 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // 移动端资源限制
        'total-byte-weight': ['warn', { maxNumericValue: 800000 }], // 800KB
        'unused-css-rules': ['warn', { maxNumericValue: 15000 }],
        'unused-javascript': ['warn', { maxNumericValue: 15000 }],
        
        // 移动端特定优化
        'uses-text-compression': 'warn',
        'render-blocking-resources': 'warn',
        'uses-rel-preconnect': 'warn'
      }
    }
  }
};