'use client';

import React from 'react';
import {useLanguage} from '@/contexts/LanguageContext';
import TypewriterText from './TypewriterText';
import OptimizedImage from './OptimizedImage';
import styles from '@/styles/components/SectionHero.module.css';

const SectionHero: React.FC = () => {
  const {t, language} = useLanguage();

  const fontClass = language === 'zh' ? styles.chineseFont : styles.englishFont;

  return (
    <section id="home" className={`${styles.sectionHero} ${fontClass}`}>
      {/* Gradient Background */}
      <div className={styles.gradientBackground}></div>

      {/* Geometric Decorations */}
      <div className={styles.geometricDecorations}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.triangle}></div>
        <div className={styles.square}></div>
      </div>

      <div className={styles.heroContent}>
        {/* Avatar with hover animations */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <OptimizedImage
              src="/images/tracy-400.jpg"
              alt="Tracy Cui"
              width={200}
              height={200}
              className={styles.avatar}
              priority
              quality={85}
            />
            <div className={styles.avatarGlow}></div>
          </div>
        </div>

        {/* Greeting */}
        <div className={styles.greeting}>
          {t('hero.greeting')}
        </div>

        {/* Typewriter Title */}
        <h1 className={styles.mainTitle}>
          <TypewriterText
            text={t('hero.title1')}
            speed={100}
            resetTrigger={language}
            className={styles.typewriterText}
          />
        </h1>

        {/* Subtitle */}
        <h2 className={styles.subtitle}>
          {t('hero.title2')}
        </h2>

        {/* Conversational Description */}
        <div className={styles.description}>
          <p className={styles.descLine}>{t('hero.desc1')}</p>
          <p className={styles.descLine}>{t('hero.desc2')}</p>
          <p className={styles.descLine}>{t('hero.desc3')}</p>
        </div>

        {/* Decorative Line */}
        <div className={styles.decorativeLine}></div>

        {/* Main Action Button */}
        <div className={styles.ctaContainer}>
          <button
            className={styles.ctaButton}
            onClick={() => {
              const contactElement = document.getElementById('contact');
              if (contactElement) {
                contactElement.scrollIntoView({behavior: 'smooth'});
              }
            }}
            aria-label="Go to contact section"
          >
            <span className={styles.ctaText}>{t('hero.cta')}</span>
            <div className={styles.ctaGlow}></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionHero;