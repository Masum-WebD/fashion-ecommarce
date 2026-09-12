import { Metadata } from 'next';
import TipsClient from './TipsClient';

export const metadata: Metadata = {
  title: "Tips and Tricks | Siraj Tech",
  description: "আধুনিক কৃষি পদ্ধতি, টেকসই নির্মাণ কৌশল এবং গৃহসজ্জার সেরা টিপসগুলো বিশেষজ্ঞরা শেয়ার করছেন আপনার সাথে।",
  alternates: {
    canonical: "/tips",
  }
};

export default function TipsPage() {
  return <TipsClient />;
}
