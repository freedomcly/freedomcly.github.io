'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import StoryCard from './StoryCard';
import Image from 'next/image';
import styles from '@/styles/components/FEStorySection.module.css';

export default function FEStorySection() {
  const { t } = useLanguage();
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>();
  const { elementRef: introRef, isVisible: introVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: photoRef, isVisible: photoVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: quoteRef, isVisible: quoteVisible } = useScrollAnimation<HTMLDivElement>();

  const stories = [
    t('about.story1'),
    t('about.story2'),
    t('about.story3'),
    t('about.story4'),
    t('about.story5')
  ];

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 
          ref={titleRef}
          className={`${styles.title} ${titleVisible ? styles.visible : ''}`}
        >
          {t('about.title')}
        </h2>        
        <div className={styles.content}>
          <div className={styles.mainContent}>
            {/* Left Column - Stories and Intro */}
            <div className={styles.leftColumn}>
              <div 
                ref={introRef}
                className={`${styles.intro} ${introVisible ? styles.visible : ''}`}
              >
                <p className={styles.introText}>{t('about.intro')}</p>
              </div>
              
              <div className={styles.storiesContainer}>
                <div className={styles.storiesTitle}>
                  <h3>{t('about.journey')}</h3>
                </div>
                <div className={styles.stories}>
                  {stories.map((story, index) => (
                    <StoryCard
                      key={index}
                      story={story}
                      index={index}
                      isTimeline={true}
                      totalStories={stories.length}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Photo */}
            <div className={styles.rightColumn}>
              <div 
                ref={photoRef}
                className={`${styles.photoContainer} ${photoVisible ? styles.visible : ''}`}
              >
                <div className={styles.photoWrapper}>
                  <Image
                    src="/images/me.jpg"
                    alt="Tracy Cui - Personal Photo"
                    width={400}
                    height={500}
                    className={styles.personalPhoto}
                    priority
                  />
                  <div className={styles.photoOverlay}></div>
                </div>
                <div className={styles.photoCaption}>
                  <p>{t('about.caption')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            ref={quoteRef}
            className={`${styles.philosophy} ${quoteVisible ? styles.visible : ''}`}
          >
            <blockquote className={styles.quote}>{t('about.philosophy')}</blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}