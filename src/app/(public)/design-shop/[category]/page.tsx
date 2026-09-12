import { Metadata } from 'next';
import DesignShopClient from './DesignShopClient';

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  return {
    title: `Design Shop | Siraj Tech`,
  };
}

export default function DesignShopPage() {
  return <DesignShopClient />;
}
