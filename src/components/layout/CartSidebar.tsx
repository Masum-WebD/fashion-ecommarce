'use client';

import { ShoppingCart, ArrowRight, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, SHIPPING_COST } from "@/providers/CartProvider";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

// Animated rolling number hook — counts from previous value to new value
const useAnimatedNumber = (target: number, duration = 600) => {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    if (from === target) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out for a natural deceleration feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = target;
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
};

interface CartSidebarProps {
  externalOpen?: boolean;
  onExternalClose?: () => void;
}

const CartSidebar = ({ externalOpen, onExternalClose }: CartSidebarProps = {}) => {
  const { items: cartItems, removeItem, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart();

  const isOpen = isCartOpen;

  const totalWeight = cartItems.reduce((acc, item) => acc + ((item.weight || 0) * item.quantity), 0);
  const total = cartItems.length === 0 ? 0 : subtotal;

  // Animated total for the cart button
  const animatedTotal = useAnimatedNumber(total);

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-dashed border-gray-200">
        <ShoppingCart className="text-gray-400" size={28} />
      </div>
      <p className="text-gray-700 font-semibold mb-1 text-sm lg:text-base">Your Cart is Empty</p>
      <p className="text-gray-400 text-xs mb-6 max-w-[240px]">আপনার কার্টে কোনো পণ্য নেই। আমাদের আকর্ষণীয় পণ্যগুলো দেখতে শপিং শুরু করুন।</p>
      <Link
        href="/shop"
        onClick={() => setIsCartOpen(false)}
        className="btn-gradient-primary text-white text-xs lg:text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        Start Shopping / শপিং শুরু করুন
      </Link>
    </div>
  );

  return (
    <>
      {/* Fixed Cart Button - All Devices */}
      {!isOpen && cartItems.length > 0 && (
        <div
          className="fixed right-0 top-1/2 z-40 block will-change-transform"
          style={{
            transform: 'translate3d(0, -50%, 0)',
            WebkitTransform: 'translate3d(0, -50%, 0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
        >
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="overflow-hidden rounded-l-lg shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-x-1 hover:scale-105 relative group flex flex-col items-center min-w-max text-white border border-r-0 border-primary-700/50"
          >
            {/* Top zone — lighter background: icon + item count */}
            <div className="bg-gradient-to-br from-primary to-primary-700 w-full flex flex-col items-center gap-1.5 px-2 lg:px-3 pt-3 pb-1.5">
              <ShoppingCart size={22} className="animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="text-[11px] font-bold tracking-wide uppercase">{cartItems.length} items</div>
            </div>

            {/* Bottom zone — deeper background: animated total */}
            <div className="bg-green-900 w-full text-center px-3 py-1 border-t border-green-800">
              <div className="text-xs font-extrabold tracking-wide text-white">৳{cartItems.length === 0 ? "0.00" : animatedTotal.toLocaleString()}</div>
            </div>

            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Open Cart
            </span>
          </button>
        </div>
      )}

      {/* Overlay */}
      {(isOpen) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] transition-opacity"
          onClick={() => {
            setIsCartOpen(false);
          }}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed right-0 top-16 lg:top-[120px] h-[calc(100dvh-64px)] lg:h-[calc(100dvh-120px)] w-full lg:w-[400px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-800 text-white p-3 lg:p-6 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart size={20} />
            Shopping Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-border last:border-0 relative group"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                  />

                  {/* Remove Button - Always visible */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1 opacity-100 transition-colors z-10"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2 pr-8">{item.name}</h4>
                    {item.size && (
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    )}

                    {/* Quantity Controls and Total Price */}
                    <div className="flex items-center gap-3">
                      {/* Quantity Input */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => {
                            const minQ = item.minQuantity || 1;
                            if (item.quantity <= minQ) {
                              toast.error(`আপনাকে কমপক্ষে ${minQ} টি অর্ডার করতে হবে`);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="px-2.5 py-2 hover:bg-red-100 transition-colors flex items-center justify-center disabled:opacity-50"
                          disabled={item.quantity <= (item.minQuantity || 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            let val = parseInt(e.target.value);
                            if (isNaN(val)) val = item.minQuantity || 1;

                            const maxQ = item.maxQuantity;
                            if (maxQ !== undefined && maxQ !== null && val > maxQ) {
                              toast.error(`আপনি সর্বোচ্চ ${maxQ} টি অর্ডার করতে পারবেন`);
                              val = maxQ;
                            }
                            updateQuantity(item.id, val);
                          }}
                          onBlur={() => {
                            const minQ = item.minQuantity || 1;
                            if (item.quantity < minQ) {
                              updateQuantity(item.id, minQ);
                              toast.error(`আপনাকে কমপক্ষে ${minQ} টি অর্ডার করতে হবে`);
                            }
                          }}
                          className="px-4 py-2 font-semibold text-sm w-20 text-center border-l border-r border-gray-300 bg-white outline-none"
                          min={item.minQuantity || 1}
                          max={item.maxQuantity || undefined}
                        />
                        <button
                          onClick={() => {
                            const maxQ = item.maxQuantity;
                            if (maxQ !== undefined && maxQ !== null && item.quantity >= maxQ) {
                              toast.error(`আপনি সর্বোচ্চ ${maxQ} টি অর্ডার করতে পারবেন`);
                            } else {
                              updateQuantity(item.id, item.quantity + 1);
                            }
                          }}
                          className="px-2.5 py-2 hover:bg-green-100 transition-colors flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Total Price */}
                      <p className="font-bold text-sm text-primary whitespace-nowrap">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-border p-3 lg:p-4 pb-3 lg:pb-4 space-y-1.5 lg:space-y-3 bg-gray-50 shrink-0">
              <div className="flex justify-between text-xs lg:text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs lg:text-sm text-muted-foreground">
                <span>Total Weight</span>
                <span className="font-semibold">{totalWeight.toFixed(2)} kg</span>
              </div>
              <div className="border-t border-border pt-2 lg:pt-3 flex justify-between font-bold text-sm lg:text-base items-center">
                <span>Total</span>
                <div className="text-right">
                  <span className="text-base lg:text-lg text-primary">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="relative overflow-hidden w-full bg-gradient-to-r from-primary to-primary-700 text-white py-3 lg:py-3.5 rounded-xl font-extrabold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 group mt-4 text-base lg:text-lg hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Proceed to Checkout
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </>
        )}
      </div>


    </>
  );
};

export default CartSidebar;
