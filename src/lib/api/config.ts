// API Base URL — set NEXT_PUBLIC_API_BASE_URL in .env.local or Vercel Environment Variables
const rawBaseUrl = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' ? 'https://aa.sirajtech.org' : 'http://127.0.0.1:8000');

export const API_BASE_URL = (rawBaseUrl as string || '').replace(/\/+$/, '');
