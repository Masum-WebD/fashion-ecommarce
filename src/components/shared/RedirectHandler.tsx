'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api/config';

export function RedirectHandler({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!pathname) return;

        const checkRedirect = async () => {
            try {
                // The API expects a 'url' query parameter
                const res = await fetch(`${API_BASE_URL}/api/v1/redirects/resolve?url=${encodeURIComponent(pathname)}`);
                const json = await res.json();
                
                if (json.status && json.redirect && json.target_url) {
                    // Ensure the target URL is absolute or properly formatted if relative
                    const target = json.target_url.startsWith('http') ? json.target_url : `/${json.target_url.replace(/^\//, '')}`;
                    router.replace(target);
                } else {
                    // Logged in backend as 404, now auto redirect to home
                    router.replace('/');
                }
            } catch (err) {
                // If error, just go to home page
                console.error("Failed to check for redirect", err);
                router.replace('/');
            }
        };

        checkRedirect();
    }, [pathname, router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc]">
                <div className="relative flex items-center justify-center w-20 h-20 mb-6">
                    {/* Outer glowing ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-primary/10"></div>
                    {/* Spinning gradient ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin"></div>
                    {/* Inner pulsing dot */}
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                </div>
                <p className="text-xs font-semibold tracking-[0.25em] text-gray-400 uppercase animate-pulse">
                    Redirecting
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
