import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { getShopCategoryImageUrl, ShopCategoryItem } from "@/lib/api/categories";

interface ShopCategoryCardProps {
  category: ShopCategoryItem;
  href: string;
  subcategoryCount?: number;
  index?: number;
}

const ShopCategoryCard = ({
  category,
  href,
  subcategoryCount = 0,
  index = 0,
}: ShopCategoryCardProps) => {
  const imageUrl = getShopCategoryImageUrl(category.image);

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/30">
            <Layers size={48} strokeWidth={1.25} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {subcategoryCount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-primary shadow-sm backdrop-blur-sm sm:text-xs">
            {subcategoryCount} sub-categories
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
          {category.name}
        </h3>
        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary sm:text-sm">
          View {subcategoryCount > 0 ? "sub-categories" : "products"}
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
};

export default ShopCategoryCard;
