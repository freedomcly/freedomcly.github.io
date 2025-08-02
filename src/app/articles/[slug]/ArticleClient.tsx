'use client';

import Link from 'next/link';
import {useLanguage} from '@/contexts/LanguageContext';
import styles from '@/styles/pages/article.module.css';
import Navigation from '@/components/Navigation';

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

interface ArticleClientProps {
  article: ArticleData;
}

export default function ArticleClient({article}: ArticleClientProps) {
  const {language} = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'zh') {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <>
      <Navigation />
      <article className={`${styles.articlePage} ${language === 'zh' ? styles.chineseFont : ''}`}>
        <div className={styles.container}>
        {/* 文章头部 */}
        <header className={styles.articleHeader}>
          <div className={styles.breadcrumb}>
            <Link href="/">{language === 'zh' ? '首页' : 'Home'}</Link>
            <span className={styles.separator}>→</span>
            <span className={styles.categoryBadge}>
              {language === 'zh' ? article.meta.category.zh : article.meta.category.en}
            </span>
          </div>

          <h1 className={styles.articleTitle}>
            {language === 'zh' ? article.meta.title.zh : article.meta.title.en}
          </h1>

          <div className={styles.articleMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📅</span>
              <span>{formatDate(article.meta.date)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>⏱</span>
              <span>{article.meta.readTime} {language === 'zh' ? '分钟阅读' : 'min read'}</span>
            </div>
          </div>

          <div className={styles.articleTags}>
            {article.meta.tags.map(tag => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* 文章内容 */}
        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{__html: article.content}}
        />

        {/* 文章底部 */}
        <footer className={styles.articleFooter}>
          <div className={styles.backToTop}>
            <button
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className={styles.backToTopBtn}
            >
              ↑ {language === 'zh' ? '回到顶部' : 'Back to Top'}
            </button>
          </div>

          <div className={styles.navigation}>
            <Link href="/" className={styles.backHome}>
              ← {language === 'zh' ? '返回首页' : 'Back to Home'}
            </Link>
          </div>
        </footer>
        </div>
      </article>
    </>
  );
}