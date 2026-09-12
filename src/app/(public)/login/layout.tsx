import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Login & Register | Siraj Tech",
  description: "Log in or create your Siraj Tech account to manage orders, track deliveries, update your profile and shop Geotextiles, Concrete Block, Geo Bags & Garden Products.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
