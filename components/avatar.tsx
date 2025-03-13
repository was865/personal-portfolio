import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { MdOutlineSync } from "react-icons/md";
import { cn } from "@/lib/utils";

interface AvatarTransitionProps {
  avatarUrl: string;
  dogUrl: string;
}

const AvatarTransition: React.FC<AvatarTransitionProps> = ({
  avatarUrl,
  dogUrl,
}: AvatarTransitionProps) => {
  const [toggle, setToggle] = useState(false);

  const avatarVariants = {
    enter: { scale: 1, opacity: 1, rotate: 0 },
    exit: { scale: 0, opacity: 0, rotate: 360 },
  };

  const spring = {
    type: "spring",
    stiffness: 50,
    damping: 10,
    mass: 0.8,
  };

  // Ping effect variants
  const pingVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: [0.9, 2.5],
      opacity: [0.6, 0],
      transition: { duration: 1.5, repeat: 0 },
    },
  };

  return (
    <div className="flex justify-between">
      <div className="relative w-24 h-24 md:w-28 md:h-28">
        <motion.div
          key={toggle ? "blue" : "green"}
          animate="animate"
          className="absolute inset-0 m-auto rounded-full bg-blue-300 opacity-60 blur-md"
          initial="initial"
          variants={pingVariants}
        />
        <motion.div
          animate={toggle ? "exit" : "enter"}
          className="absolute inset-0 rounded-full flex items-center justify-center"
          initial="exit"
          transition={spring}
          variants={avatarVariants}
        >
          <Image
            alt="Avatar"
            className="w-24 h-24 md:w-28 md:h-28 object-cover mb-4 border-2 border-transparent dark:border-gray-700 rounded-full"
            height={128}
            src={avatarUrl}
            width={128}
          />
        </motion.div>
        <motion.div
          animate={toggle ? "enter" : "exit"}
          className="absolute inset-0 rounded-full flex items-center justify-center"
          initial="exit"
          transition={spring}
          variants={avatarVariants}
        >
          <Image
            alt="Dog Avatar"
            className="w-24 h-24 md:w-28 md:h-28 object-cover mb-4 border-2 border-transparent dark:border-gray-700 rounded-full"
            height={128}
            src={dogUrl}
            width={128}
          />
        </motion.div>
      </div>
      <motion.button
        className="flex items-center justify-center gap-2 rounded-full bg-transparent border border-gray-200 px-4 py-2 transition-all hover:bg-gray-50 dark:text-white dark:border-[#1e293b] dark:hover:bg-[#1e293b]/10 w-[120px] h-[40px] select-none"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setToggle((prev) => !prev)}
        whileTap={{ scale: 0.95 }}
      >
        <MdOutlineSync size={16} className="mr-1" />
        Toggle
      </motion.button>
    </div>
  );
};

export default AvatarTransition;
