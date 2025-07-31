'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from '@/styles/components/LanguageToggle.module.css';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.button} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        className={`${styles.button} ${language === 'zh' ? styles.active : ''}`}
        onClick={() => setLanguage('zh')}
      >
        中文
      </button>
    </div>
  );
}