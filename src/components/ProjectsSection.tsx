'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ProjectCard from './ProjectCard';
import styles from '@/styles/components/ProjectsSection.module.css';

// Project data structure
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

const ProjectsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLHeadingElement>();
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation<HTMLDivElement>();

  // Project data - this could be moved to a separate data file or fetched from an API
  const projects: Project[] = [
    {
      id: 'meituan',
      title: t('projects.meituan.title'),
      description: t('projects.meituan.desc'),
      image: '/images/meituan-preview.jpg',
      technologies: ['Vue.js', 'JavaScript', 'CSS3', 'Mobile-First'],
      githubUrl: undefined, // Private project
      liveUrl: 'https://hotel.meituan.com',
      featured: true
    },
    {
      id: 'dada',
      title: t('projects.dada.title'),
      description: t('projects.dada.desc'),
      image: '/images/dada-preview.png',
      technologies: ['React', 'TypeScript', 'Redux', 'Ant Design'],
      githubUrl: undefined, // Private project
      liveUrl: 'https://www.imdada.cn',
      featured: true
    },
    {
      id: 'wemart',
      title: t('projects.wemart.title'),
      description: t('projects.wemart.desc'),
      image: '/images/wemart-preview.png',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      githubUrl: 'https://github.com/freedomcly/wemart',
      liveUrl: 'https://wemart.vercel.app',
      featured: true
    }
  ];

  const fontClass = language === 'zh' ? styles.chineseFont : styles.englishFont;

  return (
    <section id="projects" className={`${styles.projectsSection} ${fontClass}`}>
      <div className={styles.container}>
        <h2 
          ref={titleRef}
          className={`${styles.title} ${titleVisible ? styles.visible : ''}`}
        >
          {t('projects.title')}
        </h2>
        
        <div 
          ref={gridRef}
          className={`${styles.projectsGrid} ${gridVisible ? styles.visible : ''}`}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;