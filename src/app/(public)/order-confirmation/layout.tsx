import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Thank you for your order at Siraj Tech.',
};

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
