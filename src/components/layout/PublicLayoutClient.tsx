'use client';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CartSidebar from "@/components/layout/CartSidebar";
import { useCart } from "@/providers/CartProvider";

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setIsCartOpen } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer />
      <MobileBottomBar onCartClick={() => setIsCartOpen(true)} />
      <CartSidebar />
    </div>
  );
}
