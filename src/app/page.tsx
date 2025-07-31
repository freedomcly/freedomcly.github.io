'use client';

import Image from 'next/image';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FEStorySection from '@/components/FEStorySection';
import AIStorySection from '@/components/AIStorySection';
import ContactSection from '@/components/ContactSection';
// import ProjectsSection from '@/components/ProjectsSection';
import SettingsPanel from '@/components/SettingsPanel';
import ArticleList, {Article} from '@/components/ArticleList';
import {useLanguage} from '@/contexts/LanguageContext';
import {useState, useEffect, Suspense} from 'react';

import styles from '@/styles/pages/home.module.css';

export default function Home() {
  const {language} = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // 直接使用远程文章数据
    import('@/lib/remote-articles').then(({ remoteArticles }) => {
      const currentArticles = remoteArticles.map(article => ({
        slug: article.meta.remoteUrl,
        title: article.meta.title[language] || article.meta.title.zh,
        date: article.meta.date,
        readTime: article.meta.readTime,
        isRemote: true,
        category: article.meta.category[language] || article.meta.category.zh,
        tags: article.meta.tags,
        excerpt: 'Remote article - click to read more',
        sourceSite: article.meta.remoteUrl?.includes('github.com') ? 'GitHub' : 
                   article.meta.remoteUrl?.includes('mp.weixin.qq.com') ? '微信公众号' : 'External'
      }));
      setArticles(currentArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation />
      </Suspense>

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
