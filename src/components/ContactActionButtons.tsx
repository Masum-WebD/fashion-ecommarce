'use client';

import { MessageCircle } from "lucide-react";
import { useSettings } from "@/providers/SettingsProvider";

interface ContactActionButtonsProps {
  className?: string;
}

const ContactActionButtons = ({ className = "flex flex-wrap gap-3 mb-8" }: ContactActionButtonsProps) => {
  const { settings } = useSettings();
  
  const rawWhatsApp = settings?.whatsapp_number || "";
  const whatsappNumber = rawWhatsApp.replace(/\D/g, "") || "8801706176403";

  return (
    null
  );
};

export default ContactActionButtons;
