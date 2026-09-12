"use client";

import { useEffect } from "react";
import { logErrorToBackend } from "@/lib/error-logger";

export default function ErrorTracker() {
  useEffect(() => {
    // Catch unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      logErrorToBackend({
        type: 'js',
        message: error?.message || 'Unhandled Promise Rejection',
        stack_trace: error?.stack || String(error),
      });
    };

    // Catch general JS runtime errors and resource loading errors (like images)
    const handleError = (event: ErrorEvent) => {
      // Differentiate between JS execution error and resource loading error
      const target = event.target as HTMLElement;

      // If the target is an img, script, or link, it's a resource error
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        const url = (target as HTMLImageElement | HTMLScriptElement).src || (target as HTMLLinkElement).href;
        
        // Ignore known tracking scripts that get blocked by AdBlockers
        if (url && (url.includes('googletagmanager.com') || url.includes('clarity.ms') || url.includes('google-analytics.com') || url.includes('facebook.com'))) {
          return;
        }

        logErrorToBackend({
          type: target.tagName === 'IMG' ? 'image' : 'js',
          message: `Failed to load resource: ${target.tagName}`,
          url: url || window.location.href,
        });
      } else {
        // Normal JS Runtime Error
        logErrorToBackend({
          type: 'js',
          message: event.message,
          file: event.filename,
          line: event.lineno,
          stack_trace: event.error?.stack,
        });
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    // Setting useCapture to true to catch resource loading errors that do not bubble
    window.addEventListener("error", handleError, true);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
