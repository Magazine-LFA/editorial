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

export default function EditorialPage() {
  const [editorials, setEditorials] = useState<IPdfData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEditorials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/editorials');
        const data: ApiResponse = await response.json();
        
        if (!data.success) {
          setError(data.error || 'Failed to fetch editorials');
          return;
        }
        
        setEditorials(data.data || []);
      } catch (err) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEditorials();
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#010314]">
      {/* Semi-transparent white background */}
      <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-sm z-0" />
      
      {/* Background effects */}
      <BackgroundBeams />
      <Spotlight />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            LFA Editorials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Discover our editorial collection
          </motion.p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center space-x-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white/70">Loading editorials...</span>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center"
            >
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 text-sm text-white bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : editorials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white/70 p-8 bg-white/5 rounded-lg"
            >
              No editorials available yet.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {editorials.map((editorial, index) => (
                <PDFCard
                  key={editorial._id}
                  title={editorial.title}
                  date={editorial.createdAt.toISOString()}
                  views={editorial.views}
                  slug={editorial.slug}
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