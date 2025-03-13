"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

interface OpenBadgeProps {
  badgeUrl: string;
}

export const OpenBadge = ({ badgeUrl }: OpenBadgeProps) => {
  const t = useTranslations("OpenBadge");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative bg-[#e6f7ff] w-full h-full group dark:bg-[#0f1217]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -top-40 right-40 bg-[#b3e0ff] w-[185%] h-full rounded-full dark:hidden" />

      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform rounded-2xl w-[80%]">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-2">
            <Image
              src="/images/openbadge.png"
              alt="OpenBadge"
              fill
              className="object-contain"
              priority
              quality={100}
            />
          </div>
          
          <h3 className="text-lg font-bold text-center text-black dark:text-white">
            {t('badgeTitle')}
          </h3>
          
          {/* <div 
            className={`flex flex-col items-center transition-all duration-300 ${
              isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <p className="text-sm text-center text-gray-700 dark:text-gray-300">
              {t('issuer')}
            </p>
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
              {t('issueDate')}
            </p>
          </div> */}
        </div>
      </div>
      
      <Link
        href={badgeUrl}
        target="_blank"
        className="absolute bottom-2 left-2"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <motion.button 
          className="bg-white dark:bg-[#0f1217] transition-all w-auto min-w-10 h-10 md:min-w-[2.75rem] md:h-[2.75rem] duration-300 ease-in-out p-2 rounded-full border-2 border-transparent dark:border-gray-700 flex justify-center items-center cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex justify-center items-center text-black dark:text-white">
            <motion.span 
              className="text-sm text-nowrap mr-1 overflow-hidden whitespace-nowrap"
              initial={{ width: 0, opacity: 0 }}
              animate={isHovered ? { width: "auto", opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t('viewBadge')}
            </motion.span>
            <GoArrowUpRight />
          </div>
        </motion.button>
      </Link>
    </div>
  );
}; 