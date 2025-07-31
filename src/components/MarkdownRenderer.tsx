'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/components/MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // 简单的Markdown解析
      let html = content
        // 标题
        .replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 id="$1">$1</h1>')
        // 代码块
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        // 行内代码
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // 粗体
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 斜体
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // 链接
        .replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+["']([^"']*)["'])?\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" title="$3">$1</a>')
        // 列表
        .replace(/^\d+\.\s(.*)$/gim, '<li>$1</li>')
        .replace(/^-\s(.*)$/gim, '<li>$1</li>')
        // 段落
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      // 包装段落
      html = '<p>' + html + '</p>';
      
      // 处理列表
      html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
      html = html.replace(/<\/ul>\s*<ul>/g, '');
      
      // 清理空段落
      html = html.replace(/<p><\/p>/g, '');
      html = html.replace(/<p><br><\/p>/g, '');
      
      contentRef.current.innerHTML = html;

      // 为标题添加ID以支持目录导航
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent || '';
          const id = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() || `heading-${index}`;
          heading.id = id;
        }
      });
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className={`${styles.markdown} ${className}`}
    />
  );
}