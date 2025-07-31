'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import styles from '@/styles/components/SettingsPanel.module.css';

export default function SettingsPanel() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 设置按钮 - 仿Next.js开发工具样式 */}
      <button
        className={`${styles.settingsButton} ${isOpen ? styles.active : ''}`}
        onClick={togglePanel}
        aria-label="Settings"
        title={language === 'zh' ? '设置' : 'Settings'}
      >
        <span className={styles.settingsIcon}>⚙️</span>
      </button>

      {/* 设置面板 */}
      <div className={`${styles.settingsPanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>
            {language === 'zh' ? '设置' : 'Settings'}
          </h3>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className={styles.panelContent}>
          {/* 主题切换 */}
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              {language === 'zh' ? '主题' : 'Theme'}
            </label>
            <div className={styles.settingControl}>
              <ThemeToggle />
            </div>
          </div>

          {/* 语言切换 */}
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>
              {language === 'zh' ? '语言' : 'Language'}
            </label>
            <div className={styles.settingControl}>
              <div className={styles.langToggle}>
                <button
                  className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
                  onClick={() => setLanguage('en')}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <button
                  className={`${styles.langBtn} ${language === 'zh' ? styles.active : ''}`}
                  onClick={() => setLanguage('zh')}
                  aria-label="切换到中文"
                >
                  中文
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 遮罩层 */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}