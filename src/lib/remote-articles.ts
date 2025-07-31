// 添加TypeScript接口定义
interface RemoteArticleMeta {
  title: {
    zh: string;
    en: string;
  };
  date: string;
  readTime: number;
  category: {
    zh: string;
    en: string;
  };
  tags: string[];
  isRemote: boolean;
  remoteUrl: string;
  excerpt?: string;
  content?: string;
}

interface RemoteArticle {
  slug: string;
  meta: RemoteArticleMeta;
}

// 优化后的远程文章数组
export const remoteArticles: RemoteArticle[] = [{
  slug: 'https://github.com/freedomcly/blog/blob/master/articles/%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96/%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.md',
  meta: {
    title: {
      zh: '用户体验优化',
      en: 'User Experience Optimization'
    },
    date: '2025-07-29',
    readTime: 3,
    category: {
      zh: '性能优化',
      en: 'Performance'
    },
    tags: ['性能', '前端', '优化'],
    isRemote: true,
    remoteUrl: 'https://github.com/freedomcly/blog/blob/master/articles/%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96/%E7%94%A8%E6%88%B7%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.md'
  }
}, {
  slug: 'https://github.com/freedomcly/blog/blob/master/articles/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/Web%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.md',
  meta: {
    title: {
      zh: 'Web性能优化',
      en: 'Web Performance Optimization'
    },
    date: '2019-03-28',
    readTime: 10,
    category: {
      zh: '性能优化',
      en: 'Performance'
    },
    tags: ['性能', '前端', '优化'],
    isRemote: true,
    remoteUrl: 'https://github.com/freedomcly/blog/blob/master/articles/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/Web%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.md'
  }
}, {
  slug: 'https://github.com/freedomcly/blog/blob/master/articles/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/%E5%9B%BE%E5%83%8F%E4%BC%98%E5%8C%96.md',
  meta: {
    title: {
      zh: '图片优化',
      en: 'Image Optimization'
    },
    date: '2018-09-28',
    readTime: 5,
    category: {
      zh: '性能优化',
      en: 'Performance'
    },
    tags: ['性能', '前端', '优化'],
    isRemote: true,
    remoteUrl: 'https://github.com/freedomcly/blog/blob/master/articles/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/%E5%9B%BE%E5%83%8F%E4%BC%98%E5%8C%96.md'
  }
}, {
  slug: 'https://github.com/freedomcly/blog/blob/master/articles/%E5%B7%A5%E7%A8%8B%E5%8C%96/%E5%A6%82%E4%BD%95%E8%BF%9B%E8%A1%8C%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B.md',
  meta: {
    title: {
      zh: '如何进行技术选型',
      en: 'How to Choose Technology'
    },
    date: '2025-07-02',
    readTime: 10,
    category: {
      zh: '技术积累',
      en: 'Technology Accumulation'
    },
    tags: ['技术', '选型', '积累'],
    isRemote: true,
    remoteUrl: 'https://github.com/freedomcly/blog/blob/master/articles/%E5%B7%A5%E7%A8%8B%E5%8C%96/%E5%A6%82%E4%BD%95%E8%BF%9B%E8%A1%8C%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B.md'
  }
}, {
  slug: 'https://mp.weixin.qq.com/s/fC4i7BBrHp-6_iUFvgm8OQ',
  meta: {
    title: {
      zh: '关于学习方法：从编程、跳舞、烹调想到的',
      en: 'About Learning Methods: From Programming to Dancing to Cooking'
    },
    date: '2015-12-19',
    readTime: 5,
    category: {
      zh: '学习心得',
      en: 'Learning Experience'
    },
    tags: ['学习', '方法', '心得'],
    isRemote: true,
    remoteUrl: 'https://mp.weixin.qq.com/s/fC4i7BBrHp-6_iUFvgm8OQ'
  }
}];