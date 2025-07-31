'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useLanguage} from '@/contexts/LanguageContext';
import styles from '@/styles/components/ArticleTOC.module.css';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
}

interface ArticleTOCProps {
  showProgress?: boolean;
  currentSlug?: string;
  articles?: Article[];
}

export default function ArticleTOC({
  showProgress = false,
  currentSlug = '',
  articles = []
}: ArticleTOCProps) {
  const {language} = useLanguage();
  const router = useRouter();
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [showArticleList, setShowArticleList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>(() => {
    // 从localStorage读取用户偏好，默认为最新优先
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('articleSortBy') as 'date-desc' | 'date-asc' | 'title') || 'date-desc';
    }
    return 'date-desc';
  });

  // 生成目录
  useEffect(() => {
    const generateTOC = () => {
      // 查找文章内容区域内的标题
      const articleContent = document.querySelector('.markdown');
      if (!articleContent) {
        // 尝试其他选择器
        const alternativeContent = document.querySelector('[class*="markdown"], [class*="content"]');
        if (!alternativeContent) {
          return;
        }
      }

      const contentElement = articleContent || document.querySelector('[class*="markdown"], [class*="content"]');
      if (!contentElement) {
        return;
      }

      const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: TOCItem[] = [];

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';

        // 使用现有的 ID 或生成新的 ID
        let id = heading.id;
        if (!id) {
          id = `heading-${index}`;
          heading.id = id;
        }

        items.push({id, text, level});
      });

      setTocItems(items);
      setIsVisible(items.length > 0);
    };

    // 延迟执行，确保文章内容已渲染
    const timer = setTimeout(generateTOC, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 监听滚动，更新活跃标题
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 计算阅读进度
      if (showProgress) {
        const progress = Math.min(
          (scrollTop / (documentHeight - windowHeight)) * 100,
          100
        );
        setReadingProgress(progress);
      }

      // 找到当前可见的标题
      let currentActiveId = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100 && rect.top >= -100) {
          currentActiveId = heading.id;
        }
      });

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始调用

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeId, showProgress]);

  // 点击目录项跳转
  const handleTOCClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // 点击文章列表项跳转
  const handleArticleClick = (slug: string) => {
    // 使用Next.js的客户端路由，速度更快
    router.push(`/articles/${slug}`);
  };

  // 预加载文章页面
  const handleArticleHover = (slug: string) => {
    router.prefetch(`/articles/${slug}`);
  };

  // 过滤和排序文章
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // 获取所有分类
  const categories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];

  // 格式化日期
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
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className={`${styles.tocContainer} ${language === 'zh' ? styles.chineseFont : ''}`}>
      <div className={styles.tocContent}>
        <div className={styles.tocHeader}>
          <div className={styles.tocTopBar}>
            <h3 className={styles.tocTitle}>
              {showArticleList
                ? (language === 'zh' ? '文章列表' : 'Articles')
                : (language === 'zh' ? '本文目录' : 'Table of Contents')
              }
            </h3>
            <button
              className={styles.backToListButton}
              onClick={() => setShowArticleList(!showArticleList)}
              title={showArticleList
                ? (language === 'zh' ? '返回目录' : 'Back to TOC')
                : (language === 'zh' ? '文章列表' : 'Articles')
              }
            >
              <span className={styles.backIcon}>
                {showArticleList ? '📋' : '📚'}
              </span>
              <span className={styles.backText}>
                {showArticleList
                  ? (language === 'zh' ? '目录' : 'TOC')
                  : (language === 'zh' ? '文章列表' : 'Articles')
                }
              </span>
            </button>
          </div>
          {showProgress && !showArticleList && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{width: `${readingProgress}%`}}
                />
              </div>
              <span className={styles.progressText}>
                {Math.round(readingProgress)}%
              </span>
            </div>
          )}
        </div>

        <nav className={styles.tocNav}>
          {showArticleList ? (
            // 文章列表视图
            <div className={styles.articleListView}>
              {/* 搜索框 */}
              <div className={styles.searchBox}>
                <div className={styles.searchIcon}>🔍</div>
                <input
                  type="text"
                  placeholder={language === 'zh' ? '搜索文章...' : 'Search articles...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    className={styles.clearSearch}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 排序选择器 */}
              <div className={styles.sortContainer}>
                <div className={styles.sortLabel}>
                  <span className={styles.sortIcon}>⚡</span>
                  {language === 'zh' ? '排序' : 'Sort'}:
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const newSortBy = e.target.value as 'date-desc' | 'date-asc' | 'title';
                    setSortBy(newSortBy);
                    // 保存用户偏好到localStorage
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('articleSortBy', newSortBy);
                    }
                  }}
                  className={styles.sortSelect}
                >
                  <option value="date-desc">
                    {language === 'zh' ? '最新优先' : 'Newest First'}
                  </option>
                  <option value="date-asc">
                    {language === 'zh' ? '最旧优先' : 'Oldest First'}
                  </option>
                  <option value="title">
                    {language === 'zh' ? '标题排序' : 'Title A-Z'}
                  </option>
                </select>
              </div>

              {/* 分类筛选 */}
              <div className={styles.categories}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''
                      }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? (language === 'zh' ? '全部' : 'All') : category}
                  </button>
                ))}
              </div>

              {/* 文章列表 */}
              <div className={styles.articlesList}>
                {filteredArticles.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📝</div>
                    <p className={styles.emptyText}>
                      {language === 'zh' ? '暂无匹配的文章' : 'No matching articles'}
                    </p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <article
                      key={article.slug}
                      className={`${styles.articleCard} ${article.slug === currentSlug ? styles.currentArticle : ''
                        }`}
                      onClick={() => handleArticleClick(article.slug)}
                      onMouseEnter={() => handleArticleHover(article.slug)}
                    >
                      <div className={styles.articleHeader}>
                        <div className={styles.articleMeta}>
                          <span className={styles.articleDate}>{formatDate(article.date)}</span>
                          <span className={styles.readTime}>
                            <span className={styles.readIcon}>⏱</span>
                            {article.readTime} {language === 'zh' ? '分钟' : 'min'}
                          </span>
                        </div>
                        <div className={styles.categoryBadge}>
                          {article.category}
                        </div>
                      </div>
                      <h4 className={styles.articleTitle}>{article.title}</h4>
                      <p className={styles.articleExcerpt}>{article.excerpt}</p>
                      <div className={styles.articleFooter}>
                        <div className={styles.articleTags}>
                          {article.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={styles.tag}>
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className={styles.moreTagsIndicator}>
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <div className={styles.readMoreIcon}>→</div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          ) : (
            // 目录视图
            <>
              {!isVisible || tocItems.length === 0 ? (
                <div style={{color: '#666', fontSize: '14px', textAlign: 'center', padding: '20px'}}>
                  {language === 'zh' ? '正在加载目录...' : 'Loading TOC...'}
                </div>
              ) : (
                <ul className={styles.tocList}>
                  {tocItems.map((item) => (
                    <li
                      key={item.id}
                      className={`${styles.tocItem} ${styles[`level${item.level}`]} ${activeId === item.id ? styles.active : ''
                        }`}
                    >
                      <button
                        className={styles.tocLink}
                        onClick={() => handleTOCClick(item.id)}
                        title={item.text}
                      >
                        <span className={styles.tocText}>{item.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </nav>
      </div>
    </div>
  );
}