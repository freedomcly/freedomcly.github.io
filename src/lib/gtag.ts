// Google Analytics配置
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// 检查是否在生产环境且有GA ID
export const isGAEnabled = GA_TRACKING_ID && process.env.NODE_ENV === 'production';

// 页面浏览事件
export const pageview = (url: string) => {
  if (!isGAEnabled) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  });
};

// 自定义事件
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!isGAEnabled) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// 预定义的事件类型
export const trackEvent = {
  // 文章相关
  articleView: (articleTitle: string, category: string) => {
    event({
      action: 'article_view',
      category: 'Article',
      label: `${category} - ${articleTitle}`,
    });
  },
  
  articleComplete: (articleTitle: string, readTime: number) => {
    event({
      action: 'article_complete',
      category: 'Article',
      label: articleTitle,
      value: readTime,
    });
  },
  
  articleShare: (articleTitle: string, platform: string) => {
    event({
      action: 'article_share',
      category: 'Article',
      label: `${platform} - ${articleTitle}`,
    });
  },
  
  // 交互相关
  languageSwitch: (fromLang: string, toLang: string) => {
    event({
      action: 'language_switch',
      category: 'UI',
      label: `${fromLang} to ${toLang}`,
    });
  },
  
  themeSwitch: (theme: string) => {
    event({
      action: 'theme_switch',
      category: 'UI',
      label: theme,
    });
  },
  
  searchQuery: (query: string, resultsCount: number) => {
    event({
      action: 'search_query',
      category: 'Search',
      label: query,
      value: resultsCount,
    });
  },
  
  articleListExpand: (location: string) => {
    event({
      action: 'article_list_expand',
      category: 'UI',
      label: location, // 'desktop' or 'mobile'
    });
  },
  
  // 导航相关
  externalLinkClick: (url: string, linkText: string) => {
    event({
      action: 'external_link_click',
      category: 'Navigation',
      label: `${linkText} - ${url}`,
    });
  },
  
  contactFormSubmit: (method: string) => {
    event({
      action: 'contact_form_submit',
      category: 'Contact',
      label: method, // 'email' or 'github'
    });
  },
  
  // 性能相关
  scrollDepth: (percentage: number, page: string) => {
    event({
      action: 'scroll_depth',
      category: 'Engagement',
      label: page,
      value: percentage,
    });
  },
};

// 类型声明
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}