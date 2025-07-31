'use client';

import Image from 'next/image';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FEStorySection from '@/components/FEStorySection';
import AIStorySection from '@/components/AIStorySection';
import ContactSection from '@/components/ContactSection';
import ProjectsSection from '@/components/ProjectsSection';
import SettingsPanel from '@/components/SettingsPanel';
import ArticleList from '@/components/ArticleList';
import {useLanguage} from '@/contexts/LanguageContext';
import {useState, useEffect} from 'react';

import styles from '@/styles/pages/home.module.css';

export default function Home() {
  const {language} = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    // 动态导入客户端版本的文章获取函数
    import('@/lib/articles-client').then(({getArticlesForLanguage}) => {
      const currentArticles = getArticlesForLanguage(language);
      setArticles(currentArticles);
    });
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Navigation />

      <HeroSection />

      <section id="about">
        <FEStorySection />
      </section>

      <section id="ai">
        <AIStorySection />
      </section>

      {/* <section id="projects">
        <ProjectsSection />
      </section> */}

      <ContactSection />

      <section id="skills" className={`${styles.skillswrap}`}>
        <div className='lg:w-[1000px] h-[170px] flex items-center justify-center space-x-6'>
          <div className={styles.logo} title="vue">
            <Image src="/tech_logos/vue.svg" alt="Vue.js" width={60} height={60} />
          </div>
          <div className={styles.logo} title="react">
            <Image src="/tech_logos/react.svg" alt="React" width={60} height={60} />
          </div>
          <div className={styles.logo} title="nuxt">
            <Image src="/tech_logos/nuxt.svg" alt="Nuxt.js" width={60} height={60} />
          </div>
          <div className={styles.logo} title="typescript">
            <Image src="/tech_logos/typescript.svg" alt="TypeScript" width={60} height={60} />
          </div>
          <div className={styles.logo} title="mongodb">
            <Image src="/tech_logos/mongodb.svg" alt="MongoDB" width={60} height={60} />
          </div>
          <div className={styles.logo} title="github">
            <Image src="/tech_logos/github.svg" alt="GitHub" width={60} height={60} />
          </div>
        </div>
      </section>

      <ArticleList
        articles={articles}
        showCategories={true}
        showSearch={false}
      />

      <SettingsPanel />
    </div>
  );
}
