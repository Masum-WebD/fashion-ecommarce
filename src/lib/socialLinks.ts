import { Facebook, Twitter, Youtube, type LucideIcon } from "lucide-react";

export type SocialLink = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/sirajtech.org" },
  { icon: Twitter, label: "Twitter", href: "https://x.com/siraj_tech24" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/channel/UCcRK8rgelJx1uSys_Qxjkbg" },
];

