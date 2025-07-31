'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { remoteArticles } from '@/lib/remote-articles';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  
  useEffect(() => {
    // 对于静态部署，直接重定向到远程文章
    const decodedSlug = decodeURIComponent(params.slug);
    
    // 如果是URL，直接跳转
    if (decodedSlug.startsWith('http')) {
      window.location.href = decodedSlug;
      return;
    }
    
    // 否则返回首页
    router.push('/');
  }, [params.slug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Taking you to the article...</p>
      </div>
    </div>
  );
}
