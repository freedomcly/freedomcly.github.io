'use client';

import Image from 'next/image';
import Navigation from '@/components/Navigation';
import SectionHero from '@/components/SectionHero';
import SectionStory from '@/components/SectionStory';
import Philosophy from '@/components/Philosophy';
import SectionContact from '@/components/SectionContact';
// import ProjectsSection from '@/components/ProjectsSection';

import {useLanguage} from '@/contexts/LanguageContext';
import {useState, useEffect, Suspense} from 'react';
import type {Article} from '@/components/ArticleList';

// 直接导入组件
import ArticleList from '@/components/ArticleList';
import SettingsPanel from '@/components/SettingsPanel';

import styles from '@/styles/pages/home.module.css';

export default function Home() {
  const {language} = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // 延迟加载文章数据，避免阻塞首屏渲染
    const loadArticles = async () => {
      try {
        const {remoteArticles} = await import('@/lib/remote-articles');
        const currentArticles = remoteArticles.map(article => {
          const sourceSite = article.meta.remoteUrl?.includes('github.com') ? 'GitHub' :
            article.meta.remoteUrl?.includes('mp.weixin.qq.com') ? '微信公众号' : 'External';
          
          return {
            slug: article.meta.remoteUrl,
            title: article.meta.title[language] || article.meta.title.zh,
            date: article.meta.date,
            readTime: article.meta.readTime,
            isRemote: true,
            category: article.meta.category[language] || article.meta.category.zh,
            tags: article.meta.tags,
            excerpt: `${language === 'zh' ? '来自' : 'From'} ${sourceSite}`,
            sourceSite: sourceSite
          };
        });
        setArticles(currentArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error('Failed to load articles:', error);
      }
    };

    // 使用 requestIdleCallback 在浏览器空闲时加载
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(loadArticles);
    } else {
      setTimeout(loadArticles, 100);
    }
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation />
      </Suspense>

      <SectionHero />

      <section id="about">
        <SectionStory
          titleKey='feStories.title'
          introKey='feStories.intro'
          journeyKey='feStories.journey'
          storiesKey='feStories.stories'
          photo={{
            srcKey: 'feStories.photo.src',
            altKey: 'feStories.photo.alt',
            width: 400,
            height: 400,
            captionKey: 'feStories.caption'
          }}
        />
      </section>
      <Philosophy philosophyKey='feStories.philosophy' />
      <section id="ai" className={styles.ai}>
        <SectionStory
          titleKey='aiStories.title'
          introKey='aiStories.intro'
          journeyKey='feStories.journey'
          storiesKey='aiStories.stories'
        />
      </section>

      {/* <section id="projects">
        <ProjectsSection />
      </section> */}

      <SectionContact />

      <section id="skills" className={`${styles.skillswrap}`}>
        <div className='lg:w-[1000px] h-[170px] flex items-center justify-center space-x-6'>
          <div className={styles.logo} title="vue">
            <Image
              src="/tech_logos/vue.svg"
              alt="Vue.js"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
          <div className={styles.logo} title="react">
            <Image
              src="/tech_logos/react.svg"
              alt="React"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
          <div className={styles.logo} title="nuxt">
            <Image
              src="/tech_logos/nuxt.svg"
              alt="Nuxt.js"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
          <div className={styles.logo} title="typescript">
            <Image
              src="/tech_logos/typescript.svg"
              alt="TypeScript"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
          <div className={styles.logo} title="mongodb">
            <Image
              src="/tech_logos/mongodb.svg"
              alt="MongoDB"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
          <div className={styles.logo} title="github">
            <Image
              src="/tech_logos/github.svg"
              alt="GitHub"
              width={60}
              height={60}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 文章列表 */}
      <ArticleList
        articles={articles}
        showCategories={true}
        showSearch={false}
      />

      {/* 设置面板 */}
      <SettingsPanel />
    </div>
  );
}
