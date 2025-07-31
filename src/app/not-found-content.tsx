// app/not-found-content.tsx
'use client'; // <-- 关键：明确声明这是一个客户端组件
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'; // 从 Next.js 导航中导入 useSearchParams
import React, {Suspense} from 'react';

// 内部组件使用 useSearchParams
function NotFoundContentInner() {
  const searchParams = useSearchParams();

  // 从 URL 获取 'message' 参数，如果不存在则默认为 '页面未找到'
  const errorMessage = searchParams.get('message') || '页面未找到';

  return (
    <div style={{textAlign: 'center', padding: '50px'}}>
      <h1>404 - {errorMessage}</h1>
      <p>您请求的页面不存在。</p>
      {/* 可以添加一个返回主页的链接 */}
      <Link href="/" style={{textDecoration: 'underline', color: 'blue'}}>
        返回主页
      </Link>
    </div>
  );
}

// 主组件用 Suspense 包装
export default function NotFoundContent() {
  return (
    <Suspense fallback={
      <div style={{textAlign: 'center', padding: '50px'}}>
        <h1>404 - 页面未找到</h1>
        <p>您请求的页面不存在。</p>
        <Link href="/" style={{textDecoration: 'underline', color: 'blue'}}>
          返回主页
        </Link>
      </div>
    }>
      <NotFoundContentInner />
    </Suspense>
  );
}