import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import { useState } from "react";

interface PaperProps {
  paperUrl: string;
}

const Paper = ({ paperUrl }: PaperProps) => {
  const activeLocale = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative bg-[#63ccae] w-full h-full group dark:text-white dark:bg-[#0f1217]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -top-40 left-40 bg-[#ffdf9a] w-[135%] h-full rounded-full dark:hidden" />
      <div className="absolute top-16 md:top-1/2 -translate-y-1/2 left-12 md:left-16 rounded-2xl -rotate-[30deg] w-full">
        <Image
          alt="Paper"
          className="h-full w-full rounded-2xl object-contain"
          height={1280}
          quality={75}
          src={paperUrl}
          width={1577}
        />
      </div>
      <Link
        href={`/${activeLocale}/blog`}
        className="absolute bottom-2 left-2"
        prefetch={true}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button 
          className="bg-white dark:bg-[#0f1217] transition-all w-auto min-w-10 h-10 md:min-w-[2.75rem] md:h-[2.75rem] duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full border-2 border-transparent dark:border-gray-700 flex justify-center items-center cursor-pointer"
        >
          <div className="flex justify-center items-center text-black dark:text-white">
            <motion.span 
              className="text-sm text-nowrap mr-1 overflow-hidden whitespace-nowrap"
              initial={{ width: 0, opacity: 0 }}
              animate={isHovered ? { width: "auto", opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              View Blog
            </motion.span>
            <GoArrowUpRight />
          </div>
        </button>
      </Link>
    </div>
  );
};

export default Paper;
