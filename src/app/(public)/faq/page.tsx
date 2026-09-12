import { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: "FAQ & Help | Siraj Tech",
  description: "সিরাজ টেক - FAQ ও সাহায্য পৃষ্ঠা। বাড়ির ডিজাইন, সেবা, যোগাযোগ সম্পর্কিত সকল প্রশ্নের উত্তর।",
  alternates: {
    canonical: "/faq",
  }
};

export default function FaqPage() {
  return <FaqClient />;
}
