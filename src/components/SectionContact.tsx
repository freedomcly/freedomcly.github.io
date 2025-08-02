'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/gtag';
import styles from '@/styles/components/SectionContact.module.css';

const SectionContact: React.FC = () => {
  const { language } = useLanguage();

  // const contactMethods = [
    // {
    //   type: 'email',
    //   label: language === 'zh' ? '邮箱联系' : 'Email Me',
    //   value: 'freedomcly@gmail.com',
    //   href: 'mailto:freedomcly@gmail.com',
    //   icon: '✉️',
    //   description: language === 'zh' ? '最快的联系方式' : 'Fastest way to reach me'
    // },
    // {
    //   type: 'github',
    //   label: 'GitHub',
    //   value: '@freedomcly',
    //   href: 'https://github.com/freedomcly',
    //   icon: '🐙',
    //   description: language === 'zh' ? '查看我的代码' : 'Check out my code'
    // }
    // {
    //   type: 'linkedin',
    //   label: 'LinkedIn',
    //   value: 'Tracy Cui',
    //   href: 'https://linkedin.com/in/tracy-cui',
    //   icon: '💼',
    //   description: language === 'zh' ? '专业档案' : 'Professional profile'
    // }
  // ];

  const handleContactClick = (href: string, method: string = 'unknown') => {
    // 跟踪联系表单提交事件
    trackEvent.contactFormSubmit(method);
    
    if (href.startsWith('mailto:')) {
      window.location.href = href;
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="contact" className={styles.sectionContact}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {language === 'zh' ? '一起创造些美好的东西' : 'Let\'s create something amazing together'}
          </h2>
          <p className={styles.subtitle}>
            {language === 'zh' 
              ? '有想法？有项目？或者只是聊聊技术？'
              : 'Got an idea? A project? Or just want to chat about tech? I\'d love to hear from you.'
            }
          </p>
        </div>

        {/* Contact Methods */}
        {/* <div className={styles.contactGrid}>
          {contactMethods.map((method) => (
            <div
              key={method.type}
              className={`${styles.contactCard} ${styles[method.type]}`}
              onClick={() => handleContactClick(method.href)}
            >
              <div className={styles.cardIcon}>
                <span className={styles.iconEmoji}>{method.icon}</span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{method.label}</h3>
                <p className={styles.cardValue}>{method.value}</p>
                <p className={styles.cardDescription}>{method.description}</p>
              </div>
              <div className={styles.cardArrow}>
                <span>→</span>
              </div>
            </div>
          ))}
        </div> */}

        {/* Primary CTA */}
        <div className={styles.primaryCTA}>
          <button
            className={styles.primaryButton}
            onClick={() => handleContactClick('mailto:freedomcly@gmail.com', 'email')}
          >
            <span className={styles.buttonText}>
              {language === 'zh' ? '开始邮件对话' : 'Start a conversation'}
            </span>
            <span className={styles.buttonIcon}>✉️</span>
          </button>
        </div>

        {/* Footer note */}
        <div className={styles.footerNote}>
          <p>
            {language === 'zh' 
              ? '通常在24小时内回复'
              : 'Usually reply within 24 hours • Remote-friendly worldwide'
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionContact;