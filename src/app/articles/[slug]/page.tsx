import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { marked } from 'marked';
import matter from 'gray-matter';
import styles from '@/styles/pages/article.module.css';
import ArticleClient from './ArticleClient';

interface ArticleMeta {
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
  slug: string;
}

interface ArticleData {
  meta: ArticleMeta;
  content: string;
}

// 生成静态参数
export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'content/articles');
  
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  
  const filenames = fs.readdirSync(articlesDirectory);
  const slugs = filenames
    .filter(name => name.endsWith('.md') && name !== 'README.md')
    .map(name => name.replace(/\.md$/, ''));

  return slugs.map(slug => ({
    slug: slug,
  }));
}

// 获取文章数据
async function getArticleData(slug: string): Promise<ArticleData | null> {
  try {
    const articlesDirectory = path.join(process.cwd(), 'content/articles');
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // 解析markdown为HTML
    const htmlContent = marked.parse(content) as string;
    
    return {
      meta: data as ArticleMeta,
      content: htmlContent
    };
  } catch (error) {
    console.error('Error loading article:', error);
    return null;
  }
}

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const article = await getArticleData(slug);

  if (!article) {
    return (
      <div className={styles.error}>
        <h1>Article Not Found</h1>
        <p>The requested article could not be found.</p>
        <Link href="/" className={styles.backHome}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  return <ArticleClient article={article} />;
}