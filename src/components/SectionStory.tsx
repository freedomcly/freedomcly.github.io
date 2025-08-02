'use client';
import {useLanguage} from '@/contexts/LanguageContext';
import {useScrollAnimation} from '@/hooks/useScrollAnimation';
import StoryCard from './StoryCard';
import OptimizedImage from './OptimizedImage';
import styles from '@/styles/components/SectionStory.module.css';

interface PhotoConfig {
    srcKey: string;
    altKey: string;
    width: number;
    height: number;
    captionKey: string;
}

interface SectionStoryProps {
    titleKey: string;
    introKey: string;
    journeyKey: string;
    storiesKey: string;
    photo?: PhotoConfig;
}

export default function SectionStory({
    titleKey,
    introKey,
    journeyKey,
    storiesKey,
    photo,
}: SectionStoryProps) {
    const {t, tArray} = useLanguage();

    const {elementRef: titleRef, isVisible: titleVisible} = useScrollAnimation<HTMLHeadingElement>();
    const {elementRef: introRef, isVisible: introVisible} = useScrollAnimation<HTMLDivElement>();
    const {elementRef: photoRef, isVisible: photoVisible} = useScrollAnimation<HTMLDivElement>();

    const storyList = tArray(storiesKey);
    
    return (
        <section className={styles.aboutSection}>
            <div className={styles.container}>
                <h2
                    ref={titleRef}
                    className={`${styles.title} ${titleVisible ? styles.visible : ''}`}
                >
                    {t(titleKey)}
                </h2>
                <div className={styles.content}>
                    <div className={`${styles.mainContent} ${photo ? styles.withPhoto : styles.withoutPhoto}`}>
                        <div className={styles.leftColumn}>
                            <div
                                ref={introRef}
                                className={`${styles.intro} ${introVisible ? styles.visible : ''}`}
                            >
                                <p className={styles.introText}>{t(introKey)}</p>
                            </div>

                            <div className={styles.storiesContainer}>
                                <div className={styles.storiesTitle}>
                                    <h3>{t(journeyKey)}</h3>
                                </div>
                                <div className={styles.stories}>
                                    {storyList.map((story, index) => (
                                        <StoryCard
                                            key={index}
                                            story={story}
                                            index={index}
                                            isTimeline={true}
                                            totalStories={storyList.length}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {photo && (
                            <div className={styles.rightColumn}>
                                <div 
                                    ref={photoRef}
                                    className={`${styles.photoContainer} ${photoVisible ? styles.visible : ''}`}
                                >
                                    <div className={styles.photoWrapper}>
                                        <OptimizedImage
                                            src={t(photo.srcKey)}
                                            alt={t(photo.altKey)}
                                            width={photo.width}
                                            height={photo.height}
                                            className={styles.personalPhoto}
                                            quality={85}
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Kcp4="
                                        />
                                        <div className={styles.photoOverlay}></div>
                                    </div>
                                    <div className={styles.photoCaption}>
                                        <p>{t(photo.captionKey)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}