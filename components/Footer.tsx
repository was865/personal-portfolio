import React from "react"
import beian from "@/public/beian.png";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
      <small className="mb-2 block text-xs">
        &copy; 2025 Ansen Wang. All rights reserved.
      </small>
      <p className="text-xs">
        <span className="font-semibold">About this website:</span> built with
        React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
        Framer Motion (motion.dev), Vercel hosting.
      </p>
    </footer>
  )
}
