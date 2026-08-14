import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from './LoadingScreen';
import { ABOVE_THE_FOLD_IMAGES, preloadImages } from '@/utils/performanceOptimizations';

interface FastLoadWrapperProps {
  children: React.ReactNode;
}

export const FastLoadWrapper: React.FC<FastLoadWrapperProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const preloadCriticalImagesOnly = async () => {
      console.time('FastLoad: Critical images only');
      
      try {
        // Start with progress animation
        setProgress(30);
        
        // Preload only above-the-fold images
        await Promise.race([
          preloadImages(ABOVE_THE_FOLD_IMAGES),
          new Promise(resolve => setTimeout(resolve, 500))
        ]);
        
        setProgress(80);
        
        // Minimum load time for smooth UX
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.timeEnd('FastLoad: Critical images only');
        setProgress(100);
        
        // Quick transition to content
        setTimeout(() => {
          setIsLoaded(true);
        }, 100);
        
      } catch (error) {
        console.warn('FastLoad: Critical image preloading failed, continuing anyway', error);
        setProgress(100);
        setTimeout(() => {
          setIsLoaded(true);
        }, 200);
      }
    };

    preloadCriticalImagesOnly();
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <LoadingScreen progress={progress} />
        )}
      </AnimatePresence>
      
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};