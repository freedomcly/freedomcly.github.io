import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { remoteArticles } from './remote-articles';

// 配置 marked 选项
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // 允许换行
});

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
  // 添加远程文章标记和URL字段
  isRemote?: boolean;
  remoteUrl?: string;
  // 添加来源网站字段
  sourceSite?: string;
}

// 文章数据接口
export interface ArticleData {
  slug: string;
  meta: ArticleMeta;
  content: string;
  htmlContent: string;
}

// 获取所有文章的slug列表
export function getAllArticleSlugs(): string[] {
  const articlesDirectory = path.join(process.cwd(), 'content/articles');
  
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md') && fileName !== 'README.md')
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading articles directory:', error);
    return [];
  }
}

// 根据slug获取文章数据
export function getArticleBySlug(slug: string): Promise<ArticleData | null> {
  // 检查是否为远程文章URL
  if (slug.startsWith('http')) {
    return fetchRemoteArticle(slug);
  }

  // 原有本地文章处理逻辑
  try {
    const articlesDirectory = path.join(process.cwd(), 'content/articles');
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return Promise.resolve(null);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // 解析markdown内容为HTML
    const htmlContent = marked.parse(content) as string;
    
    return Promise.resolve({
      slug,
      meta: data as ArticleMeta,
      content,
      htmlContent
    });
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return Promise.resolve(null);
  }
}

// 获取所有文章数据
export function getAllArticles(): ArticleData[] {
  const slugs = getAllArticleSlugs();
  const articles: ArticleData[] = [];
  
  for (const slug of slugs) {
    const article = getArticleBySlug(slug);
    if (article) {
      if (article instanceof Promise) {
        console.error('getArticleBySlug 返回的是 Promise，需要使用异步处理');
        continue;
      }
      if (article) {
        articles.push(article);
      }
    }
  }
  
  // 按日期排序，最新的在前
  return articles.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

// 添加域名映射规则
const domainMap: Record<string, string> = {
  'raw.githubusercontent.com': 'GitHub',
  'mp.weixin.qq.com': '微信公众号'
};

// 根据语言获取文章列表（用于首页显示）
export function getArticlesForLanguage(language: 'zh' | 'en') {
  const localArticles = getAllArticles();

  // 合并本地和远程文章并排序
  const allArticles = [...remoteArticles, ...localArticles];

  return allArticles.map(article => ({
    slug: article.meta.isRemote ? article.meta.remoteUrl : article.slug,
    title: article.meta.title[language] || article.meta.title.zh || 'Untitled',
    date: article.meta.date || 'Unknown Date',
    readTime: article.meta.readTime || 5,
    isRemote: article.meta.isRemote || false,
    category: article.meta.category[language] || article.meta.category.zh || 'Uncategorized',
    tags: article.meta.tags || [],
    excerpt: (article as ArticleData).content && ((article as ArticleData).content.split('\n\n')[0].replace(/^#\s+/, '') || 'No excerpt available'),
    // 添加来源网站信息，使用域名映射
    sourceSite: article.meta.isRemote ? 
      (article.meta.remoteUrl ? 
        domainMap[new URL(article.meta.remoteUrl).hostname] || new URL(article.meta.remoteUrl).hostname : 
        'Unknown Source') : 
      undefined
  })).filter(Boolean);
}

// 添加远程文章获取函数
async function fetchRemoteArticle(url: string): Promise<ArticleData | null> {
  try {
    // 使用Next.js API路由代理避免CORS问题
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      console.error(`Failed to fetch remote article: ${response.status}`);
      return null;
    }

    const fileContents = await response.text();
    const { data, content } = matter(fileContents);
    const htmlContent = marked.parse(content) as string;

    return {
      slug: url,
      meta: data as ArticleMeta,
      content,
      htmlContent
    };
  } catch (error) {
    console.error('Error fetching remote article:', error);
    return null;
  }
}