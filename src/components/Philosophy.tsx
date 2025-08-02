'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import styles from '@/styles/components/Philosophy.module.css';

interface PhilosophyProps {
  philosophyKey: string;
}

export default function Philosophy({ philosophyKey }: PhilosophyProps) {
  const { t } = useLanguage();
  const { elementRef: quoteRef, isVisible: quoteVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div 
      ref={quoteRef}
      className={`${styles.philosophy} ${quoteVisible ? styles.visible : ''}`}
    >
      <blockquote className={styles.quote}>{t(philosophyKey)}</blockquote>
    </div>
  );
}