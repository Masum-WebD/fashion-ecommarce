import { Metadata } from "next";
import { fetchBrands } from "@/lib/api/brands";
import Link from "next/link";
import { fetchMarketingConfig } from "@/lib/api/marketing";

export async function generateMetadata(): Promise<Metadata> {
  const configs = await fetchMarketingConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sirajtech.org";

  return {
    title: "All Brands - Siraj Tech",
    description: "Explore all top-quality garden materials, geo bags, and geotextiles brands available at Siraj Tech.",
    openGraph: {
      title: "All Brands - Siraj Tech",
      description: "Explore all top-quality garden materials, geo bags, and geotextiles brands available at Siraj Tech.",
      url: `${siteUrl}/brand`,
      type: "website",
    },
    alternates: {
      canonical: "/brand",
    }
  };
}

export default async function BrandsPage() {
  const brands = await fetchBrands();

  return (
    <main className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header Section */}
      <section className="relative pt-8 pb-6 md:pt-14 md:pb-10 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-emerald-50/30 to-teal-50/50 pointer-events-none" />
        <div className="absolute -top-16 -right-16 md:-top-24 md:-right-24 w-40 h-40 md:w-64 md:h-64 bg-green-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 md:-bottom-24 md:-left-24 w-40 h-40 md:w-64 md:h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3 md:mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Brands</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            Discover premium quality products from top trusted brands for all your gardening and landscaping needs.
          </p>
        </div>
      </section>

      {/* Brands Grid Section */}
      <section className="container mx-auto px-4 py-12">
        {brands.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700">No brands found</h3>
            <p className="text-gray-500 mt-2">Check back later for exciting new brands!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {brands.map((brand) => (
              <Link 
                href={`/brand/${brand.slug}`} 
                key={brand.id}
                className="group relative flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-gray-100 hover:border-primary/20 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative w-full aspect-square mb-4 bg-gray-50/80 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-gray-100/50 group-hover:bg-white transition-colors duration-300">
                  {brand.image_url ? (
                    <img 
                      src={brand.image_url} 
                      alt={brand.name} 
                      className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-gray-300">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <h3 className="text-base md:text-lg font-bold text-gray-800 text-center group-hover:text-primary transition-colors duration-200">
                  {brand.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
