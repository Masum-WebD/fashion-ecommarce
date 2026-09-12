'use client';

import { useSettings } from "@/providers/SettingsProvider";

interface ContactActionButtonsProps {
  className?: string;
}

const ContactActionButtons = ({ className = "flex flex-wrap gap-3 mb-6" }: ContactActionButtonsProps) => {
  const { settings } = useSettings();
  
  const rawWhatsApp = settings?.whatsapp_number || "";
  const whatsappNumber = rawWhatsApp.replace(/\D/g, "") || "8801706176403";

  // Use a sensible default for Messenger if facebook_url is a Facebook page
  let messengerLink = settings?.facebook_url || "https://m.me/sirajtech";
  if (messengerLink.includes('facebook.com') && !messengerLink.includes('messages')) {
      const parts = messengerLink.split('/').filter(Boolean);
      const username = parts[parts.length - 1];
      messengerLink = `https://m.me/${username}`;
  }

  return (
    <div className={className}>
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
        WhatsApp
      </a>
      <a
        href={messengerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 bg-[#0084FF] hover:bg-[#0073e6] text-white px-3.5 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.056-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.888-3.26-6.558 6.963z"/>
        </svg>
        Messenger
      </a>
    </div>
  );
};

export default ContactActionButtons;
