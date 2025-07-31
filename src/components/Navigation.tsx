'use client';

import {useLanguage} from '@/contexts/LanguageContext';
import {useState, useEffect, useCallback} from 'react';
import styles from '@/styles/components/Navigation.module.css';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const {t, language} = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const router = useRouter();
  const pathname = usePathname();

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

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    handleScroll(); // 初始调用
    
    return () => window.removeEventListener('scroll', optimizedScrollHandler);
  }, [handleScroll]);

  // 平滑滚动到指定区块
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // 考虑导航栏高度
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    // 关闭移动端菜单
    setIsMobileMenuOpen(false);
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 修改导航项点击处理
  const handleNavItemClick = (itemId: string) => {
    // 判断是否在文章页面
    const isArticlePage = pathname?.startsWith('/articles/') || false;
    
    if (itemId === 'projects') {
      // 跳转到目标文章页面
      router.push('/articles/zumba');
    } else if (isArticlePage) {
      // 文章页面：跳转到首页对应锚点
      router.push(`/#${itemId}`);
    } else {
      // 首页：保留滚动行为
      scrollToSection(itemId);
    }
  };
  
  // 导航项配置
  const navItems = [
    { id: 'about', icon: '💻', identity: 'identity1', label: t('nav.about') },
    { id: 'ai', icon: '🤖', identity: 'identity2', label: t('nav.ai') },
    { id: 'projects', icon: '💃', identity: 'identity3', label: t('nav.projects') }
  ];

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''} ${language === 'zh' ? 'chineseFont' : ''}`}>
        {/* 滚动进度条 */}
        <div 
          className={styles.progressBar}
          style={{ width: `${scrollProgress}%` }}
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
            <span className={styles.navLabel}>{t('nav.home')}</span>
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

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''} ${language === 'zh' ? 'chineseFont' : ''}`}>
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileMenuHeader}>
            <span className={styles.mobileMenuTitle}>
              {language === 'zh' ? '导航菜单' : 'Navigation'}
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
              onClick={() => scrollToSection('home')}
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
          </nav>

          <div className={styles.mobileMenuActions}>
            <a
              href="mailto:freedomcly@gmail.com"
              className={styles.mobileContactBtn}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('hero.cta')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}