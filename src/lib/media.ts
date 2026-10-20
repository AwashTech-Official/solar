/**
 * Media optimization utilities for commercial solar video streaming and poster extraction.
 */

interface OptimizeOptions {
  width: number;
}

/**
 * Optimizes video URLs for bandwidth and fast frame seeking.
 * Injects Cloudinary transformations if present, or passes direct MP4s cleanly.
 */
export function optimizeVideoUrl(url: string, { width }: OptimizeOptions): string {
  if (!url) return '';
  if (url.includes('/video/upload/')) {
    const transform = `f_mp4,vc_h264,ac_none,q_auto,w_${width}/`;
    return url.replace('/video/upload/', `/video/upload/${transform}`);
  }
  return url;
}

/**
 * Generates an instant poster frame at second 0 with .jpg extension.
 * Ensures an image URL (never raw .mp4) is returned for Next.js Image loader.
 */
export function getPosterUrl(url: string, { width }: OptimizeOptions): string {
  if (!url) {
    return `https://picsum.photos/seed/ethiopia-solar-poster-${width}/1920/1080`;
  }

  // Cloudinary video poster extraction
  if (url.includes('/video/upload/')) {
    const transform = `so_0,w_${width},q_auto,f_auto/`;
    const transformedUrl = url.replace('/video/upload/', `/video/upload/${transform}`);
    return transformedUrl.replace(/\.[a-zA-Z0-9]+$/, '.jpg');
  }

  // ImageKit video thumbnail endpoint
  if (url.includes('ik.imagekit.io')) {
    // Strip query parameters if any, and append ImageKit thumbnail generator
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}/ik-thumbnail.jpg?tr=w-${width}`;
  }

  // Fallback high-fidelity illustrative poster frame
  return `https://picsum.photos/seed/ethiopia-solar-poster-${width}/1920/1080`;
}
