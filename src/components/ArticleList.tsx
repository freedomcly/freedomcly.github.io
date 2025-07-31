'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { trackEvent } from '@/lib/gtag';

import styles from '@/styles/components/ArticleList.module.css';

interface Article {
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
  const { language } = useLanguage();
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
  const [animatingCards] = useState<Set<string>>(new Set());
  const [shouldHide] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [hasLeftFirstScreen, setHasLeftFirstScreen] = useState(false);
  const [userManuallyToggled, setUserManuallyToggled] = useState(false);
  
  const { elementRef: listRef, isVisible: isInView } = useScrollAnimation();

  // 使用传入的文章数据
  const finalArticles = articles;

  useEffect(() => {
    setIsVisible(finalArticles.length > 0);
    setFilteredArticles(finalArticles);
  }, [articles, language, finalArticles]);

  // 滚动监听，检测首屏状态和故事部分
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // 检测是否在首屏（滚动距离小于一个屏幕高度的30%）
      const isInFirstScreen = scrollY < windowHeight * 0.3;
      
      // 记录用户是否已经离开过首屏
      if (!isInFirstScreen && !hasLeftFirstScreen) {
        setHasLeftFirstScreen(true);
      }
      
      // 只在初次加载且在首屏时自动展开，且用户没有手动操作过
      if (isInFirstScreen && !hasLeftFirstScreen && !userManuallyToggled) {
        setIsExpanded(true);
        console.log('111')
      }
      // 如果离开首屏且用户没有手动展开，则折叠
      else if (!isInFirstScreen && !userManuallyToggled) {
        setIsExpanded(false);
      }
      
      // 查找故事容器元素 - 使用更精确的选择器
      // const storiesContainer = document.querySelector('[class*="storiesContainer"]');
      // if (storiesContainer) {
      //   const rect = storiesContainer.getBoundingClientRect();
        
      //   // 当故事部分进入视口上半部分时开始隐藏文章列表
      //   // 使用更宽松的条件，让隐藏效果更早触发
      //   if (rect.top <= windowHeight * 0.6 && rect.bottom >= windowHeight * 0.1) {
      //     setShouldHide(true);
      //   } else {
      //     setShouldHide(false);
      //   }
      // }
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

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    handleScroll(); // 初始检查
    
    return () => window.removeEventListener('scroll', optimizedScrollHandler);
  }, []);
  // TODO 学习

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

  const handleArticleClick = (article: Article) => {
    // 跟踪文章点击事件
    trackEvent.articleView(article.title, article.category);
    
    // 添加点击动画
    // setAnimatingCards(prev => new Set(prev).add(article.slug));
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

  const setHoveredTrue = () => {
    setIsExpanded(true);
  }

  const setHoveredFalse = () => {
    setIsExpanded(false);
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
        className={`${styles.desktopList} ${language === 'zh' ? styles.chineseFont : ''} ${
          isInView ? styles.fadeInUp : ''
        } ${shouldHide ? styles.hidden : ''} ${!isExpanded ? styles.collapsed : ''}`}
        onMouseLeave={() => setHoveredFalse()}
        onMouseEnter={() => setHoveredTrue()}
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
              <button
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
              </button>
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
                    className={`${styles.categoryBtn} ${
                      selectedCategory === category ? styles.active : ''
                    }`}
                    onClick={() => handleCategoryChange(category)}
                    style={{ animationDelay: `${index * 50}ms` }}
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
                  className={`${styles.articleCard} ${
                    article.slug && animatingCards.has(article.slug) ? styles.cardClicked : ''
                  }`}
                  onClick={() => handleArticleClick(article)}
                  onMouseEnter={() => handleArticleHover(article)}
                  style={{ animationDelay: `${index * 100}ms` }}
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
            onMouseEnter={() => setHoveredTrue()}  // 添加鼠标进入事件
            aria-label="Expand articles"
            title={language === 'zh' ? '展开列表' : 'Expand'}
          >
            {language === 'zh' ? '文章' : 'Articles'}
          </button>
        </div>
      </div>

      {/* 移动端悬浮按钮 */}
      <div className={`${styles.mobileList} ${shouldHide ? styles.hidden : ''}`}>
        <button
          className={`${styles.fabButton} ${isMobileOpen ? styles.fabOpen : ''}`}
          onClick={() => {
            const wasOpen = isMobileOpen;
            setIsMobileOpen(!isMobileOpen);
            if (!isExpanded) {
              setIsExpanded(true);
              setUserManuallyToggled(true);
            }
            
            // 跟踪文章列表展开事件
            if (!wasOpen) {
              trackEvent.articleListExpand('mobile');
            }
          }}
          aria-label={language === 'zh' ? '文章列表' : 'Article List'}
        >
          <span className={styles.fabIcon}>📚</span>
          <span className={styles.fabBadge}>{filteredArticles.length}</span>
        </button>

        {/* 移动端抽屉 */}
        <div className={`${styles.mobileDrawer} ${isMobileOpen ? styles.drawerOpen : ''}`}>
          <div className={styles.drawerHandle}></div>
          <div className={styles.drawerHeader}>
            <div className={styles.drawerTitleSection}>
              <span className={styles.drawerTitle}>
                📚 {language === 'zh' ? '文章列表' : 'Articles'}
              </span>
              <span className={styles.drawerCount}>({filteredArticles.length})</span>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          
          <div className={styles.drawerContent}>
            {showSearch && (
              <div className={`${styles.mobileSearch} ${isSearchFocused ? styles.searchFocused : ''}`}>
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

            {/* 移动端排序选择器 */}
            <div className={styles.mobileSortContainer}>
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

            {showCategories && (
              <div className={styles.mobileCategories}>
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`${styles.categoryBtn} ${
                      selectedCategory === category ? styles.active : ''
                    }`}
                    onClick={() => handleCategoryChange(category)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {category === 'all' ? (language === 'zh' ? '全部' : 'All') : category}
                  </button>
                ))}
              </div>
            )}
            
            <div className={styles.mobileArticlesList}>
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
                    className={`${styles.mobileArticleCard} ${
                      article.slug && animatingCards.has(article.slug) ? styles.cardClicked : ''
                    }`}
                    onClick={() => handleArticleClick(article)}
                    onMouseEnter={() => handleArticleHover(article)}
                    style={{ animationDelay: `${index * 100}ms` }}
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
        </div>

        {/* 遮罩层 */}
        {isMobileOpen && (
          <div 
            className={`${styles.overlay} ${isMobileOpen ? styles.overlayVisible : ''}`}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </div>
    </>
  );
}
