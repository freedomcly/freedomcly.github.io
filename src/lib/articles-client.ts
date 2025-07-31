// 客户端版本的文章获取函数
import { remoteArticles } from './remote-articles';

// 文章元数据接口
export interface ArticleMeta {
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
  isRemote?: boolean;
  remoteUrl?: string;
  sourceSite?: string;
}

// 域名映射规则
const domainMap: Record<string, string> = {
  'raw.githubusercontent.com': 'GitHub',
  'mp.weixin.qq.com': '微信公众号'
};

// 客户端版本：根据语言获取文章列表（只使用远程文章）
export function getArticlesForLanguage(language: 'zh' | 'en') {
  // 只使用远程文章，因为客户端无法访问本地文件系统
  return remoteArticles.map(article => ({
    slug: article.meta.isRemote ? article.meta.remoteUrl : article.slug,
    title: article.meta.title[language] || article.meta.title.zh || 'Untitled',
    date: article.meta.date || 'Unknown Date',
    readTime: article.meta.readTime || 5,
    isRemote: article.meta.isRemote || false,
    category: article.meta.category[language] || article.meta.category.zh || 'Uncategorized',
    tags: article.meta.tags || [],
    excerpt: 'Remote article - click to read more',
    // 添加来源网站信息
    sourceSite: article.meta.isRemote ? 
      (article.meta.remoteUrl ? 
        domainMap[new URL(article.meta.remoteUrl).hostname] || new URL(article.meta.remoteUrl).hostname : 
        'Unknown Source') : 
      undefined
  })).filter(Boolean);
}