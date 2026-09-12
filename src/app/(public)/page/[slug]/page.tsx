import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchCustomPageBySlug, getImageUrl } from '@/lib/api';
import { ShoppingCart, MessageCircle, ChevronRight, Package } from 'lucide-react';
import Image from 'next/image';
import "@/text-editor.css";
import ProductsSectionEnhanced from "@/components/home/ProductsSectionEnhanced";
import DataTable from "@/components/custom-page/DataTable";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const page = await fetchCustomPageBySlug(resolvedParams.slug);
    console.log(page)
    return {
      title: page.meta_title || page.title,
      description: page.meta_description,
      keywords: page.meta_keywords,
      openGraph: {
        title: page.meta_title || page.title,
        description: page.meta_description,
        images: page.og_image_url ? [page.og_image_url] : [],
      },
      alternates: {
        canonical: `/page/${page.slug}`,
      }
    };
  } catch (error) {
    return {
      title: "Page | Siraj Tech"
    };
  }
}

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  let page;
  try {
    page = await fetchCustomPageBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  if (!page) {
    notFound();
  }

  const activeProducts = page.products || [];

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Breadcrumb */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="w-full px-2 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              HOME
            </Link>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-semibold truncate">
              {page.title}
            </span>
          </div>
        </div>
      </div>

      {/* Hero / Title Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-6 md:py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {page.title}
          </h1>
        </div>
      </section>

      {/* Products Slider Section */}
      {activeProducts.length > 0 && (
        <div className="bg-white">
          <ProductsSectionEnhanced
            products={activeProducts as any}
            title="আমাদের পণ্যসমূহ"
            subtitle="আপনার পছন্দের পণ্যটি বেছে নিন"
            id="custom-page-products"
          />
        </div>
      )}

      {/* Description Section */}
      <section className="w-full bg-white py-8 md:py-12 mb-8">
        <div className="w-full px-2 sm:px-6 lg:px-8">
          <div className="max-w-5xl bg-white px-2 md:px-6 py-6 rounded-xl mx-auto text-center space-y-6 ">
            {/* Description */}
            {page.description && (
              <div
                className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed text-editor-content text-left sm:text-center mx-auto"
                dangerouslySetInnerHTML={{ __html: page.description }}
              />
            )}

            {/* Data Table */}
            {page.table_data && (Array.isArray(page.table_data) || (page.table_data.headers && page.table_data.headers.length > 0)) && (
              <DataTable tableData={page.table_data} />
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 pt-6">
              {page.whatsapp_btn_text && (
                <a
                  href="https://wa.me/8801706176403"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  <span>{page.whatsapp_btn_text}</span>
                </a>
              )}
              {page.messenger_btn_text && (
                <a
                  href="https://m.me/sirajtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  <span>{page.messenger_btn_text}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
