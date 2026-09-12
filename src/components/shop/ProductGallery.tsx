'use client';

import { useState, useEffect, useMemo } from "react";
import { PackageOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/api/images";
import { type Variant } from "@/lib/api/products";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  hasSalePrice: boolean;
}

const ProductGallery = ({ images: initialImages, productName, hasSalePrice }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [variantImage, setVariantImage] = useState<string | null>(null);

  useEffect(() => {
    const handleVariantSelected = (e: CustomEvent<Variant | null>) => {
      const variant = e.detail;
      // Use bracket notation to safely access the image property since it might not be in the type definition explicitly
      const vImage = variant ? (variant as any).image : null;
      if (vImage) {
        setVariantImage(getImageUrl(vImage));
        setSelectedImage(0); // Select the first image (which will be the variant image)
      } else {
        setVariantImage(null);
        setSelectedImage(0);
      }
    };
    window.addEventListener("variantSelected", handleVariantSelected as EventListener);
    return () => {
      window.removeEventListener("variantSelected", handleVariantSelected as EventListener);
    };
  }, []);

  const allImages = useMemo(() => {
    if (variantImage && !initialImages.includes(variantImage)) {
      return [variantImage, ...initialImages];
    }
    // If it's already in the initialImages, we can just return initialImages
    // But we might want it to be the first one. Let's just return it as first.
    if (variantImage && initialImages.includes(variantImage)) {
      const filtered = initialImages.filter((img) => img !== variantImage);
      return [variantImage, ...filtered];
    }
    return initialImages;
  }, [initialImages, variantImage]);

  const safeSelectedIndex = Math.min(selectedImage, Math.max(allImages.length - 1, 0));

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
        {hasSalePrice && (
          <Badge className="absolute top-3 left-3 z-10 btn-gradient-accent text-white px-3 py-1.5 text-xs font-bold shadow-lg">
            Sale
          </Badge>
        )}
        {allImages.length > 0 ? (
          <img
            src={allImages[safeSelectedIndex]}
            alt={productName}
            className="w-full h-full object-contain p-4 transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <PackageOpen size={64} strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Thumbnail Strip — horizontal scroll */}
      {allImages.length > 1 && (
        <div className="relative">
          <div
            className="flex gap-2 md:gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.thumb-scroll::-webkit-scrollbar { display: none; }`}</style>
            {allImages.map((imgUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  setSelectedImage(index);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 border-2 transition-all snap-start ${
                  index === safeSelectedIndex
                    ? 'border-primary shadow-md ring-1 ring-primary/30 scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-contain p-1.5"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
