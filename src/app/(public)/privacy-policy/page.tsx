import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: "Privacy Policy | Siraj Tech",
  description: "Privacy Policy for Siraj Tech",
  alternates: {
    canonical: "/privacy-policy",
  }
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
