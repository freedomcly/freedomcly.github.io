'use client';

import {useLanguage} from '@/contexts/LanguageContext';
import {useState, useEffect, useCallback, useRef} from 'react';
import styles from '@/styles/components/Navigation.module.css';
import {useRouter, usePathname} from 'next/navigation';
import {getArticlesForLanguage} from '@/lib/articles-client';
import {trackEvent} from '@/lib/gtag';
import {debugLog} from '@/utils/logger';

interface Article {
  slug?: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  sourceSite?: string;
  isRemote?: boolean;
}

export default function Navigation() {
  const {t, language} = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();
  const pathname = usePathname();

  // 文章相关状态
  const [articles, setArticles] = useState<Article[]>([]);
  const [showMobileArticles, setShowMobileArticles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // 用于存储滚动位置的ref
  const scrollPositionRef = useRef<number>(0);

  // 优化的滚动处理
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 设置滚动状态
    setIsScrolled(scrollY > 20);

    // 计算滚动进度
    const progress = Math.min((scrollY / (documentHeight - windowHeight)) * 100, 100);
    setScrollProgress(progress);

    // 检测当前活跃区块
    const sections = ['home', 'about', 'ai', 'projects'];
    let currentSection = 'home';

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          currentSection = sectionId;
        }
      }
    });

    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    // 使用 requestAnimationFrame 优化滚动性能
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
    handleScroll(); // 初始调用

    return () => window.removeEventListener('scroll', optimizedScrollHandler);
  }, [handleScroll]);

  // 获取文章数据
  useEffect(() => {
    const fetchArticles = () => {
      const articleData = getArticlesForLanguage(language);
      setArticles(articleData);
      setFilteredArticles(articleData);
    };

    fetchArticles();
  }, [language]);

  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  // 文章点击处理
  const handleArticleClick = (article: Article) => {
    trackEvent.articleView(article.title, article.category);

    if (article.isRemote) {
      trackEvent.externalLinkClick(article.slug || '', article.title);
      window.open(article.slug, '_blank');
    } else {
      router.push(`/articles/${article.slug}`);
    }

    // 关闭所有弹窗
    setIsMobileMenuOpen(false);
    setShowMobileArticles(false);
  };

  // 处理文章列表按钮点击
  const handleArticlesButtonClick = () => {
    setIsMobileMenuOpen(false); // 收起导航栏
    setShowMobileArticles(true); // 显示文章列表
    setSearchQuery(''); // 清除搜索
  };

  // 关闭文章列表
  const handleCloseArticlesList = () => {
    setShowMobileArticles(false);
    setSearchQuery(''); // 清除搜索
  };

  // 控制body滚动 - 文章列表和移动端菜单
  useEffect(() => {
    const shouldLockScroll = showMobileArticles || isMobileMenuOpen;

    if (shouldLockScroll) {
      // 保存当前滚动位置
      scrollPositionRef.current = window.scrollY;

      // 禁止body滚动
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.left = '0';

      // 添加CSS类用于额外的样式控制
      document.body.classList.add('scroll-locked');
    } else {
      // 恢复body滚动
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';

      // 移除CSS类
      document.body.classList.remove('scroll-locked');

      // 恢复滚动位置
      if (scrollPositionRef.current > 0) {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = 0;
      }
    }

    // 清理函数
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';
      document.body.classList.remove('scroll-locked');

      // 如果组件卸载时还有保存的滚动位置，恢复它
      if (scrollPositionRef.current > 0) {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = 0;
      }
    };
  }, [showMobileArticles, isMobileMenuOpen]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'zh') {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // 平滑滚动到指定区块
  const scrollToSection = (sectionId: string) => {
    debugLog('scrollToSection called with:', sectionId);

    // 先关闭移动端菜单，这会触发滚动解锁
    setIsMobileMenuOpen(false);

    // 如果当前处于滚动锁定状态，需要先解锁
    const wasScrollLocked = document.body.classList.contains('scroll-locked');
    debugLog('Was scroll locked:', wasScrollLocked);

    if (wasScrollLocked) {
      // 立即解锁滚动
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.left = '';
      document.body.classList.remove('scroll-locked');

      // 恢复滚动位置
      if (scrollPositionRef.current > 0) {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = 0;
      }
    }

    // 使用setTimeout确保DOM更新完成后再执行滚动
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      debugLog('Target element found:', !!element);
      if (element) {
        const offsetTop = element.offsetTop - 80; // 考虑导航栏高度
        debugLog('Scrolling to offset:', offsetTop);

        // 尝试多种滚动方法
        try {
          // 方法1: 使用smooth滚动
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        } catch (error) {
          debugLog('Smooth scroll failed, trying alternative:', error);
          // 方法2: 直接滚动
          window.scrollTo(0, offsetTop);
        }

        // 方法3: 使用原生锚点作为备选
        setTimeout(() => {
          if (Math.abs(window.scrollY - offsetTop) > 50) {
            debugLog('Scroll didn\'t work, using hash navigation');
            window.location.hash = sectionId;
          }
        }, 1000);
      } else {
        // 如果找不到元素，直接使用hash导航
        debugLog('Element not found, using hash navigation');
        window.location.hash = sectionId;
      }
    }, wasScrollLocked ? 300 : 100); // 给更多时间确保解锁完成
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 修改导航项点击处理
  const handleNavItemClick = (itemId: string) => {
    debugLog('handleNavItemClick called with:', itemId);

    // 判断是否在文章页面
    const isArticlePage = pathname?.startsWith('/articles/') || false;
    debugLog('Is article page:', isArticlePage);

    if (itemId === 'projects') {
      // 关闭移动端菜单
      setIsMobileMenuOpen(false);
      // 跳转到目标文章页面
      router.push('/articles/zumba');
    } else if (isArticlePage) {
      // 关闭移动端菜单
      setIsMobileMenuOpen(false);
      // 文章页面：跳转到首页对应锚点
      router.push(`/#${itemId}`);
    } else {
      // 首页：使用滚动行为（scrollToSection会处理菜单关闭）
      scrollToSection(itemId);
    }
  };

  // 导航项配置
  const navItems = [
    {id: 'about', icon: '💻', identity: 'identity1', label: t('nav.about')},
    {id: 'ai', icon: '🤖', identity: 'identity2', label: t('nav.ai')},
    {id: 'projects', icon: '💃', identity: 'identity3', label: t('nav.projects')}
  ];

  const isArticlePage = pathname?.startsWith('/articles/') || false;

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''} ${isArticlePage ? styles.articlePageNav : ''} ${language === 'zh' ? 'chineseFont' : ''}`}>
        {/* 滚动进度条 */}
        <div
          className={styles.progressBar}
          style={{width: `${scrollProgress}%`}}
        />

        <div className={styles.container}>
          {/* Logo/Name */}
          <button
            className={styles.logo}
            onClick={() => {
              const isArticlePage = pathname?.startsWith('/articles/') || false;
              if (isArticlePage) {
                router.push('/');
              } else {
                scrollToSection('home');
              }
            }}
            aria-label="Go to home section"
          >
            <div className={styles.logoContainer}>
              <span className={styles.logoText}>
                Hello <span className={styles.logoName}>Tracy</span>
              </span>
              <div className={styles.logoUnderline} />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className={styles.navLinks}>
            <span className={`${styles.navLabel} ${isArticlePage ? styles.articleLabel : ''}`}>
              {isArticlePage ?
                (language === 'zh' ? '文章' : 'Article') :
                t('nav.home')
              }
            </span>
            {navItems.map((item) => (
              <div key={item.id} className={styles.navItem}>
                <span className={styles.arrow}>→</span>
                <button
                  className={`${styles.navLink} ${styles[item.identity]} ${activeSection === item.id ? styles.active : ''}`}
                  onClick={() => handleNavItemClick(item.id)}
                  aria-label={`Go to ${item.label} section`}
                >
                  <span className={styles.identityIcon}>{item.icon}</span>
                  <span className={styles.navLinkText}>{item.label}</span>
                  <div className={styles.navLinkBg} />
                </button>
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className={styles.navAction}>
            <button
              className={styles.contactBtn}
              onClick={() => {
                const isArticlePage = pathname?.startsWith('/articles/') || false;
                if (isArticlePage) {
                  router.push('/#contact');
                } else {
                  scrollToSection('contact');
                }
              }}
              aria-label="Go to contact section"
            >
              <span className={styles.contactBtnText}>{t('hero.cta')}</span>
              <div className={styles.contactBtnBg} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.open : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* 移动端文章列表遮罩 */}
      <div
        className={`${styles.articlesOverlay} ${showMobileArticles ? styles.open : ''}`}
        onClick={handleCloseArticlesList}
      />

      {/* 移动端文章列表 */}
      <div className={`${styles.mobileArticlesList} ${showMobileArticles ? styles.open : ''} ${language === 'zh' ? 'chineseFont' : ''}`}>
        {/* 顶部拖拽指示器 */}
        <div className={styles.dragIndicator}></div>

        <div className={styles.articlesListContent}>
          {/* 简化的头部 */}
          <div className={styles.articlesListHeader}>
            <div className={styles.headerLeft}>
              <h2 className={styles.articlesListTitle}>
                📚 {language === 'zh' ? '文章列表' : 'Articles'}
              </h2>
              <span className={styles.articlesCount}>{filteredArticles.length} {language === 'zh' ? '篇' : 'articles'}</span>
            </div>
            <button
              className={styles.closeButton}
              onClick={handleCloseArticlesList}
              aria-label="Close articles list"
            >
              <span className={styles.closeIcon}></span>
            </button>
          </div>

          {/* 优化的搜索框 */}
          {/* <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder={language === 'zh' ? '搜索文章标题、标签...' : 'Search articles, tags...'}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div> */}

          {/* 优化的文章列表 */}
          <div className={styles.articlesGrid}>
            {filteredArticles.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  {searchQuery ? '🔍' : '📝'}
                </div>
                <h3 className={styles.emptyTitle}>
                  {searchQuery ?
                    (language === 'zh' ? '未找到相关文章' : 'No articles found') :
                    (language === 'zh' ? '暂无文章' : 'No articles yet')
                  }
                </h3>
                <p className={styles.emptyDescription}>
                  {searchQuery ?
                    (language === 'zh' ? '尝试使用其他关键词搜索' : 'Try different keywords') :
                    (language === 'zh' ? '文章正在准备中...' : 'Articles coming soon...')
                  }
                </p>
              </div>
            ) : (
              filteredArticles.map((article, index) => (
                <article
                  key={article.slug || index}
                  className={styles.articleCard}
                  onClick={() => handleArticleClick(article)}
                  style={{
                    animationDelay: `${index * 80}ms`,
                    '--index': index
                  } as React.CSSProperties}
                >
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.categoryTag}>
                        {article.category}
                      </span>
                      <span className={styles.dateText}>
                        {formatDate(article.date)}
                      </span>
                    </div>

                    <h3 className={styles.cardTitle} style={{
                      color: '#1e293b',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      lineHeight: '1.4',
                      display: 'block'
                    }}>
                      {article.title}
                    </h3>

                    {article.excerpt && article.excerpt !== 'No excerpt available' && article.excerpt !== 'Remote article - click to read more' ? (
                      <p className={styles.cardExcerpt} style={{
                        color: '#64748b',
                        fontSize: '0.9rem',
                        margin: '0 0 16px 0',
                        lineHeight: '1.5',
                        display: 'block'
                      }}>
                        {article.excerpt}
                      </p>
                    ) : (
                      <p className={styles.cardSource} style={{
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        margin: '0 0 16px 0',
                        fontStyle: 'italic',
                        display: 'block'
                      }}>
                        🔗 {language === 'zh' ? '来自' : 'From'} {article.sourceSite || 'External'}
                      </p>
                    )}

                    <div className={styles.cardFooter}>
                      <div className={styles.cardTags}>
                        {article.tags.slice(0, 4).map(tag => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 4 && (
                          <span className={styles.moreTag}>
                            +{article.tags.length - 4}
                          </span>
                        )}
                      </div>
                      {/* <div className={styles.readTime}>
                        ⏱ {article.readTime}{language === 'zh' ? '分钟' : 'min'}
                      </div> */}
                    </div>
                  </div>

                  <div className={styles.cardGlow}></div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''} ${language === 'zh' ? 'chineseFont' : ''}`}>
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileMenuHeader}>
            <span className={styles.mobileMenuTitle}>
              {isArticlePage ?
                (language === 'zh' ? '文章导航' : 'Article Navigation') :
                (language === 'zh' ? '导航菜单' : 'Navigation')
              }
            </span>
            <button
              className={styles.mobileMenuClose}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className={styles.mobileNavLinks}>
            <button
              className={`${styles.mobileNavLink} ${activeSection === 'home' ? styles.active : ''}`}
              onClick={() => {
                const isArticlePage = pathname?.startsWith('/articles/') || false;
                if (isArticlePage) {
                  setIsMobileMenuOpen(false);
                  router.push('/');
                } else {
                  scrollToSection('home');
                }
              }}
            >
              <span className={styles.mobileNavIcon}>🏠</span>
              <span className={styles.mobileNavText}>{t('nav.home')}</span>
            </button>

            {navItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.mobileNavLink} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => handleNavItemClick(item.id)}
              >
                <span className={styles.mobileNavIcon}>{item.icon}</span>
                <span className={styles.mobileNavText}>{item.label}</span>
              </button>
            ))}

            {/* 文章列表按钮 */}
            <button
              className={`${styles.mobileNavLink} ${styles.articlesButton}`}
              onClick={handleArticlesButtonClick}
            >
              <span className={styles.mobileNavIcon}>📚</span>
              <span className={styles.mobileNavText}>
                {language === 'zh' ? '文章列表' : 'Articles'} ({articles.length})
              </span>
            </button>
          </nav>



          {/* <div className={styles.mobileMenuActions}>
            <a
              href="mailto:freedomcly@gmail.com"
              className={styles.mobileContactBtn}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('hero.cta')}
            </a>
          </div> */}
        </div>
      </div>
    </>
  );
}