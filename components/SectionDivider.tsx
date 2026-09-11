"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { IoIosArrowDown } from "react-icons/io"

export default function SectionDivider() {
  return (
    <motion.div
      initial={{ scale: 0.7 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.25 }}
      className="text-gray-500 w-8 h-8 mt-12 mb-20 rounded-full hidden sm:block "
    >
      <Link href="#about">
        <IoIosArrowDown className="transition" />
      </Link>
    </motion.div>
  )
}
