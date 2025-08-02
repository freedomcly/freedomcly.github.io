'use client';

import React, {useState, useEffect} from 'react';
import styles from '@/styles/components/TypewriterText.module.css';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
  resetTrigger?: string | number; // 用于触发重置的依赖项
}

export default function TypewriterText({
  text,
  speed = 100,
  showCursor = true,
  className = '',
  onComplete,
  resetTrigger
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // 打字机效果逻辑
  useEffect(() => {
    if (currentIndex < text.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length && isTyping) {
      setIsTyping(false);
      onComplete?.();
    }
  }, [currentIndex, text, isTyping, speed, onComplete]);

  // 重置打字机效果
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(true);
  }, [resetTrigger, text]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className={`${styles.cursor} ${isTyping ? styles.blinking : ''}`}>|</span>
      )}
    </span>
  );
}