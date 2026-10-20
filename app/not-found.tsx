import React from 'react';
import Link from 'next/link';
import { Sun, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a101d] px-4 text-center text-[#f8fafc]">
      <div className="w-16 h-16 rounded-2xl bg-[#162238] border border-[#f59e0b]/40 text-[#f59e0b] flex items-center justify-center mb-6 shadow-xl">
        <Sun className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-extrabold font-heading text-white mb-3">404</h1>
      <h2 className="text-xl font-bold font-heading text-[#f59e0b] mb-2">Solar Resource or Page Not Found</h2>
      <p className="text-[#94a3b8] max-w-md text-sm mb-8 leading-relaxed">
        The commercial solar engineering specification, project documentation, or page you are looking for does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f59e0b] text-[#0e1626] font-bold text-xs uppercase tracking-wider hover:bg-[#d97706] transition-all shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Commercial Solar Portal</span>
      </Link>
    </div>
  );
}
