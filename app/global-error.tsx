'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#140d09] px-4 text-center text-[#f4ece0]">
        <h2 className="text-2xl font-bold text-[#d4a24c] mb-4">Application Error</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-[#d4a24c] text-[#140d09] font-semibold rounded-lg cursor-pointer"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
