'use client';

import { useEffect, useState } from 'react';
import { PDFCard } from '@/components/ui/pdf-card';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Spotlight } from '@/components/ui/spotlight';
import { motion } from 'framer-motion';
import type { IPdfData } from '@/models/pdfData';

interface ApiResponse {
  success: boolean;
  data?: IPdfData[];
  error?: string;
}

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<IPdfData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/magazines');
        const data: ApiResponse = await response.json();
        
        if (!data.success) {
          setError(data.error || 'Failed to fetch magazines');
          return;
        }
        
        setMagazines(data.data || []);
      } catch (err) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#010314]">
      {/* Semi-transparent white background */}
      <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-sm z-0" />
      
      {/* Background effects */}
      <BackgroundBeams />
      <Spotlight />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
          >
            LFA Magazines
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg"
          >
            Explore our collection of literary magazines
          </motion.p>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {loading ? (
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white/70 text-sm sm:text-base">Loading magazines...</span>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 text-center"
            >
              <p className="text-red-400 text-sm sm:text-base">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : magazines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white/70 p-6 sm:p-8 bg-white/5 rounded-lg text-sm sm:text-base"
            >
              No magazines available yet.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {magazines.map((magazine, index) => (
                <PDFCard
                  key={magazine._id}
                  title={magazine.title}
                  date={magazine.createdAt.toISOString()}
                  views={magazine.views}
                  slug={magazine.slug}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 