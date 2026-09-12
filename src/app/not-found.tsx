import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { RedirectHandler } from '@/components/shared/RedirectHandler';

export const metadata: Metadata = {
  title: 'Redirecting... | Siraj Tech',
  description: 'Checking URL...',
};

export default function NotFound() {
  return (
    <RedirectHandler>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20">
        <div className="w-full max-w-lg text-center space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-8xl font-bold text-gray-900 tracking-tighter">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800">
              পেজটি পাওয়া যায়নি
            </h2>
            <p className="text-gray-500 font-medium">
              দুঃখিত, আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা লিংকটি ভুল।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-600 transition-colors w-full sm:w-auto"
            >
              <Home size={18} />
              হোমপেজে ফিরে যান
            </Link>
            <Link 
              href="/shop"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              শপে যান
            </Link>
          </div>

        </div>
      </div>
    </RedirectHandler>
  );
}
