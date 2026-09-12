import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | Siraj Tech - Architectural & Structural Design",
  description: "সিরাজ টেক - আর্কিটেকচারাল ডিজাইন, স্ট্রাকচারাল ডিজাইন, ইলেক্ট্রিক্যাল ডিজাইন, প্লাম্বিং ডিজাইন, 3D ডিজাইন ও নির্মাণ পরামর্শ সেবা।",
  alternates: {
    canonical: "/services",
  }
};

export default function ServicesPage() {
  return <ServicesClient />;
}
