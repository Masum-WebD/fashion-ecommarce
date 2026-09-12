'use client';

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackAffiliateClick } from "@/lib/api/affiliate";
import Cookies from "js-cookie";

export function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Next.js searchParams might be null during SSR in some edge cases
    if (!searchParams) return;

    const ref = searchParams.get("ref");
    const cmp = searchParams.get("cmp");

    if (ref) {
      processAffiliateClick(ref, cmp);
    }
  }, [searchParams]);

  const processAffiliateClick = async (ref: string, cmp: string | null) => {
    try {
      // trackAffiliateClick is already implemented in your api/affiliate.ts
      const data = await trackAffiliateClick(ref, cmp);

      if (data.success && data.data) {
        const cookieDays = data.data.cookie_days || 30;
        
        // Store in cookie using js-cookie
        Cookies.set("affiliate_ref", ref, { expires: cookieDays, path: '/', sameSite: 'lax' });
        if (cmp) {
          Cookies.set("affiliate_cmp", cmp, { expires: cookieDays, path: '/', sameSite: 'lax' });
        }

        console.log(`Affiliate tracking successful. Cookie set for ${cookieDays} days.`);
      }
    } catch (error) {
      console.error("Affiliate tracking error:", error);
    }
  };

  return null;
}
