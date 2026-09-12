'use client';

import { useEffect } from 'react';

export default function TestErrorPage() {
  useEffect(() => {
    // Throw an error after component mounts to trigger the Error Boundary
    throw new Error('This is a test error to verify ErrorTracker logging.');
  }, []);

  return (
    <div>
      <h1>Testing Error Tracker...</h1>
    </div>
  );
}
