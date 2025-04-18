'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface PDFCardProps {
  title: string;
  date: string;
  views: number;
  slug: string;
  index: number;
}

export const PDFCard = ({ title, date, views, slug, index }: PDFCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative w-full"
    >
      <div className="absolute -inset-[2px] bg-gradient-to-r from-white/40 via-white/80 to-white/40 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300 blur-sm group-hover:blur-md" />
      
      <a
        href={`/view/${slug}`}
        className="relative block bg-[#0a1a3b]/60 backdrop-blur-sm rounded-lg border border-white/20 p-6 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-white/90">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              {format(new Date(date), 'MMMM d, yyyy')}
            </span>
            <span>
              {views} views
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}; 