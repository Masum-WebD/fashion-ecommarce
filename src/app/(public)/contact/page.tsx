import { Metadata } from 'next';
import ContactSection from '@/components/ContactSection';
import { fetchContacts } from '@/lib/api';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Siraj Tech",
  alternates: {
    canonical: "/contact",
  }
};

export default async function ContactPage() {
  let contactData = null;
  
  try {
    contactData = await fetchContacts();
  } catch (error) {
    console.error("Failed to fetch contact data", error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-white">
        <ContactSection data={contactData} />
      </main>
    </div>
  );
}
