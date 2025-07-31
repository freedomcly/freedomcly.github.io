'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import StoryCard from './StoryCard';
import styles from '@/styles/components/AIStorySection.module.css';

export default function AIStorySection() {
  const { t } = useLanguage();
  // 添加与AboutSection相同的滚动动画引用
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>();
  const { elementRef: introRef, isVisible: introVisible } = useScrollAnimation<HTMLDivElement>();

  // AI Stories data
  const aiStories = [
    t('aiStories.story1'),
    t('aiStories.story2'),
    t('aiStories.story3'),
    t('aiStories.story4'),
    t('aiStories.story5')
  ];

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        {/* 使用与AboutSection相同的标题样式 */}
        <h2 
          ref={titleRef}
          className={`${styles.title} ${titleVisible ? styles.visible : ''}`}
        >
          {t('aiStories.title')}
        </h2>        
        <div className={styles.content}>
          <div className={styles.mainContent}>
            {/* 左侧故事内容 - 与AboutSection结构匹配 */}
            <div className={styles.leftColumn}>
              {/* 添加介绍文本区域 */}
              <div 
                ref={introRef}
                className={`${styles.intro} ${introVisible ? styles.visible : ''}`}
              >
                <p className={styles.introText}>
                  {t('aiStories.intro')}
                </p>
              </div>
              
              {/* 故事容器 - 使用AboutSection相同的样式结构 */}
              <div className={styles.storiesContainer}>
                <div className={styles.storiesTitle}>
                  <h3>{t('about.journey')}</h3>
                </div>
                <div className={styles.stories}>
                  {aiStories.map((story, index) => (
                    <StoryCard
                      key={index}
                      story={story}
                      index={index}
                      isTimeline={true}
                      totalStories={aiStories.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}