'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/gtag';

export function useScrollDepthTracking() {
  const pathname = usePathname();
  const trackedDepths = useRef<Set<number>>(new Set());
  const lastTrackedTime = useRef<number>(0);

  useEffect(() => {
    // 重置跟踪状态
    trackedDepths.current.clear();
    lastTrackedTime.current = Date.now();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 计算滚动百分比
      const scrollPercent = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );
      
      // 定义要跟踪的深度里程碑
      const milestones = [25, 50, 75, 90, 100];
      
      // 检查是否达到新的里程碑
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          
          // 避免过于频繁的事件发送
          const now = Date.now();
          if (now - lastTrackedTime.current > 1000) { // 至少间隔1秒
            trackEvent.scrollDepth(milestone, pathname || 'unknown');
            lastTrackedTime.current = now;
          }
          break; // 一次只跟踪一个里程碑
        }
      }
    };

    // 使用节流优化性能
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', optimizedScrollHandler);
    };
  }, [pathname]);
}