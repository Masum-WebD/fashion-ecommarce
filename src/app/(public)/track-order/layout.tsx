import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order',
  description: 'Track your order status live at Siraj Tech.',
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
