'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Zap, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/src/config/site';
import { useLanguage } from '@/src/context/LanguageContext';

interface GeometryConfig {
  cardWidth: number;
  cardHeight: number;
  radius: number;
  perspective: number;
  speed: number;
}

export const Showcase3DSection: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const baseAutoRotationRef = useRef<number>(0);
  const interactiveOffsetRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const [isDraggingState, setIsDraggingState] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(1200);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    timer = setTimeout(handleResize, 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const geometry = useMemo<GeometryConfig>(() => {
    if (windowWidth >= 1024) {
      return {
        cardWidth: 300,
        cardHeight: 420,
        radius: 360,
        perspective: 1200,
        speed: 360 / 28,
      };
    } else if (windowWidth >= 640) {
      return {
        cardWidth: 240,
        cardHeight: 340,
        radius: 280,
        perspective: 900,
        speed: 360 / 30,
      };
    } else {
      return {
        cardWidth: 190,
        cardHeight: 270,
        radius: 210,
        perspective: 700,
        speed: 360 / 32,
      };
    }
  }, [windowWidth]);

  useEffect(() => {
    const loop = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      baseAutoRotationRef.current = (baseAutoRotationRef.current + geometry.speed * dt) % 360;

      if (!isDraggingRef.current && Math.abs(dragVelocityRef.current) > 0.001) {
        interactiveOffsetRef.current += dragVelocityRef.current * dt * 60;
        dragVelocityRef.current *= Math.pow(0.92, dt * 60);
      }

      const totalAngle = (baseAutoRotationRef.current + interactiveOffsetRef.current) % 360;

      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${totalAngle}deg)`;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [geometry.speed]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerXRef.current = e.clientX;
    dragVelocityRef.current = 0;
    setIsDraggingState(true);
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;

    const angleDelta = (deltaX / window.innerWidth) * 220;
    interactiveOffsetRef.current += angleDelta;
    dragVelocityRef.current = angleDelta;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);
    if (containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may have already lapsed
      }
    }
  }, []);

  const nudgeCarousel = useCallback((direction: 'left' | 'right') => {
    const angleStep = 360 / siteConfig.showcase3D.items.length;
    dragVelocityRef.current = direction === 'left' ? -angleStep * 0.4 : angleStep * 0.4;
  }, []);

  const items = siteConfig.showcase3D.items;

  return (
    <section
      id="hardware"
      className="relative w-full py-20 sm:py-28 bg-[#0B241B] overflow-hidden select-none border-t border-[rgba(18,55,42,0.3)]"
      aria-label="Explore a Commercial Solar System"
    >
      {/* Background Ambient Depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(47, 125, 87, 0.16) 0%, rgba(11, 36, 27, 0.6) 50%, transparent 100%)',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(183,217,87,0.25)] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(183,217,87,0.15)] to-transparent" />

      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#12372A] border border-[#2F7D57]/40 text-[#B7D957] text-[11px] font-mono font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>{t.showcase3D.badge}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-[#FFFFFF]">
          {t.showcase3D.title}
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#F5F7F2]/80 font-normal leading-relaxed">
          {t.showcase3D.subtitle}
        </p>

        <div className="mt-3 text-xs font-mono text-[#647368]">
          Illustrative equipment and installation imagery
        </div>
      </div>

      {/* 3D Carousel Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
          isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          height: geometry.cardHeight + 140,
          perspective: `${geometry.perspective}px`,
          perspectiveOrigin: '50% 50%',
          touchAction: 'pan-y',
        }}
      >
        <div
          className="absolute pointer-events-none rounded-full blur-2xl"
          style={{
            width: geometry.radius * 2.2,
            height: 120,
            bottom: 40,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(47,125,87,0.15) 45%, transparent 75%)',
          }}
        />

        {/* 3D Rotating Ring */}
        <div
          ref={ringRef}
          className="relative flex items-center justify-center"
          style={{
            width: geometry.cardWidth,
            height: geometry.cardHeight,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {items.map((item, index) => {
            const angle = (360 / items.length) * index;

            return (
              <div
                key={item.id}
                className="absolute inset-0 rounded-lg overflow-hidden bg-[#12372A] border border-[rgba(245,247,242,0.15)] shadow-2xl transition-shadow duration-300 group"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${geometry.radius}px)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  width: geometry.cardWidth,
                  height: geometry.cardHeight,
                }}
              >
                <div className="relative w-full h-[58%] overflow-hidden bg-[#0B241B]">
                  <Image
                    src={item.imageUrl}
                    alt={`${item.title} - ${siteConfig.businessName}`}
                    fill
                    sizes="(max-width: 640px) 190px, (max-width: 1024px) 240px, 300px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-102 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#12372A] via-[#12372A]/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B241B]/95 backdrop-blur-md border border-[rgba(245,247,242,0.15)] text-[10px] font-mono font-bold text-[#B7D957] shadow-md">
                    <span>STAGE 0{index + 1}</span>
                    <span className="text-[#647368]">/</span>
                    <span className="text-[#647368]">06</span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#0B241B]/90 border border-[#B7D957]/30 text-[9px] font-mono font-bold uppercase tracking-wider text-[#B7D957]">
                    ILLUSTRATIVE
                  </div>

                  <div className="absolute bottom-2 inset-x-2 px-2 py-0.5 rounded bg-[#0B241B]/85 backdrop-blur-sm text-[9px] text-[#F5F7F2]/80 text-center font-mono">
                    Engineering Workflow
                  </div>
                </div>

                <div className="p-4 sm:p-5 h-[42%] flex flex-col justify-between bg-[#12372A]">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-heading text-[#FFFFFF] group-hover:text-[#B7D957] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#F5F7F2]/75 leading-snug line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(245,247,242,0.1)]">
                    <span className="text-[10px] font-semibold text-[#B7D957] tracking-tight line-clamp-1 font-mono">
                      {item.spec}
                    </span>
                    <div className="w-5 h-5 rounded bg-[#0B241B] border border-[rgba(245,247,242,0.12)] flex items-center justify-center text-[#647368] group-hover:text-[#B7D957] transition-colors shrink-0 ml-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D57]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interaction Controls */}
      <div className="relative max-w-sm mx-auto mt-6 flex items-center justify-center gap-4 z-10 px-4">
        <button
          type="button"
          onClick={() => nudgeCarousel('left')}
          className="p-2.5 rounded-md bg-[#12372A] border border-[rgba(245,247,242,0.2)] text-[#F5F7F2] hover:text-[#B7D957] hover:border-[#2F7D57] active:scale-95 transition-all shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D57]"
          aria-label="Rotate system carousel left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="px-4 py-1.5 rounded-md bg-[#12372A]/90 border border-[rgba(245,247,242,0.2)] backdrop-blur-md flex items-center gap-2 text-[10px] font-mono font-bold text-[#F5F7F2]/90 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B7D957] animate-pulse" />
          <span>{t.showcase3D.dragPrompt}</span>
        </div>

        <button
          type="button"
          onClick={() => nudgeCarousel('right')}
          className="p-2.5 rounded-md bg-[#12372A] border border-[rgba(245,247,242,0.2)] text-[#F5F7F2] hover:text-[#B7D957] hover:border-[#2F7D57] active:scale-95 transition-all shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D57]"
          aria-label="Rotate system carousel right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Asset Credit & Licensing Footer */}
      <div className="mt-8 text-center text-[10px] font-mono text-[#647368] px-4 max-w-xl mx-auto">
        Stage 5 Image: Turner Energy Storage Project, Pullman, WA. Licensed under CC BY-SA 4.0 via Wikimedia Commons. Illustrative process storytelling.
      </div>
    </section>
  );
};
