'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, ChevronUp, FastForward, Volume2, VolumeX } from 'lucide-react';
import { siteConfig } from '@/src/config/site';
import { optimizeVideoUrl, getPosterUrl } from '@/src/lib/media';
import { useLanguage } from '@/src/context/LanguageContext';

export interface VideoSectionProps {
  id: string;
  index: number;
  total?: number;
  videoUrl: string;
  eyebrow?: string;
  headline: string;
  microLabel?: string;
  subtext: string;
  buttonLabel?: string;
  buttonHref?: string;
  scrollLength?: string;
  autoplayRate?: number;
  boostedRate?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export type SectionState = 'waiting' | 'playing' | 'holding' | 'done';

export const VideoSection: React.FC<VideoSectionProps> = ({
  id,
  index,
  total = 3,
  videoUrl,
  eyebrow,
  headline,
  microLabel,
  subtext,
  buttonLabel,
  buttonHref = '#solutions',
  autoplayRate = 1.5,
  boostedRate = 2.0,
  isMuted = true,
  onToggleMute,
}) => {
  const { t } = useLanguage();
  // DOM References
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  // React State for UI indicators
  const [isDone, setIsDone] = useState<boolean>(false);
  const [arrivalDir, setArrivalDir] = useState<'down' | 'up'>('down');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Behavioral & Lifecycle Refs
  const stateRef = useRef<SectionState>('waiting');
  const startPlaybackRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const retryCountRef = useRef<number>(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingPromiseRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const currentRateRef = useRef<number>(autoplayRate);
  const lastBoostTimeRef = useRef<number>(0);
  const holdStartTimeRef = useRef<number>(0);
  const finishedTimeRef = useRef<number>(0);
  const lastTimeProgressRef = useRef<number>(0);
  const lastCurrentTimeRef = useRef<number>(0);
  const lastTopRef = useRef<number>(0);
  const isAutoplayBlockedRef = useRef<boolean>(false);
  const prefersReducedMotionRef = useRef<boolean>(false);
  const isSaveDataRef = useRef<boolean>(false);
  const targetSrcRef = useRef<string>('');
  const arrivalDirectionRef = useRef<'down' | 'up'>('down');
  const isDebugRef = useRef<boolean>(false);

  const posterUrl = getPosterUrl(videoUrl, { width: 1280 });

  const transitionState = useCallback((newState: SectionState, reason?: string) => {
    if (stateRef.current === newState) return;
    stateRef.current = newState;
    queueMicrotask(() => {
      if (newState === 'done') {
        setIsDone(true);
      } else if (newState === 'waiting') {
        setIsDone(false);
      }
    });
  }, []);

  const getVisibleRatio = useCallback((): { ratio: number; top: number; bottom: number; height: number } => {
    const section = sectionRef.current;
    if (!section || typeof window === 'undefined') {
      return { ratio: 0, top: 0, bottom: 0, height: 0 };
    }
    const rect = section.getBoundingClientRect();
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(window.innerHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;
    const clamped = Math.min(Math.max(ratio, 0), 1);
    return { ratio: clamped, top: rect.top, bottom: rect.bottom, height: rect.height };
  }, []);

  const ensureVideoSrc = useCallback((): HTMLVideoElement | null => {
    const video = videoRef.current;
    if (!video) return null;

    if (!targetSrcRef.current && typeof window !== 'undefined') {
      const width = window.innerWidth < 768 ? 720 : 1280;
      targetSrcRef.current = optimizeVideoUrl(videoUrl, { width });
    }

    if (!video.src || video.src === '' || video.currentSrc === '') {
      video.src = targetSrcRef.current;
      video.preload = 'auto';
    }
    return video;
  }, [videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = Boolean(isMuted);
    }
  }, [isMuted]);

  const enterHolding = useCallback((dir: 'down' | 'up' = 'down') => {
    if (stateRef.current === 'done') return;
    if (prefersReducedMotionRef.current || isSaveDataRef.current) return;

    arrivalDirectionRef.current = dir;
    queueMicrotask(() => {
      setArrivalDir(dir);
    });
    transitionState('holding', 'enter-holding');

    const now = performance.now();
    holdStartTimeRef.current = now;
    lastTimeProgressRef.current = now;

    const video = videoRef.current;
    if (video) {
      lastCurrentTimeRef.current = video.currentTime;
      video.playbackRate = currentRateRef.current;
      if (video.paused && !isAutoplayBlockedRef.current) {
        video.muted = Boolean(isMuted);
        video.play().catch(() => {
          isAutoplayBlockedRef.current = true;
        });
      }
    }
  }, [isMuted, transitionState]);

  const releaseHold = useCallback((reason?: string) => {
    if (stateRef.current === 'done') return;
    transitionState('done', reason);
    finishedTimeRef.current = performance.now();

    if (skipButtonRef.current) {
      skipButtonRef.current.style.opacity = '0';
      skipButtonRef.current.style.pointerEvents = 'none';
    }

    if (progressBarRef.current) {
      progressBarRef.current.style.transform = 'scaleY(1)';
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = '100%';
    }
  }, [transitionState]);

  const resetSection = useCallback(() => {
    if (stateRef.current === 'waiting') return;

    const video = videoRef.current;
    if (video) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}

      if (typeof window !== 'undefined' && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (Math.abs(rect.top) > window.innerHeight * 2) {
          video.removeAttribute('src');
          video.load();
        }
      }
    }

    transitionState('waiting', 'reset-below-30%');
    holdStartTimeRef.current = 0;
    lastBoostTimeRef.current = 0;
    finishedTimeRef.current = 0;
    currentRateRef.current = autoplayRate;

    if (posterRef.current) {
      posterRef.current.style.opacity = '1';
      posterRef.current.style.pointerEvents = 'auto';
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = 'scaleY(0)';
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = '0%';
    }
    if (skipButtonRef.current) {
      skipButtonRef.current.style.opacity = '0';
      skipButtonRef.current.style.pointerEvents = 'none';
    }
  }, [autoplayRate, transitionState]);

