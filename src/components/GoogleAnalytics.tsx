'use client';

import Script from 'next/script';
import { GA_TRACKING_ID, isGAEnabled } from '@/lib/gtag';

export default function GoogleAnalytics() {
  // 只在生产环境且有GA ID时加载
  if (!isGAEnabled) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  );
}