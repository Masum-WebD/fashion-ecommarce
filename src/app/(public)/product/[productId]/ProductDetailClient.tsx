'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Star, Share2, Check, Truck, RotateCcw, Shield } from "lucide-react";
import { FashionProduct } from "@/data/fashion/products";
import { staticProducts } from "@/data/fashion/products";
import { useCart, CartItem } from "@/providers/CartProvider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import FashionProductCard from "@/components/home/FashionProductCard";

interface Props { product: FashionProduct }

function formatPrice(n: number) {
  return "৳" + n.toLocaleString("en-BD", { useGrouping: true });
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedSize,  setSelectedSize]  = useState(product.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name ?? "");
  const [qty,           setQty]           = useState(1);
  const [wishlisted,    setWishlisted]    = useState(false);
  const [imgIdx,        setImgIdx]        = useState(0);
  const [added,         setAdded]         = useState(false);

  const { addItem } = useCart();

  const hasDiscount  = product.sale_price !== null && product.sale_price !== undefined;
  const displayPrice = hasDiscount ? (product.sale_price as number) : product.price;
  const discountPct  = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0;

  const images = [product.thumbnail_image];

  // Related products: same category, exclude current
  const related = staticProducts
    .filter((p) => p.category.slug === product.category.slug && p.id !== product.id)
    .slice(0, 5);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: product.name,
      price: displayPrice,
      quantity: qty,
      image: product.thumbnail_image,
      size: selectedSize || undefined,
    };
    addItem(cartItem);
    setAdded(true);
    toast.success(`"${product.name}" added to bag!`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-main py-8 md:py-12">
      {/* ── Main product grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-16">

        {/* LEFT: Image */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
            <Image
              src={images[imgIdx]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{discountPct}% OFF
              </span>
            )}
            {product.is_new_arrival && !hasDiscount && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                NEW
              </span>
            )}
            <button
              onClick={() => setWishlisted((w) => !w)}
              className={cn(
                "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200",
                wishlisted ? "bg-primary text-white" : "bg-white text-stone-600 hover:bg-primary hover:text-white"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} className={wishlisted ? "fill-current" : ""} />
            </button>
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="space-y-5">
          <Link
            href={`/shop/${product.category.slug}`}
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-600 transition-colors"
          >
            {product.category.name}
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>

          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(product.rating!) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  Save {formatPrice(product.price - displayPrice)}
                </span>
              </>
            )}
          </div>

          <hr className="border-border" />

          {/* Color */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2.5">
                Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all duration-200",
                      selectedColor === c.name
                        ? "border-primary scale-110 shadow-md ring-2 ring-primary/30"
                        : "border-stone-300 hover:scale-110"
                    )}
                    aria-label={`Color: ${c.name}`}
                    aria-pressed={selectedColor === c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-sm font-semibold text-foreground">
                  Size: <span className="font-normal text-muted-foreground">{selectedSize}</span>
                </p>
                <button className="text-xs text-primary hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[42px] h-10 px-3 rounded-lg border text-sm font-semibold transition-all duration-200",
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-foreground hover:border-primary"
                    )}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2.5">Quantity</p>
            <div className="flex items-center border border-border rounded-lg w-fit overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-xl font-light"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-12 h-10 flex items-center justify-center font-semibold border-x border-border text-sm">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors text-xl font-light"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleAddToCart}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg",
                added ? "bg-green-600 text-white" : "bg-primary text-white hover:bg-primary-600"
              )}
            >
              {added ? <><Check size={18} /> Added!</> : <><ShoppingBag size={18} /> Add to Bag</>}
            </button>
            <button
              onClick={() => setWishlisted((w) => !w)}
              className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                wishlisted ? "bg-primary border-primary text-white" : "border-border text-foreground hover:border-primary hover:text-primary"
              )}
              aria-label="Wishlist"
            >
              <Heart size={18} className={wishlisted ? "fill-current" : ""} />
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied!"); }}
              className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-all duration-200"
              aria-label="Share"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck,     label: "Free Shipping", sub: "Over ৳2,500" },
              { icon: RotateCcw, label: "Easy Returns",  sub: "30-Day Policy" },
              { icon: Shield,    label: "Authentic",     sub: "100% Genuine"  },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-stone-50 rounded-xl text-center">
                <Icon size={18} className="text-primary" />
                <p className="text-[11px] font-semibold text-foreground leading-tight">{label}</p>
                <p className="text-[10px] text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related products ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-border pt-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="section-label mb-1">You May Also Like</p>
              <h2 className="text-heading-2 text-foreground">Related Products</h2>
            </div>
            <Link href={`/shop/${product.category.slug}`} className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {related.map((p) => (
              <FashionProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}