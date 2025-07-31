'use client';

import {useTheme} from '@/contexts/ThemeContext';
import styles from '@/styles/components/ThemeToggle.module.css';

export default function ThemeToggle() {
  const {theme, toggleTheme} = useTheme();

  const getIcon = () => {
    return theme === 'dark' ? '🌙' : '☀️';
  };

  const getLabel = () => {
    return theme === 'dark' ? 'Dark mode' : 'Light mode';
  };

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Switch theme. Current: ${getLabel()}`}
      title={getLabel()}
    >
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.indicator}>
        <span className={`${styles.dot} ${styles[theme]}`} />
      </span>
    </button>
  );
}