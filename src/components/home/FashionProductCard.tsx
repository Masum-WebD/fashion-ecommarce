'use client';

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FashionProduct } from "@/data/fashion/products";
import { useCart, CartItem } from "@/providers/CartProvider";
import { toast } from "sonner";

interface ProductCardProps {
  product: FashionProduct;
  className?: string;
}

function formatPrice(n: number) {
  return "৳" + n.toLocaleString("en-BD", { useGrouping: true });
}

export default function FashionProductCard({ product, className }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError,   setImgError]   = useState(false);
  const { addItem } = useCart();

  const hasDiscount  = product.sale_price !== null && product.sale_price !== undefined;
  const displayPrice = hasDiscount ? (product.sale_price as number) : product.price;
  const discountPct  = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cartItem: CartItem = {
      id: String(product.id),
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image: product.thumbnail_image,
      size: product.sizes?.[0],
    };
    addItem(cartItem);
    toast.success(`"${product.name}" added to bag!`);
  };

  return (
    <article className={cn("card-product group flex flex-col", className)} aria-label={product.name}>
      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-stone-100 flex-shrink-0" style={{ aspectRatio: "3/4" }}>
        <Link href={`/product/${product.slug}`} tabIndex={-1} aria-hidden className="absolute inset-0">
          <Image
            src={imgError ? "/assets/placeholder.png" : product.thumbnail_image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is_new_arrival && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
          className={cn(
            "absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
            wishlisted
              ? "bg-primary text-white"
              : "bg-white/90 text-foreground/70 hover:bg-primary hover:text-white opacity-0 group-hover:opacity-100"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={15} className={cn("transition-all", wishlisted && "fill-current")} />
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 py-3 bg-foreground/95 text-white text-xs font-semibold uppercase tracking-wide hover:bg-primary transition-colors duration-200"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag size={14} /> Add to Bag
          </button>
        </div>
      </div>

      {/* ── Info ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1.5">
        <Link href={`/shop/${product.category.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          {product.category.name}
        </Link>

        <Link href={`/product/${product.slug}`} className="group/name">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover/name:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} className={i < Math.round(product.rating!) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({product.reviews_count})</span>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 5).map((c) => (
              <span key={c.name} title={c.name} style={{ backgroundColor: c.hex }} className="w-3.5 h-3.5 rounded-full border border-border/60 cursor-pointer hover:scale-125 transition-transform" />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className={cn("text-sm font-bold", hasDiscount ? "text-primary" : "text-foreground")}>
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}