  const startPlayback = useCallback(async () => {
    if (stateRef.current !== 'waiting') return;
    if (isPlayingPromiseRef.current) return;
    if (prefersReducedMotionRef.current || isSaveDataRef.current) {
      transitionState('done', 'reduced-motion-bypass');
      return;
    }

    const video = ensureVideoSrc();
    if (!video) return;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise<void>((resolve) => {
        const onMeta = () => {
          video.removeEventListener('loadedmetadata', onMeta);
          resolve();
        };
        video.addEventListener('loadedmetadata', onMeta);
        setTimeout(resolve, 800);
      });
    }

    video.muted = Boolean(isMuted);
    video.playsInline = true;
    try {
      video.currentTime = 0;
    } catch {}
    video.playbackRate = autoplayRate;

    isPlayingPromiseRef.current = true;
    try {
      await video.play();
      isPlayingPromiseRef.current = false;
      retryCountRef.current = 0;

      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect && Math.abs(rect.top) <= 4) {
        enterHolding('down');
      } else {
        transitionState('playing', 'play-started');
      }
    } catch (err: any) {
      isPlayingPromiseRef.current = false;
      const errorName = err?.name || '';

      if (errorName === 'NotAllowedError') {
        isAutoplayBlockedRef.current = true;
        const handleUserGesture = () => {
          document.removeEventListener('touchend', handleUserGesture);
          document.removeEventListener('click', handleUserGesture);
          isAutoplayBlockedRef.current = false;
          if (videoRef.current && stateRef.current === 'waiting') {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => {
              transitionState('playing', 'gesture-unlock');
            }).catch(() => {});
          }
        };
        document.addEventListener('touchend', handleUserGesture, { once: true, passive: true });
        document.addEventListener('click', handleUserGesture, { once: true, capture: true });
      } else {
        if (retryCountRef.current < 5) {
          retryCountRef.current += 1;
          if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
          retryTimerRef.current = setTimeout(() => {
            if (stateRef.current === 'waiting') {
              startPlaybackRef.current();
            }
          }, 300);
        }
      }
    }
  }, [autoplayRate, ensureVideoSrc, enterHolding, isMuted, transitionState]);

  useEffect(() => {
    startPlaybackRef.current = startPlayback;
  }, [startPlayback]);

  const evaluateStateMachine = useCallback(() => {
    const { ratio, top } = getVisibleRatio();

    if (stateRef.current === 'waiting' && ratio >= 0.6) {
      startPlayback();
    } else if (stateRef.current !== 'waiting' && ratio < 0.3) {
      resetSection();
    }

    if (stateRef.current === 'playing') {
      if (Math.abs(top) <= 4) {
        enterHolding('down');
      }
    }
  }, [getVisibleRatio, startPlayback, resetSection, enterHolding]);

  const triggerBoost = useCallback(() => {
    if (stateRef.current === 'holding') {
      lastBoostTimeRef.current = performance.now();
      const video = videoRef.current;
      if (video && video.paused && !isAutoplayBlockedRef.current) {
        video.muted = true;
        video.play().catch(() => {
          isAutoplayBlockedRef.current = true;
        });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.search.includes('debug=1')) {
        isDebugRef.current = true;
      }
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotionRef.current = motionQuery.matches;

      const conn = (navigator as any).connection;
      if (conn?.saveData) {
        isSaveDataRef.current = true;
      }

      if (prefersReducedMotionRef.current || isSaveDataRef.current) {
        transitionState('done', 'reduced-motion');
      }
    }
  }, [transitionState]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlaying = () => {
      if (posterRef.current) {
        posterRef.current.style.opacity = '0';
        posterRef.current.style.pointerEvents = 'none';
      }
    };

    const onMediaReady = () => {
      evaluateStateMachine();
    };

    const onEnded = () => {
      if (video.duration) {
        try {
          video.currentTime = video.duration - 0.05;
        } catch {}
        video.pause();
      }
      releaseHold('video-ended');
    };

    const onError = () => {
      video.pause();
      releaseHold('video-error');
    };

    video.addEventListener('playing', onPlaying);
    video.addEventListener('loadedmetadata', onMediaReady);
    video.addEventListener('canplay', onMediaReady);
    video.addEventListener('canplaythrough', onMediaReady);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    const onVisibilityChange = () => {
      if (document.hidden && !video.paused) {
        video.pause();
      } else if (!document.hidden && stateRef.current === 'holding') {
        video.muted = true;
        video.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('loadedmetadata', onMediaReady);
      video.removeEventListener('canplay', onMediaReady);
      video.removeEventListener('canplaythrough', onMediaReady);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [evaluateStateMachine, releaseHold]);

  useEffect(() => {
    ensureVideoSrc();
    const rafId = requestAnimationFrame(() => {
      evaluateStateMachine();
      if (index === 0 && typeof window !== 'undefined' && window.scrollY < 20) {
        startPlayback();
      }
    });

    const handleScrollOrResize = () => {
      evaluateStateMachine();
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    const intervalId = setInterval(() => {
      if (sectionRef.current && typeof window !== 'undefined') {
        const rect = sectionRef.current.getBoundingClientRect();
        const distFromScreen = Math.min(
          Math.abs(rect.top),
          Math.abs(rect.bottom - window.innerHeight)
        );
        if (distFromScreen < window.innerHeight * 1.5) {
          evaluateStateMachine();
        }
      }
    }, 200);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      clearInterval(intervalId);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [index, ensureVideoSrc, evaluateStateMachine, startPlayback]);

  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      lastTopRef.current = section.getBoundingClientRect().top;
    }

    const onScrollSnap = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      const rect = sec.getBoundingClientRect();
      const prevTop = lastTopRef.current;
      const currentTop = rect.top;
      lastTopRef.current = currentTop;

      if (stateRef.current === 'waiting' || stateRef.current === 'playing') {
        if (prevTop > 4 && currentTop <= 4 && rect.bottom > window.innerHeight * 0.4) {
          window.scrollTo({
            top: window.scrollY + currentTop,
            behavior: 'auto',
          });
          enterHolding('down');
        } else if (prevTop < -4 && currentTop >= -4 && currentTop < window.innerHeight * 0.5) {
          window.scrollTo({
            top: window.scrollY + currentTop,
            behavior: 'auto',
          });
          enterHolding('up');
        } else if (index === 0 && window.scrollY <= 4) {
          enterHolding('up');
        }
      }
    };

    window.addEventListener('scroll', onScrollSnap, { passive: true });
    return () => window.removeEventListener('scroll', onScrollSnap);
  }, [index, enterHolding]);

  useEffect(() => {
    const shouldIntercept = (): boolean => {
      const isHolding = stateRef.current === 'holding';
      const inFinishBuffer =
        stateRef.current === 'done' &&
        finishedTimeRef.current > 0 &&
        performance.now() - finishedTimeRef.current < 600;

      if (!isHolding && !inFinishBuffer) return false;
      if (prefersReducedMotionRef.current || isSaveDataRef.current) return false;

      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'IFRAME')
      ) {
        return false;
      }

      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < window.innerHeight * 0.3) {
        return false;
      }

      if (Math.abs(rect.top) > 4 && Math.abs(rect.top) < window.innerHeight * 0.5) {
        window.scrollTo({
          top: window.scrollY + rect.top,
          behavior: 'auto',
        });
      }

      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0 && shouldIntercept()) {
        e.preventDefault();
        triggerBoost();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const deltaY = Math.abs(touchStartY - e.touches[0].clientY);
      if (deltaY > 1 && shouldIntercept()) {
        e.preventDefault();
        triggerBoost();
      }
    };

    const onTouchEnd = () => {
      const video = videoRef.current;
      if (video && video.paused && stateRef.current === 'holding') {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const interceptedKeys = [
        ' ',
        'Spacebar',
        'PageDown',
        'PageUp',
        'ArrowDown',
        'ArrowUp',
        'Home',
        'End',
      ];
      if (interceptedKeys.includes(e.key) && shouldIntercept()) {
        e.preventDefault();
        triggerBoost();
      }
    };

    const onGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactiveEl = target.closest('a, button');
      if (interactiveEl && stateRef.current === 'holding') {
        releaseHold('interactive-click');
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    document.addEventListener('click', onGlobalClick, { capture: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onGlobalClick, { capture: true });
    };
  }, [triggerBoost, releaseHold]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const frameLoop = () => {
      const now = performance.now();
      const dur = video.duration;

      if (dur && !isNaN(dur) && dur > 0) {
        const pct = Math.min(Math.max((video.currentTime / dur) * 100, 0), 100);
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleY(${pct / 100})`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.round(pct)}%`;
        }
      }

      if (stateRef.current === 'holding') {
        const isBoosted = now - lastBoostTimeRef.current < 400;
        const targetRate = isBoosted ? boostedRate : autoplayRate;
        currentRateRef.current += (targetRate - currentRateRef.current) * 0.1;
        if (Math.abs(video.playbackRate - currentRateRef.current) > 0.02) {
          video.playbackRate = currentRateRef.current;
        }

        if (now - holdStartTimeRef.current > 15000) {
          releaseHold('hold-timeout-15s');
        }

        if (Math.abs(video.currentTime - lastCurrentTimeRef.current) > 0.04) {
          lastCurrentTimeRef.current = video.currentTime;
          lastTimeProgressRef.current = now;
        } else if (now - lastTimeProgressRef.current > 4000) {
          video.pause();
          releaseHold('stalled-4s');
        }

        if (now - holdStartTimeRef.current > 2000 && skipButtonRef.current) {
          skipButtonRef.current.style.opacity = '1';
          skipButtonRef.current.style.pointerEvents = 'auto';
        }
      }

      rafIdRef.current = requestAnimationFrame(frameLoop);
    };

    rafIdRef.current = requestAnimationFrame(frameLoop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [autoplayRate, boostedRate, releaseHold]);

  const handleSkipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    releaseHold('skip-clicked');

    if (arrivalDirectionRef.current === 'up') {
      const prevSection = sectionRef.current?.previousElementSibling;
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const nextSection = sectionRef.current?.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full h-[100svh] overflow-hidden bg-[#0B241B]"
      aria-label={`${headline} - Chapter ${index + 1}`}
    >
      {/* Background Instant Poster Frame */}
      <div
        ref={posterRef}
        className="absolute inset-0 z-0 w-full h-full transition-opacity duration-300 ease-out"
      >
        <Image
          src={posterUrl}
          alt={headline}
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Autoplay & Scroll-Boosted Video */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 z-1 w-full h-full object-cover select-none pointer-events-none"
      />

      {/* Debug Info if requested */}
      {debugInfo && (
        <div className="fixed top-2 left-2 z-50 px-3 py-1 rounded bg-black/80 text-emerald-400 font-mono text-[11px] shadow-md pointer-events-none border border-emerald-500/40">
          {debugInfo}
        </div>
      )}

      {/* Scrubbing Bar & Percentage Indicator */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 select-none pointer-events-none">
        <div className="relative w-1 sm:w-1.5 h-32 sm:h-44 bg-white/10 rounded-full overflow-hidden backdrop-blur-xs shadow-inner border border-white/5">
          <div
            ref={progressBarRef}
            className="w-full bg-[#2F7D57] rounded-full origin-top transition-transform duration-75 ease-linear shadow-sm shadow-[#B7D957]/40"
            style={{ height: '100%', transform: 'scaleY(0)' }}
          />
        </div>
        <span
          ref={progressTextRef}
          className="text-[11px] sm:text-xs font-bold text-white tracking-wider tabular-nums drop-shadow-md font-mono"
        >
          0%
        </span>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        ref={skipButtonRef}
        onClick={handleSkipClick}
        className="absolute top-20 md:top-24 right-4 sm:right-6 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B241B]/85 hover:bg-[#12372A] text-[#F5F7F2] text-xs font-medium border border-[rgba(245,247,242,0.15)] shadow-sm transition-all opacity-0 pointer-events-none cursor-pointer"
        aria-label={t.hero.skip}
      >
        <span>{t.hero.skip}</span>
        <FastForward className="w-3.5 h-3.5 text-[#B7D957]" />
      </button>

      {/* Finishing Cue */}
      {isDone && (
        <aside
          aria-label="Section completed"
          className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B241B]/90 backdrop-blur-md border border-[rgba(245,247,242,0.2)] text-[#F5F7F2] text-xs font-medium shadow-lg animate-bounce select-none pointer-events-none"
        >
          <span>{arrivalDir === 'up' ? 'Scroll up' : t.hero.scrollPrompt}</span>
          {arrivalDir === 'up' ? (
            <ChevronUp className="w-4 h-4 text-[#B7D957]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#B7D957]" />
          )}
        </aside>
      )}

      {/* Bottom Dark Gradient Overlay (Narrow, safe area clear of footage focal point) */}
      <div className="absolute bottom-0 left-0 right-0 h-[46%] md:h-[40%] bg-gradient-to-t from-[#0B241B] via-[#0B241B]/85 to-transparent z-10 flex flex-col justify-end pointer-events-auto">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-7 md:pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#B7D957]">
              <span>{eyebrow || `0${index + 1} / CHAPTER`}</span>
              {microLabel && (
                <>
                  <span aria-hidden="true" className="text-[#647368]">·</span>
                  <span className="font-sans normal-case tracking-normal text-xs text-[#E2E8F0]/90">
                    {microLabel}
                  </span>
                </>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FFFFFF] leading-tight font-heading">
              {headline}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#F5F7F2]/90 leading-relaxed font-normal max-w-2xl">
              {subtext}
            </p>
          </div>

          <div className="shrink-0 pt-2 md:pt-0 flex items-center gap-3">
            {buttonLabel && (
              <a
                href={buttonHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#2F7D57] hover:bg-[#12372A] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-[0.98] border border-[#B7D957]/30 hover:border-[#B7D957] group whitespace-nowrap cursor-pointer"
              >
                <span>{buttonLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#B7D957] transition-transform group-hover:translate-x-0.5" />
              </a>
            )}

            <button
              type="button"
              onClick={onToggleMute}
              className="p-3 rounded-md bg-[#12372A] hover:bg-[#1b4e3c] border border-[rgba(245,247,242,0.15)] text-[#647368] hover:text-[#B7D957] transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
              aria-label={isMuted ? t.hero.muteTooltip : t.hero.unmuteTooltip}
              title={isMuted ? t.hero.muteTooltip : t.hero.unmuteTooltip}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[#647368]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#B7D957]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
