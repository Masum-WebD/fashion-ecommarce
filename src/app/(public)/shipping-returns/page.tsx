import { Metadata } from 'next';
import ShippingReturnsClient from './ShippingReturnsClient';
import { fetchShippingReturns } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchShippingReturns();
  return {
    title: data?.meta_title || "Shipping & Returns | Siraj Tech",
    description: data?.meta_description || "Shipping and Returns Policy for Siraj Tech",
    keywords: data?.meta_keywords || undefined,
    alternates: {
      canonical: "/shipping-returns",
    }
  };
}

export default async function ShippingReturnsPage() {
  const data = await fetchShippingReturns();
  return <ShippingReturnsClient initialData={data} />;
}
