'use client';

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface ProductCardEnhancedProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  priceRange?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  productId?: string;
}

const ProductCardEnhanced = ({
  image,
  title,
  price,
  originalPrice,
  priceRange,
  badge,
  productId = "product",
}: ProductCardEnhancedProps) => {
  const router = useRouter();

  // Use priceRange if available, otherwise fall back to price
  const displayPrice = priceRange || price;
  // True only when explicitly no price from API (empty string means null from server)
  const hasPrice = displayPrice && displayPrice !== "যোগাযোগ করুন" && displayPrice.trim() !== "";

  return (
    <div
      onClick={() => router.push(`/product/${productId}`)}
      className="group relative bg-white rounded-t-xl rounded-b-none overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.12)] border border-border/60 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-accent to-accent-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider">
          {badge}
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-[#f8fafc] overflow-hidden border-b border-border/30">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain p-2.5 rounded-[3px] transition-all duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-2 md:p-4 flex flex-col flex-grow bg-white">
        {/* Title */}
        <h3 className="text-[11px] md:text-sm font-bold text-foreground line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors duration-200 min-h-[2.7rem] md:min-h-[2rem]">
          {title}
        </h3>

        {/* Price & Order Button */}
        <div className="mt-auto pt-1 md:pt-2 flex flex-col gap-2.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {hasPrice ? (
              <>
                <span className="text-base md:text-lg font-extrabold text-primary leading-none">
                  {displayPrice}
                </span>
                {originalPrice && (
                  <span className="text-xs text-muted-foreground line-through decoration-destructive/80 leading-none">
                    {originalPrice}
                  </span>
                )}
              </>
            ) : (
              <span className="text-base md:text-lg font-extrabold text-primary leading-none">
                ৳০০
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${productId}`);
            }}
            className="w-full flex items-center justify-center gap-1.5 btn-gradient-primary text-white py-2.5 rounded-md text-[12px] md:text-sm font-bold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 btn-bling"
          >
            <ShoppingCart size={15} />
            অর্ডার করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardEnhanced;
