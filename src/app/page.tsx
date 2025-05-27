'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, Autoplay } from 'swiper/modules';

import styles from '@/app/ui/home.module.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

const mainSlideOptions = {
  slidesPerView: 1,
  loop: true,
  effect: 'fade',
  autoplay: {
    delay: 8000,
  }
};

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="text-center mt-[120px]">
        <div className={styles.avatar}></div>
        <div className={styles.name}>Hi, I&apos;m Tracy Cui</div>
        <h1 className={styles.intro}>Front end engineer</h1>
        <h1 className={styles.intro}>Full stack web developer</h1>
        <div className={styles.description}>
          <p>12 years of focus on User Experience</p>
          <p>passionate with programming</p>
          <p>and eager to solve problems</p>
        </div>
        <div className={styles.line}></div>
        <div>
          <a className={styles.chat} title="email" href="mailto:freedomcly@gmail.com" target="_blank">Chat with me</a>
        </div>

      </div>
      <div className={`mt-[100px] ${styles.skillswrap}`}>
        <h2 className={styles.intro}>Skills</h2>
        <ul className={`w-[430px] space-y-6 md:w-[700px] lg:w-[1000px] flex justify-center flex-col md:flex-row md:space-x-6 lg:flex-row ${styles.skills}`}>
          <li>
            <h3>Language</h3>
            <ul>
              <li className='flex justify-between'>
                <span>JavaScript</span>
                {/* <span>
                  <span>⭐️</span>
                  <span>⭐️</span>
                  <span>⭐️</span>
                  <span>⭐️</span>
                  <span>⭐️</span>
                </span> */}
              </li>
              <li>TypeScript</li>
              <li>Nodejs</li>
              <li>HTML</li>
              <li>CSS</li>
            </ul>
          </li>
          <li>
            <h3>Frameworks</h3>
            <ul>
              <li>Vue.js</li>
              <li>React.js</li>
              <li>Nuxt.js</li>
              <li>Next.js</li>
              <li>express.js</li>
            </ul>
          </li>
          <li className={styles.last}>
            <h3>Extensions</h3>
            <ul>
              <li>Nginx</li>
              <li>Mongodb</li>
              <li>PhotoShop</li>
              <li>Tailwindcss</li>
              <li>Sass</li>
            </ul>
          </li>
        </ul>

        <div className='lg:w-[1000px] h-[170px] flex items-center justify-center space-x-6'>
          <div className={styles.logo} title="vue">
            <img src="/tech_logos/vue.svg" />
          </div>
          <div className={styles.logo} title="react">
            <img src="/tech_logos/react.svg" />
          </div>
          <div className={styles.logo} title="nuxt">
            <img src="/tech_logos/nuxt.svg" />
          </div>
          <div className={styles.logo} title="typescript">
            <img src="/tech_logos/typescript.svg" />
          </div>
          <div className={styles.logo} title="mongodb">
            <img src="/tech_logos/mongodb.svg" />
          </div>
          <div className={styles.logo} title="github">
            <img src="/tech_logos/github.svg" />
          </div>
        </div>
      </div>

      <div className="mt-[100px]">
        <h2 className={styles.intro}>Example Projects</h2>
        {/* <ul className={`flex items-center justify-center space-x-6 ${styles.skills}`}>
          <li>
            <h4>Meituan (NASDAQ: MPNGY | Top O2O Platform)</h4>
            <p></p>
          </li>
        </ul> */}

        <Swiper
          modules={[Pagination, Scrollbar, Autoplay]}
          spaceBetween={50}
          pagination={{ clickable: true }}
          {...mainSlideOptions}
          className={`${styles.slidewrap} w-[420px] md:w-[700px] lg:w-[1000px]`}
        >
          <SwiperSlide className={styles.slide}>
            <div className={`${styles.slideitem} flex items-center justify-center`}>
              <div className={styles.infowrap}>
                <h4>Meituan (NASDAQ: MPNGY | Top O2O Platform)</h4>
                <p>A mobile website based on Vue, mainly used for the entire process of hotel reservations.</p>
              </div>
              <div className={`relative w-[50%] ${styles.imagewrap}`}>
                <Image
                  src="/images/meituan-preview.jpg"
                  width={200}
                  height={500}
                  alt="meituan-preview"
                  className={styles.center}
                />
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className={styles.slide}>
            <div className={`${styles.slideitem} flex items-center justify-center`}>
              <div className={styles.infowrap}>
                <h4>Dada (NASDAQ: DADA | Top Delivery Platform)</h4>
                <p>The express delivery service within the city is based on React.</p>
              </div>
              <div className={`relative w-[50%] ${styles.imagewrap}`}>
                <Image
                  src="/images/dada-preview.png"
                  width={200}
                  height={500}
                  alt="dada-preview"
                  className={styles.center}
                />
              </div>
            </div>
          </SwiperSlide>
          {/* <SwiperSlide className={styles.slide}>
            <div className={`${styles.slideitem} flex items-center justify-center`}>
              <div className={styles.infowrap}>
                <h4>Cross-border E-commerce ERP</h4>
              </div>
              <div className={`relative w-[50%] ${styles.imagewrap}`}>
              </div>
            </div>
          </SwiperSlide> */}
          <SwiperSlide className={styles.slide}>
            <div className={`${styles.slideitem} flex items-center justify-center`}>
              <div className={styles.infowrap}>
                <h4>Wemart (Start-up projects similar to Shopify)</h4>
                <p>Create a series of tools for e-commerce.</p>
              </div>
              <div className={`relative w-[50%] ${styles.imagewrap}`}>
                <Image
                  src="/images/wemart-preview.png"
                  width={500}
                  height={500}
                  alt="wemart-preview"
                  style={{objectFit: 'contain', position: 'absolute', top: 0, left: 0}}
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

      </div>



      <div className={`${styles.touch} w-[420px] md:w-[700px] lg:w-[1000px]`} title="email">
        <div className={`${styles.touchword} text-[100px] lg:text-[140px] md:text-[120px]`}>Get in touch</div>
      </div>
      <ul className={`${styles.contact} flex items-center justify-center space-x-6`}>
        <li>
          <a href="https://github.com/freedomcly" target="_blank">github</a>
        </li>
        {/* <li>
          <a>linkedin</a>
        </li>
        <li>
          <a>wechat</a>
        </li> */}
      </ul>

    </div>
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
    //     <Image
    //       className="dark:invert"
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={180}
    //       height={38}
    //       priority
    //     />
    //     <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
    //       <li className="mb-2 tracking-[-.01em]">
    //         Get started by editing{' '}
    //         <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
    //           src/app/page.tsx
    //         </code>
    //         .
    //       </li>
    //       <li className="tracking-[-.01em]">
    //         Save and see your changes instantly.
    //       </li>
    //     </ol>

    //     <div className="flex gap-4 items-center flex-col sm:flex-row">
    //       <a
    //         className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className="dark:invert"
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={20}
    //           height={20}
    //         />
    //         Deploy now
    //       </a>
    //       <a
    //         className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Read our docs
    //       </a>
    //     </div>
    //   </main>
    //   <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/file.svg"
    //         alt="File icon"
    //         width={16}
    //         height={16}
    //       />
    //       Learn
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/window.svg"
    //         alt="Window icon"
    //         width={16}
    //         height={16}
    //       />
    //       Examples
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/globe.svg"
    //         alt="Globe icon"
    //         width={16}
    //         height={16}
    //       />
    //       Go to nextjs.org →
    //     </a>
    //   </footer>
    // </div>
  );
}
