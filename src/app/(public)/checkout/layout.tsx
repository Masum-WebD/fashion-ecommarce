import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order securely at Siraj Tech.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
