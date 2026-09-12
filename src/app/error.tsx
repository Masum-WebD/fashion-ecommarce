'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';
import { logErrorToBackend } from '@/lib/error-logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    
    logErrorToBackend({
      type: 'react',
      message: error.message || 'Next.js Error Boundary (500)',
      stack_trace: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20">
      <div className="w-full max-w-lg text-center space-y-6">
        
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-red-500 tracking-tighter">
            500
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            কিছু একটা সমস্যা হয়েছে
          </h2>
          <p className="text-gray-500 font-medium">
            দুঃখিত, আমাদের সার্ভারে একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। দয়া করে আবার চেষ্টা করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
          <button 
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors w-full sm:w-auto"
          >
            <RotateCcw size={18} />
            আবার চেষ্টা করুন
          </button>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors w-full sm:w-auto"
          >
            <Home size={18} />
            হোমপেজে ফিরে যান
          </Link>
        </div>

      </div>
    </div>
  );
}
