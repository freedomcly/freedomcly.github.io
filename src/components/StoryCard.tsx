'use client';
import { useEffect, useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import styles from '@/styles/components/StoryCard.module.css';

interface StoryCardProps {
  story: string;
  index: number;
  isTimeline?: boolean;
  totalStories?: number;
}

export default function StoryCard({ story, index, isTimeline = true, totalStories }: StoryCardProps) {
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateLineHeight = () => {
      if (cardRef.current && lineRef.current && isVisible) {
        const cardHeight = cardRef.current.offsetHeight || 0;
        const lineHeight = cardHeight + 30; // 卡片高度 + 间距
        
        if (lineRef.current) {
          lineRef.current.style.height = `${lineHeight}px`;
        }
      }
    };

    if (isVisible) {
      // 延迟计算，确保DOM已渲染完成
      const timer = setTimeout(calculateLineHeight, 100);
      
      // 监听窗口大小变化
      window.addEventListener('resize', calculateLineHeight);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', calculateLineHeight);
      };
    }
  }, [isVisible, story]); // 依赖story，当文案变化时重新计算

  return (
    <div
      ref={elementRef}
      className={`${styles.storyCard} ${isVisible ? styles.visible : ''} ${
        isTimeline ? styles.timeline : ''
      }`}
      style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
    >
      {isTimeline && (
        <div className={styles.timelineIndicator}>
          <div className={styles.timelineDot}></div>
          {totalStories && index < totalStories - 1 && (
            <div 
              ref={lineRef}
              className={styles.timelineLine}
            ></div>
          )}
        </div>
      )}
      <div ref={cardRef} className={styles.cardContent}>
        <p>{story}</p>
      </div>
    </div>
  );
}