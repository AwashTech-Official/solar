'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#140d09] px-4 text-center text-[#f4ece0]">
      <h1 className="text-4xl font-extrabold font-heading text-[#d4a24c] mb-3">Something went wrong</h1>
      <p className="text-[#b9a893] max-w-md text-sm mb-6 leading-relaxed">
        An unexpected error occurred while loading this page.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4a24c] text-[#140d09] font-bold text-xs uppercase tracking-wider hover:bg-[#e0b25d] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f1510] border border-[#d4a24c]/40 text-[#f4ece0] font-bold text-xs uppercase tracking-wider hover:bg-[#2a170f] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
