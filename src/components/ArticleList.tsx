'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useLanguage} from '@/contexts/LanguageContext';
import {useScrollAnimation} from '@/hooks/useScrollAnimation';
import {trackEvent} from '@/lib/gtag';

import styles from '@/styles/components/ArticleList.module.css';

export interface Article {
  slug?: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  // 添加来源网站属性
  sourceSite?: string;
  // 添加远程文章标记
  isRemote?: boolean;
}

interface ArticleListProps {
  articles?: Article[];
  showCategories?: boolean;
  showSearch?: boolean;
}

export default function ArticleList({
  articles = [],
  showCategories = true,
  showSearch = true
}: ArticleListProps) {
  const {language} = useLanguage();
  const router = useRouter();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>(() => {
    // 从localStorage读取用户偏好，默认为最新优先
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('articleSortBy') as 'date-desc' | 'date-asc' | 'title') || 'date-desc';
    }
    return 'date-desc';
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set());
  const [shouldHide] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userManuallyToggled, setUserManuallyToggled] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [fabClickTimeout, setFabClickTimeout] = useState<NodeJS.Timeout | null>(null);

  // iOS检测
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const {elementRef: listRef, isVisible: isInView} = useScrollAnimation();

  // 使用传入的文章数据
  const finalArticles = articles;

  useEffect(() => {
    setIsVisible(finalArticles.length > 0);
    setFilteredArticles(finalArticles);
  }, [articles, language, finalArticles]);

  // 滚动监听，用于自动关闭文章列表
  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      setLastScrollTime(currentTime);

      // 如果用户正在滚动且没有hover，且没有手动切换过，则关闭列表
      if (!isHovering && !userManuallyToggled && isExpanded) {
        setIsExpanded(false);
      }
    };

    // 使用节流优化滚动性能
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, {passive: true});

    return () => window.removeEventListener('scroll', optimizedScrollHandler);
  }, [isHovering, userManuallyToggled, isExpanded]);

  // 滚动后自动关闭的定时器
  useEffect(() => {
    if (lastScrollTime === 0) return;

    const timer = setTimeout(() => {
      // 如果用户没有hover且没有手动操作，则关闭列表
      if (!isHovering && !userManuallyToggled && isExpanded) {
        setIsExpanded(false);
      }
    }, 2000); // 滚动停止2秒后自动关闭

    return () => clearTimeout(timer);
  }, [lastScrollTime, isHovering, userManuallyToggled, isExpanded]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (fabClickTimeout) {
        clearTimeout(fabClickTimeout);
      }
    };
  }, [fabClickTimeout]);


  useEffect(() => {
    let filtered = finalArticles;

    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // 搜索筛选
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 排序
    filtered = filtered.sort((a, b) => {
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

    setFilteredArticles(filtered);

    // 跟踪搜索事件（只在有搜索查询时）
    if (searchQuery.trim()) {
      trackEvent.searchQuery(searchQuery, filtered.length);
    }
  }, [selectedCategory, searchQuery, sortBy, finalArticles]);

  const categories = ['all', ...Array.from(new Set(finalArticles.map(article => article.category)))];

  const handleArticleClick = (article: Article, event?: React.MouseEvent) => {
    // 防止事件冒泡和默认行为
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // 防止重复点击
    if (animatingCards.has(article.slug || '')) {
      return;
    }

    // 添加到动画集合中，防止重复点击
    if (article.slug) {
      setAnimatingCards(prev => new Set(prev).add(article.slug!));
      setTimeout(() => {
        setAnimatingCards(prev => {
          const newSet = new Set(prev);
          newSet.delete(article.slug!);
          return newSet;
        });
      }, 500);
    }

    // 跟踪文章点击事件
    trackEvent.articleView(article.title, article.category);

    const thisArticle = article;

    if (thisArticle.isRemote) {
      // 跟踪外链点击
      trackEvent.externalLinkClick(thisArticle.slug || '', article.title);
      window.open(thisArticle.slug, '_blank');
    } else {
      // 使用Next.js的客户端路由，速度更快
      router.push(`/articles/${thisArticle.slug}`);
    }
    setIsMobileOpen(false);
  };

  // 预加载文章页面
  const handleArticleHover = (article: Article) => {
    if (!article.isRemote && article.slug) {
      router.prefetch(`/articles/${article.slug}`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsExpanded(true);
  }

  const handleMouseLeave = () => {
    setIsHovering(false);
    // 如果用户没有手动切换过，则在离开hover时关闭
    if (!userManuallyToggled) {
      setIsExpanded(false);
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // 添加类别切换动画效果
    const categoryButtons = document.querySelectorAll(`.${styles.categoryBtn}`);
    categoryButtons.forEach(btn => {
      btn.classList.add(styles.categoryTransition);
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setUserManuallyToggled(true);
  };

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

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* 桌面端侧边文章列表 */}
      <div
        ref={listRef}
        className={`${styles.desktopList} ${language === 'zh' ? styles.chineseFont : ''} ${isInView ? styles.fadeInUp : ''
          } ${shouldHide ? styles.hidden : ''} ${!isExpanded ? styles.collapsed : ''}`}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {/* 展开状态 */}
        <div className={`${styles.listContent} ${!isExpanded ? styles.fadeOut : ''}`}>
          <div className={styles.listHeader}>
            <div className={styles.headerTop}>
              <h3 className={styles.listTitle}>
                <span className={styles.titleIcon}>📚</span>
                {language === 'zh' ? '文章列表' : 'Articles'}
                <span className={styles.articleCount}>({filteredArticles.length})</span>
              </h3>
              {/* <button
                className={styles.toggleButton}
                onClick={toggleExpanded}
                aria-label={isExpanded ? 'Collapse articles' : 'Expand articles'}
                title={isExpanded ? 
                  (language === 'zh' ? '折叠列表' : 'Collapse') : 
                  (language === 'zh' ? '展开列表' : 'Expand')
                }
              >
                <span className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}>
                  {isExpanded ? '−' : '+'}
                </span>
              </button> */}
            </div>

            {showSearch && (
              <div className={`${styles.searchBox} ${isSearchFocused ? styles.searchFocused : ''}`}>
                <div className={styles.searchIcon}>🔍</div>
                <input
                  type="text"
                  placeholder={language === 'zh' ? '搜索文章、标签...' : 'Search articles, tags...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
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
            )}

            {/* 排序选择器 */}
            {/* <div className={styles.sortContainer}>
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
            </div> */}

            {showCategories && (
              <div className={styles.categories}>
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''
                      }`}
                    onClick={() => handleCategoryChange(category)}
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    {category === 'all' ? (language === 'zh' ? '全部' : 'All') : category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.articlesList}>
            {filteredArticles.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <p className={styles.emptyText}>
                  {language === 'zh' ? '暂无匹配的文章' : 'No matching articles'}
                </p>
              </div>
            ) : (
              filteredArticles.map((article, index) => (
                <article
                  key={article.slug}
                  className={`${styles.articleCard} ${article.slug && animatingCards.has(article.slug) ? styles.cardClicked : ''
                    }`}
                  onClick={(e) => handleArticleClick(article, e)}
                  onMouseEnter={() => handleArticleHover(article)}
                  style={{animationDelay: `${index * 100}ms`}}
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
                  {article.excerpt && article.excerpt !== 'No excerpt available' ? (
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                  ) : (
                    <p className={styles.sourceInfo}>
                      <span className={styles.sourceIcon}>🔗</span>
                      {language === 'zh' ? '来自' : 'From'} {article.sourceSite ? article.sourceSite : ''}
                    </p>
                  )}
                  <div className={styles.articleFooter}>
                    <div className={styles.articleTags}>
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className={styles.moreTagsIndicator}>
                          +{article.tags.length - 3}
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

        {/* 折叠状态的圆形按钮 */}
        <div className={`${styles.collapsedButton} ${isExpanded ? styles.fadeOut : ''}`}>
          <button
            className={styles.collapsedToggle}
            onClick={toggleExpanded}
            onMouseEnter={handleMouseEnter}
            aria-label="Expand articles"
            title={language === 'zh' ? '展开列表' : 'Expand'}
          >
            {language === 'zh' ? '文章' : 'Articles'}
          </button>
        </div>
      </div>
    </>
  );
}
