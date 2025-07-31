import { remoteArticles } from './remote-articles';

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

const domainMap: Record<string, string> = {
  'raw.githubusercontent.com': 'GitHub',
  'mp.weixin.qq.com': '微信公众号'
};

export function getArticlesForLanguage(language: 'zh' | 'en') {
  return remoteArticles.map(article => ({
    slug: article.meta.isRemote ? article.meta.remoteUrl : article.slug,
    title: article.meta.title[language] || article.meta.title.zh || 'Untitled',
    date: article.meta.date || 'Unknown Date',
    readTime: article.meta.readTime || 5,
    isRemote: article.meta.isRemote || false,
    category: article.meta.category[language] || article.meta.category.zh || 'Uncategorized',
    tags: article.meta.tags || [],
    excerpt: 'Remote article - click to read more',
    sourceSite: article.meta.isRemote ? 
      (article.meta.remoteUrl ? 
        domainMap[new URL(article.meta.remoteUrl).hostname] || new URL(article.meta.remoteUrl).hostname : 
        'Unknown Source') : 
      undefined
  })).filter(Boolean);
}