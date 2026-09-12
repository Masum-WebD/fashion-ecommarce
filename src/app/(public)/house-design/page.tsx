import { Metadata } from 'next';
import HouseDesignClient from './HouseDesignClient';

export const metadata: Metadata = {
  title: "House & Factory Design | Siraj Tech",
  description: "আধুনিক স্থাপত্যশৈলী এবং নিখুঁত প্রকৌশলবিদ্যার সমন্বয়ে আপনার স্বপ্নের বাড়ি বা ফ্যাক্টরির ডিজাইন তৈরি করতে আমরা প্রতিশ্রুতিবদ্ধ।",
  alternates: {
    canonical: "/house-design",
  }
};

export default function HouseDesignPage() {
  return <HouseDesignClient />;
}
