"use client";

import { useTheme } from "next-themes";
import { ExtendedRecordMap } from "notion-types";
import { useEffect, useMemo, useState } from "react";
import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import { motion } from "motion/react";
import { FiCalendar } from "react-icons/fi";

const prismComponents = [
  "prism-markup-templating",
  "prism-markup",
  "prism-bash",
  "prism-c",
  "prism-cpp",
  "prism-csharp",
  "prism-docker",
  "prism-java",
  "prism-js-templates",
  "prism-coffeescript",
  "prism-diff",
  "prism-git",
  "prism-go",
  "prism-graphql",
  "prism-handlebars",
  "prism-less",
  "prism-makefile",
  "prism-markdown",
  "prism-objectivec",
  "prism-ocaml",
  "prism-python",
  "prism-reason",
  "prism-rust",
  "prism-sass",
  "prism-scss",
  "prism-solidity",
  "prism-sql",
  "prism-stylus",
  "prism-swift",
  "prism-wasm",
  "prism-yaml",
];

const Code = dynamic(
  () =>
    import("react-notion-x/build/third-party/code").then(async (m) => {
      const importPromises = prismComponents.map(
        (component) => import(`prismjs/components/${component}.js`)
      );

      await Promise.allSettled(importPromises);

      return m.Code;
    }),
  {
    ssr: false,
  }
);

const Collection = dynamic(
  () =>
    import("react-notion-x/build/third-party/collection").then(
      (m) => m.Collection
    ),
  {
    ssr: false,
  }
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

export const NotionPage = ({
  recordMap,
  rootPageId,
  title,
  locale,
}: {
  recordMap: ExtendedRecordMap;
  rootPageId: string;
  title?: string;
  locale: string;
}) => {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  const [hover, setHover] = useState(false);

  const components = useMemo(
    () => ({
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
    }),
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (!recordMap) {
    return null;
  }

  const createdDate = new Date(
    recordMap.block[rootPageId].value?.created_time
  );
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(createdDate);

  return (
    <div className="min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-purple-100/20 to-blue-100/20 blur-3xl dark:from-purple-900/10 dark:to-blue-900/10"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-amber-100/20 to-rose-100/20 blur-3xl dark:from-amber-900/10 dark:to-rose-900/10"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link className="self-center mb-6" href={`/${locale}/blog`} prefetch={true}>
          <motion.button 
            className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full bg-[#ece7e7] transition-all border dark:bg-gray-950/30 dark:hover:bg-gray-950/85 dark:border-gray-700 dark:text-white"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <RxCross2 className="w-4 h-4" />
          </motion.button>
          </Link>
          
          <div className={`transition duration-700 ease-in-out transform ${hover ? "translate-y-5" : ""} w-full`}>
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h1>
            
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="py-2 px-6 rounded-full border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-200 flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                {formattedDate}
              </div>
            </motion.div>
          
            <motion.div 
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="p-4 sm:p-8">
                <NotionRenderer
                  components={components}
                  darkMode={theme === "dark"}
                  fullPage={false}
                  recordMap={recordMap}
                  rootPageId={rootPageId}
                  className="notion-container"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link href={`/${locale}/blog`} prefetch={true}>
                <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  ← Back to all posts
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
