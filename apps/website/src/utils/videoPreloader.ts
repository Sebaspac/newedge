/**
 * Video Preloader Utility
 * Lädt alle Videos einer Seite vor, bevor die Seite angezeigt wird
 */

export interface VideoPreloadProgress {
  total: number;
  loaded: number;
  progress: number;
}

// Constants
const PRELOAD_TIMEOUT = 5000; // 5 seconds max wait time
const MOBILE_BREAKPOINT = 768;

/**
 * Check if device is mobile
 */
function isMobileDevice(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export const PAGE_VIDEOS = {
  studio: [
    '/assets/studio-hero-background.mp4',
    '/assets/brandstory-video.mp4',
    '/assets/template-video.mp4',
    '/assets/wireframes-video.mp4',
  ],
  media: [
    '/assets/media-hero-video.mp4',
    '/assets/media-launch-video.mp4',
    '/assets/media-content-video.mp4',
    '/assets/media-section-video.mp4',
    '/assets/media-new-video.mp4',
  ],
  lab: [
    '/assets/lab-hero-video.mp4',
    '/assets/lab-ki-automation-video.mp4',
    '/assets/lab-section-video.mp4',
    '/assets/lab-new-video.mp4',
  ],
  products: [
    '/assets/agents-hero-video.mp4',
    '/assets/products-hero-video.mp4',
    '/assets/liam-video.mp4',
    '/assets/vera-agent-video.mp4',
    '/assets/cora-agent-video.mp4',
  ],
};

/**
 * Preload a single video
 */
function preloadSingleVideo(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    
    video.addEventListener('loadeddata', () => {
      console.log(`✅ Video loaded: ${url}`);
      resolve();
    });
    
    video.addEventListener('error', (e) => {
      console.warn(`⚠️ Video failed to load: ${url}`, e);
      resolve(); // Resolve anyway to not block the page
    });
    
    video.src = url;
    video.load();
  });
}

/**
 * Preload all videos for a page with progress tracking and timeout
 */
export async function preloadPageVideos(
  page: keyof typeof PAGE_VIDEOS,
  onProgress?: (progress: VideoPreloadProgress) => void
): Promise<void> {
  const allVideos = PAGE_VIDEOS[page];
  const isMobile = isMobileDevice();
  
  // On mobile, only preload the first (hero) video
  const videos = isMobile ? [allVideos[0]] : allVideos;
  const total = videos.length;
  let loaded = 0;

  console.log(`🎥 Starting preload of ${total} videos for ${page} page ${isMobile ? '(mobile - hero only)' : '(desktop - all)'}`);
  
  const startTime = performance.now();

  // Create a timeout promise
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(`⏱️ Preload timeout reached for ${page} page`);
      resolve();
    }, PRELOAD_TIMEOUT);
  });

  // Load videos in parallel with timeout
  const loadPromise = Promise.all(
    videos.map(async (videoUrl) => {
      await preloadSingleVideo(videoUrl);
      loaded++;
      
      if (onProgress) {
        onProgress({
          total,
          loaded,
          progress: (loaded / total) * 100,
        });
      }
    })
  );

  // Race between loading and timeout
  await Promise.race([loadPromise, timeoutPromise]);

  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`✅ ${page} videos preload completed in ${duration}s (${loaded}/${total} loaded)`);
}

/**
 * Check if videos are already in browser cache
 */
export async function checkVideosInCache(page: keyof typeof PAGE_VIDEOS): Promise<boolean> {
  const videos = PAGE_VIDEOS[page];
  
  try {
    const cacheCheck = await Promise.all(
      videos.map(async (url) => {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      })
    );
    
    return cacheCheck.every(Boolean);
  } catch {
    return false;
  }
}
