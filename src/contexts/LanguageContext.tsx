'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';
import { trackEvent } from '@/lib/gtag';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'nav.home': 'I am',
    'nav.about': 'Frontend Engineer',
    'nav.ai': 'AI Explorer',
    'nav.projects': 'Secret Identity',
    'nav.contact': '11',

    // Hero section
    'hero.greeting': 'Hi, I\'m Tracy.Cui',
    'hero.title1': 'Frontend Engineer',
    'hero.title2': 'Pixel & Performance Perfectionist',
    'hero.desc1': 'Weaving dreams with code for 10+ years',
    'hero.desc2': 'An innovative practitioner combining technical expertise with multidisciplinary thinking',
    'hero.desc3': 'Strong curiosity, strong learning ability, embracing all possibilities and changes',
    'hero.cta': 'Let\'s create something amazing together',

    // About section
    'about.title': 'Stories about Frontend',
    'about.intro': 'Passionate about development and building, always serving as a bridge for human-computer interaction, I call myself a human-machine intent interpreter.',
    'about.journey': 'My Journey',
    'about.story1': '� Guraduated from University of Electronic Science and Technology of China (985 undergraduate) in 2014.',
    'about.story2': '💡 From 2014-2021, I joined several well-known internet companies: Meituan, Innovation Works, Vivo, Futu, etc., participating in polishing multiple products. While advancing my frontend skills, I also accumulated rich project experience.',
    'about.story3': '✨ In 2021, I quit my 995 job and started my digital nomad journey, taking orders on Upwork, continuously consolidating technical advantages, and keeping up with overseas technology trends. This greatly expanded my technical breadth and independence in problem-solving, evolving from frontend to full-stack.',
    'about.story4': '🌟 During my digital nomad period from 2021-2025, I sought the combination of technology and business. Leveraging my advantages, I independently built cross-border e-commerce operation platforms and successfully operated multiple cross-border e-commerce stores independently.',
    'about.story5': '🤝 Why start anew? I have completed my self-exploration in stages, and because AI has reached the stage of large-scale application recently, I very much hope to find partners to team up and participate in this iteration. I am more mature and resilient than my former self, hoping to become a steadfast and reliable teammate.',
    'about.philosophy': 'Cherishing every minute of the present to build and create is the greatest source of happiness and the greatest risk mitigation.',
    'about.caption': 'Typical INTP: Curious, Rational, Open, Independent',

    // AI Stories section
    'aiStories.title': 'AI Exploration Journey',
    'aiStories.intro': 'The "two-dimensionalization" impact of AI on the internet industry is already underway; the closer you are to it, the sooner you\'ll feel the change.',
    'aiStories.story1': 'More than ten years ago, I read a book "The Singularity Is Near" and watched the movie Interstellar around the same time, wanting to have a TARS intelligent agent.',
    'aiStories.story2': 'A few years ago, I watched Andrej Karpathy\'s videos on YouTube and started researching AI.',
    'aiStories.story3': 'A year ago, I integrated Gemini and OpenAI into the e-commerce operation platform I was responsible for, using them to automatically generate product titles and descriptions for multiple countries, and using AI for automatic pricing.',
    'aiStories.story4': 'A few months ago, I participated in creating an AI agent for the construction industry (based on the open-source frontend and backend framework open-webui). Its frontend part uses the Svelte framework, which is similar to Vue that I\'m most familiar with, so I got started easily. The entire project gave me the joy and sense of achievement of participating in creating Agent applications, while experiencing how the human-computer interaction paradigm I\'m familiar with is changing - human-computer interaction is no longer limited to interaction between humans and interfaces.',
    'aiStories.story5': 'Recently, I\'ve turned Cursor and Kiro into my TARS. I believe all industries will be reshaped by AI.',
    'skills.title': 'Skills',
    'skills.language': 'Programming Languages',
    'skills.frameworks': 'Frameworks',
    'skills.extensions': 'Extended Skills',

    // Projects section
    'projects.title': 'Featured Projects',
    'projects.meituan.title': 'Meituan (NASDAQ: MPNGY | Top O2O Platform)',
    'projects.meituan.desc': 'A Vue-based mobile website mainly used for the entire hotel booking process.',
    'projects.dada.title': 'Dada (NASDAQ: DADA | Top Delivery Platform)',
    'projects.dada.desc': 'React-based intra-city express delivery service.',
    'projects.wemart.title': 'Wemart (Shopify-like Startup Project)',
    'projects.wemart.desc': 'Creating a series of tools for e-commerce.',

    // Contact section
    'contact.title': 'Get in Touch',
    'contact.github': 'GitHub',
    'contact.email': 'Email Me',
    'contact.linkedin': 'LinkedIn',
    'contact.email.desc': 'Fastest way to reach me',
    'contact.github.desc': 'Check out my code',
    'contact.linkedin.desc': 'Professional profile',
  },
  zh: {
    // Header
    'nav.home': '我是',
    'nav.about': '前端工程师',
    'nav.ai': 'AI 探索者',
    'nav.projects': '隐藏身份',
    'nav.contact': '11',

    // Hero section
    'hero.greeting': '你好，我是 Tracy.Cui',
    'hero.title1': '前端工程师',
    'hero.title2': '像素 & 性能完美主义者',
    'hero.desc1': '用代码编织梦想已有 10+ 年',
    'hero.desc2': '融合技术专长与多领域思维的创新实践者',
    'hero.desc3': '好奇心强 学习力强 拥抱一切可能与变化',
    'hero.cta': '一起创造些美好的东西',

    // About section
    'about.title': '关于前端的故事',
    'about.intro': '对开发与构建充满热情，一直作为人机交互的桥梁，自称人机意图解读师。',
    'about.journey': '我的历程',
    'about.story1': '🚀 2014 年毕业于电子科技大学(985 本科)。',
    'about.story2': '💡 2014-2021 年，曾加入多家知名互联网公司：美团、创新工场、vivo、富途等，参与打磨多款产品，前端技术精进的同时，也积累了丰富的项目经验。',
    'about.story3': '✨ 2021 年辞去 995 的工作，开始数字游民经历，在 upwork 接单，不断地沉淀技术优势，并且紧跟海外技术趋势。这极大拓展了我的技术广度和解决问题的独立性，从前端走向全栈。',
    'about.story4': '🌟 2021-2025 年数字游民期间，寻找技术与商业的结合。利用自身优势，独立搭建跨境电商运营平台，成功独立经营多家跨境电商店铺。',
    'about.story5': '🤝 为何重新出发？我已经阶段性完成了自我的探索，同时因为最近 AI 到了大规模应用阶段，我非常希望能寻找同伴组队，参与本次迭代。我比曾经的自己更加成熟也更加抗压，希望能成为一个坚定可靠的队友。',
    'about.philosophy': '珍惜当下每一分钟，去构建去创造，是最大的幸福来源，也是最大的风险规避。',
    'about.caption': '典型的 INTP：好奇 理性 开放 独立',

    // AI Stories section
    'aiStories.title': 'AI 探索之旅',
    'aiStories.story1': '十几年前读过一本书《奇点临近》，同一时期看了电影星际穿越，想要拥有一个 TARS 智能体。',
    'aiStories.story2': '几年前在 Youtube 上看了 Andrej Karpathy 的视频，开始研究 AI。',
    'aiStories.story3': '一年前我把 gemini 和 openai 接入了我负责的电商运营平台，用来自动生成多国家的商品标题、描述，并用 AI 自动定价。',
    'aiStories.story4': '几个月前参与制作建筑行业 AI agent（基于开源前后端框架 open-webui），它的前端部分是 svelte 框架，与我最熟悉的 vue 类似，因此我上手比较容易。整个项目让我体验到参与创建 Agent 应用的乐趣和成就感，同时体会到我所熟悉的人机交互范式在改变，人机交互不再局限于人与界面的交互。',
    'aiStories.story5': '最近我把 cursor 和 kiro 变成了我的 TARS，我相信各行各业都会被 AI 重塑。',
    'aiStories.intro': '认识 AI 对互联网行业的“二向箔”打击，其实二维化早已开始了，离它越近越先改变。',
    'skills.title': '技能',
    'skills.language': '编程语言',
    'skills.frameworks': '框架',
    'skills.extensions': '扩展技能',

    // Projects section
    'projects.title': '精选项目',
    'projects.meituan.title': '美团 (纳斯达克: MPNGY | 顶级 O2O 平台)',
    'projects.meituan.desc': '基于 Vue 的移动端网站，主要用于酒店预订的整个流程。',
    'projects.dada.title': '达达 (纳斯达克: DADA | 顶级配送平台)',
    'projects.dada.desc': '基于 React 的同城快递配送服务。',
    'projects.wemart.title': 'Wemart (类似 Shopify 的创业项目)',
    'projects.wemart.desc': '为电子商务创建一系列工具。',

    // Contact section
    'contact.title': '联系我',
    'contact.github': 'GitHub',
    'contact.email': '邮箱联系',
    'contact.linkedin': 'LinkedIn',
    'contact.email.desc': '最快的联系方式',
    'contact.github.desc': '查看我的代码',
    'contact.linkedin.desc': '专业档案',
  }
};

export function LanguageProvider({children}: {children: React.ReactNode}) {
  // 默认设置为中文，避免闪烁
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    // 延迟语言检测，避免闪烁
    const timer = setTimeout(() => {
      // 从localStorage读取保存的语言设置
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
        setLanguage(savedLanguage);
        return;
      }

      // 检测浏览器语言
      const browserLanguage = navigator.language.toLowerCase();
      if (browserLanguage.startsWith('en')) {
        setLanguage('en');
      }
      // 默认保持中文，不需要额外设置
    }, 100); // 100ms延迟，让页面先渲染

    return () => clearTimeout(timer);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    const previousLanguage = language;
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // 跟踪语言切换事件
    if (previousLanguage !== lang) {
      trackEvent.languageSwitch(previousLanguage, lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage: handleSetLanguage, t}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}