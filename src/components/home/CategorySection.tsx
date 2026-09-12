import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryItem {
  image: string;
  title: string;
  description: string;
  href?: string;
}

interface CategorySectionProps {
  title: string;
  items: CategoryItem[];
  bgAlt?: boolean;
  href?: string;
  subtitle?: string;
  columns?: number;
  maxItems?: number;
}

const CategorySection = ({
  title,
  items,
  bgAlt = false,
  href = "/contact",
  subtitle,
  columns = 4,
  maxItems = 4,
}: CategorySectionProps) => {
  // Show exactly at most maxItems items on large devices
  const displayItems = items.slice(0, maxItems);

  return (
    <section className={`section-padding ${bgAlt ? "bg-gradient-to-br from-[#f0fdf4] via-[#f8fafc] to-white border-y border-emerald-100/30" : "bg-white"}`}>
      <style>{`
        .cat-card-img-wrap {
          width: 100%;
          aspect-ratio: 6 / 5;
          overflow: hidden;
          border-radius: 8px 8px 0 0;
          position: relative;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .cat-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 4px;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .cat-card:hover .cat-card-img-wrap img {
          transform: scale(1.08);
        }
        .cat-card {
          background: #fff;
          border-radius: 8px 8px 0 0;
          overflow: hidden;
          box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-bottom: 3px solid hsl(var(--primary));
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .cat-card:hover {
          box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.12);
          border-color: rgba(var(--primary-rgb, 34,197,94), 0.25);
        }
        .cat-card-body {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #fff;
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 768px) {
          .cat-grid {
            grid-template-columns: repeat(${columns}, 1fr);
            gap: 24px;
          }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-primary-600 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none mb-1">
                {subtitle ?? "Services & Information"}
              </p>
              <h2 className="text-xl md:text-2xl font-extrabold text-foreground leading-tight">
                {title}
              </h2>
            </div>
          </div>

          {/* Desktop/Tablet/Mobile Header "See All" Link */}
          {href.startsWith("/") ? (
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white border border-primary/45 hover:bg-primary bg-white px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              See All <ArrowRight size={13} />
            </Link>
          ) : (
            <a
              href={href}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white border border-primary/45 hover:bg-primary bg-white px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              See All <ArrowRight size={13} />
            </a>
          )}
        </div>

        {/* Cards Grid */}
        <div className="cat-grid">
          {displayItems.map((item) => {
            const cardInner = (
              <div className="cat-card">
                {/* Image */}
                <div className="cat-card-img-wrap">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={500}
                  />
                </div>

                {/* Body */}
                <div className="cat-card-body">
                  <h3 className="text-sm md:text-base font-bold text-foreground mb-2 line-clamp-1 leading-snug group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-[13px] leading-relaxed line-clamp-3 flex-grow">
                    {item.description}
                  </p>
                  
                  {/* View Details link */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-600 transition-colors mt-4 pt-1">
                    View Details 
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <Link key={item.title} href={item.href} className="group block h-full">
                  {cardInner}
                </Link>
              );
            }

            return (
              <div key={item.title} className="group block h-full">
                {cardInner}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
