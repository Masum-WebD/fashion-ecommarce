import { Metadata } from 'next';
import ServiceDetailsClient from './ServiceDetailsClient';

export function generateMetadata({ params }: { params: { serviceId: string } }): Metadata {
  return {
    title: `Service Details | Siraj Tech`,
  };
}

export default function ServiceDetailsPage() {
  return <ServiceDetailsClient />;
}
