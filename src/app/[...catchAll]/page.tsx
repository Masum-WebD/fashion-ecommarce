import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api/config';

// This is a catch-all route that runs on the server before showing the 404 page.
// It allows us to perform true 301/302 HTTP redirects for SEO purposes based on the database.
export default async function CatchAll({ params }: { params: Promise<{ catchAll: string[] }> }) {
    const resolvedParams = await params;
    const path = '/' + (resolvedParams.catchAll?.join('/') || '');
    
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/redirects/resolve?url=${encodeURIComponent(path)}`, {
            // Revalidate every 60 seconds or use no-store if you want it completely dynamic
            next: { revalidate: 60 } 
        });
        
        if (res.ok) {
            const json = await res.json();
            
            if (json.status && json.redirect && json.target_url) {
                // Ensure the target URL is absolute or properly formatted if relative
                const target = json.target_url.startsWith('http') ? json.target_url : `/${json.target_url.replace(/^\//, '')}`;
                
                // Respect the status code from the database for SEO
                if (json.status_code == 301) {
                    permanentRedirect(target); // Sends HTTP 301 Permanent Redirect
                } else {
                    redirect(target); // Sends HTTP 307 Temporary Redirect (acting as 302)
                }
            }
        }
    } catch (err) {
        console.error("Failed to fetch redirect API", err);
    }
    
    // If no redirect exists in the database, trigger the actual 404 Not Found page
    notFound();
}
