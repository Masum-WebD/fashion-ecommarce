'use client';

import { useState } from "react";
import { useSettings } from "@/providers/SettingsProvider";
import { MessageCircle, X, Phone, Send } from "lucide-react"; // Send can be used for Telegram if no specific icon

const WhatsAppButton = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const messengerUrl = settings?.sidebar_messenger;
  const whatsappUrl = settings?.sidebar_whatsapp;
  const phone = settings?.sidebar_phone;
  const telegramUrl = settings?.sidebar_telegram;

  // Format WhatsApp link dynamically if configured
  const waNumber = whatsappUrl ? whatsappUrl.replace(/\D/g, "") : null;
  const formattedWaUrl = waNumber ? `https://wa.me/${waNumber}` : null;

  // Don't render the button at all if no contact options are available
  if (!messengerUrl && !whatsappUrl && !phone && !telegramUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-16 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {/* Menu items */}
      <div 
        className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom ${
          isOpen ? "scale-100 opacity-100 translate-y-0 visible" : "scale-50 opacity-0 translate-y-10 invisible"
        }`}
      >
        {/* Telegram Button */}
        {telegramUrl && (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on Telegram"
            className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-[#0088cc] shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <Send className="h-5 w-5 text-white -ml-0.5 mt-0.5" />
            <span className="absolute right-14 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
              Telegram
            </span>
          </a>
        )}

        {/* Phone Button */}
        {phone && (
          <a
            href={`tel:${phone}`}
            aria-label="Call Us"
            className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <Phone className="h-5 w-5 text-white" />
            <span className="absolute right-14 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
              Call Us
            </span>
          </a>
        )}

        {/* Messenger Button */}
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on Messenger"
            className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-[#006AFF] via-[#00B2FE] to-[#00E5FF] shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.518 3.735 7.151.196.14.309.37.294.613l-.08 1.956c-.02.484.453.864.912.7l2.2-.79a.747.747 0 0 1 .494.024A10.15 10.15 0 0 0 12 20.516c5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.096 12.188-2.28-2.433-4.45 2.433 4.897-5.202 2.338 2.433 4.393-2.433-4.898 5.202z"/>
            </svg>
            <span className="absolute right-14 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
              Messenger
            </span>
          </a>
        )}

        {/* WhatsApp Button */}
        {formattedWaUrl && (
          <a
            href={formattedWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-[#25D366] shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white">
              <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.502 1.14 6.746 3.072 9.378L1.06 31.116l5.964-1.966A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.302 22.602c-.39 1.1-1.932 2.014-3.168 2.282-.846.178-1.95.322-5.668-1.218-4.758-1.97-7.818-6.794-8.054-7.11-.228-.316-1.918-2.554-1.918-4.87s1.214-3.456 1.646-3.928c.39-.432.912-.582 1.198-.582.148 0 .278.008.398.014.432.02.648.044.934.724.356.846 1.224 2.986 1.332 3.204.108.218.218.516.068.812-.14.306-.264.442-.482.694-.218.252-.426.446-.644.718-.198.236-.422.49-.176.922.246.432 1.096 1.802 2.35 2.918 1.618 1.44 2.98 1.888 3.402 2.098.322.16.706.128.962-.146.322-.352.72-.934 1.124-1.508.288-.408.652-.46 1.008-.306.36.148 2.27 1.07 2.66 1.266.39.198.648.294.744.46.096.166.096.96-.294 2.06z" />
            </svg>
            <span className="absolute right-14 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
              WhatsApp
            </span>
          </a>
        )}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full btn-gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 z-10"
        aria-label="Toggle chat menu"
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        <div className="relative z-10 flex items-center justify-center">
          <MessageCircle 
            size={24} 
            className={`absolute transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`} 
            strokeWidth={2.5} 
          />
          <X 
            size={24} 
            className={`absolute transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`} 
            strokeWidth={2.5} 
          />
        </div>
      </button>
    </div>
  );
};

export default WhatsAppButton;
