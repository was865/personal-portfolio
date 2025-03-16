'use client'

import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { customMapImageUrl } from "@/lib/notion";
import TiltedCard from '@/components/reactbits/TiltedCard';
import { motion } from "motion/react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl"
import { extractTags, getTitleWithoutTags } from '@/lib/utils';
import Folder from '@/components/reactbits/Folder';

type BlogPost = {
  id: string;
  title: string;
  block: any;
  pageCover: string;
  createdAt: Date;
};

interface BlogUIProps {
  blogPosts: BlogPost[];
  locale: string;
}

const BlogUI = ({ blogPosts, locale }: BlogUIProps) => {
  const [hover, setHover] = useState(false);
  const t = useTranslations('Blog')

  return (
    <div className="px-4 pb-10">
      <div className="flex flex-col items-center mb-8 gap-8">
        <Link href={`/${locale}`} prefetch={true}>
          <motion.button 
            className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-[#ece7e7]/70 transition-all border dark:bg-gray-950/30 dark:hover:bg-gray-950/85 dark:border-gray-700 dark:text-white"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <RxCross2 className="w-4 h-4" />
          </motion.button>
        </Link>
        <div className="w-full text-center">
          <h1 className="text-2xl font-[500]">{t('title')}</h1>
          <p className="text-sm text-gray-500">{t('description')}</p>
        </div>
      </div>
      <motion.div 
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition duration-700 ease-in-out transform ${hover ? "translate-y-5" : ""}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {blogPosts.map(({ id, title, block, pageCover, createdAt }) => {
          const tags = extractTags(title);
          const cleanTitle = getTitleWithoutTags(title);
          
          return (
            <div key={id} className="relative h-[300px]">
              <Link href={`/${locale}/blog/${id}`} className="block h-[300px]">
                <TiltedCard
                  imageSrc={customMapImageUrl(pageCover, block)}
                  altText={cleanTitle}
                  captionText={cleanTitle}
                  containerHeight="300px"
                  containerWidth="100%"
                  imageHeight="300px"
                  imageWidth="100%"
                  rotateAmplitude={8}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="flex flex-col justify-between h-full">
                      <p className="text-white capitalize tracking-[-0.5px] font-black shadow-[0_5px_30px_#06060659] m-[2em] px-[1em] py-2 rounded-[15px] bg-[#0006]">
                        {cleanTitle}
                      </p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 m-[2em] mt-auto">
                          {tags.map((tag, index) => (
                          <span 
                              key={index} 
                              className="text-xs bg-black/70 text-white px-2 py-1 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  }
                />
              </Link>
            </div>
          );
        })}
      </motion.div>
      {/* <div style={{ height: '600px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Folder size={2} color="#00d8ff" className="custom-folder" />
      </div> */}
    </div>
  );
};

export default BlogUI; 