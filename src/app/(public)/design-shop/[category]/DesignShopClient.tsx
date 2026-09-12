'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCardEnhanced from "@/components/ProductCardEnhanced";
import { Filter, ChevronRight } from "lucide-react";

// Images
const tinShedImg = "/assets/tin-shed-designs.png";
const oneStoreyImg = "/assets/one-storey-designs.png";
const twoStoreyImg = "/assets/two-storey-designs.png";
const industrialImg = "/assets/industrial-designs.png";
const homeDesignImg = "/assets/home-design.jpg";
const architecturalModelImg = "/architectural-model.png";

type CategoryKey = "tin-shed" | "one-storey" | "duplex" | "industrial";

const categoryMap: Record<CategoryKey, string> = {
    "tin-shed": "TIN SHED HOUSE DESIGN",
    "one-storey": "ONE STOREY HOUSE DESIGN",
    "duplex": "TWO STOREY HOUSE DESIGN",
    "industrial": "MULTI STOREY & INDUSTRIAL SHED"
};

const categoryNames: Record<CategoryKey, string> = {
    "tin-shed": "টিন শেড বাড়ির ডিজাইন",
    "one-storey": "একতলা বাড়ির ডিজাইন",
    "duplex": "দোতলা বাড়ির ডিজাইন",
    "industrial": "তিনতলা, স্টিল শেড ও গরুর শেড"
};

// Mock products specific to House Design
const allProducts = [
    // Tin Shed
    { image: tinShedImg, title: "Tin shed house design in bangladesh | এসি সেড টিনের বাড়ির ডিজাইন", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 5, reviews: 12, productId: "tin-shed-1", category: "tin-shed" },
    { image: architecturalModelImg, title: "New modern L size house design in village", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 4, reviews: 8, productId: "tin-shed-2", category: "tin-shed" },
    { image: homeDesignImg, title: "4 bedroom simple house plans - টিন শেডের বাড়ির ডিজাইন", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 5, reviews: 24, productId: "tin-shed-3", category: "tin-shed" },
    { image: tinShedImg, title: "3 bedroom house plans | গ্রামের টিন শেড ডিজাইন", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 4, reviews: 15, productId: "tin-shed-4", category: "tin-shed" },
    { image: homeDesignImg, title: "3 room house design in village", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 5, reviews: 10, productId: "tin-shed-5", category: "tin-shed" },
    { image: architecturalModelImg, title: "Simple house design with tin roof", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 4, reviews: 20, productId: "tin-shed-6", category: "tin-shed" },
    { image: tinShedImg, title: "U shaped house design - টিন শেড বাড়ির নকশা", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 5, reviews: 30, productId: "tin-shed-7", category: "tin-shed" },
    { image: homeDesignImg, title: "Low price house design - ছোট বাড়ির ডিজাইন", price: "5,000.00৳", originalPrice: "10,000.00৳", badge: "Sale!", rating: 4, reviews: 5, productId: "tin-shed-8", category: "tin-shed" },

    // One Storey
    { image: oneStoreyImg, title: "Modern 4 Bedroom One Storey House Plan", price: "7,500.00৳", originalPrice: "15,000.00৳", badge: "Sale!", rating: 5, reviews: 18, productId: "one-storey-1", category: "one-storey" },
    { image: homeDesignImg, title: "3 Bedroom Village House Map", price: "7,500.00৳", originalPrice: "15,000.00৳", badge: "Sale!", rating: 4, reviews: 12, productId: "one-storey-2", category: "one-storey" },
    { image: architecturalModelImg, title: "Luxury Single Storey Home Design", price: "8,000.00৳", originalPrice: "16,000.00৳", rating: 5, reviews: 26, productId: "one-storey-3", category: "one-storey" },
    { image: oneStoreyImg, title: "2 BHK Flat Design Layout", price: "6,000.00৳", originalPrice: "12,000.00৳", badge: "Popular", rating: 4, reviews: 33, productId: "one-storey-4", category: "one-storey" },

    // Duplex
    { image: twoStoreyImg, title: "Modern Duplex House Plan", price: "12,000.00৳", originalPrice: "24,000.00৳", badge: "Premium", rating: 5, reviews: 45, productId: "duplex-1", category: "duplex" },
    { image: architecturalModelImg, title: "5 Bedroom Luxury Duplex Design", price: "15,000.00৳", originalPrice: "30,000.00৳", badge: "Sale!", rating: 5, reviews: 22, productId: "duplex-2", category: "duplex" },
    { image: homeDesignImg, title: "Simple Two Storey Home Map", price: "10,000.00৳", originalPrice: "20,000.00৳", rating: 4, reviews: 17, productId: "duplex-3", category: "duplex" },
    { image: twoStoreyImg, title: "Small Duplex House Plan in Bangladesh", price: "11,000.00৳", originalPrice: "22,000.00৳", badge: "Sale!", rating: 4, reviews: 29, productId: "duplex-4", category: "duplex" },

    // Industrial
    { image: industrialImg, title: "Standard Cow Shed Design", price: "8,000.00৳", originalPrice: "16,000.00৳", badge: "Sale!", rating: 5, reviews: 34, productId: "industrial-1", category: "industrial" },
    { image: industrialImg, title: "Commercial Steel Shed Blueprint", price: "15,000.00৳", originalPrice: "30,000.00৳", rating: 4, reviews: 21, productId: "industrial-2", category: "industrial" },
    { image: industrialImg, title: "Multi-Storey Factory Building Plan", price: "25,000.00৳", badge: "Premium", rating: 5, reviews: 40, productId: "industrial-3", category: "industrial" },
    { image: industrialImg, title: "Warehouse Storage Shed Design", price: "10,000.00৳", originalPrice: "20,000.00৳", badge: "Sale!", rating: 4, reviews: 14, productId: "industrial-4", category: "industrial" }
];

const DesignShopClient = () => {
    const params = useParams();
    const category = params?.category as string;
    const [activeCategory, setActiveCategory] = useState<CategoryKey>("tin-shed");

    useEffect(() => {
        if (category && Object.keys(categoryMap).includes(category)) {
            setActiveCategory(category as CategoryKey);
        }
    }, [category]);

    const filteredProducts = allProducts.filter(p => p.category === activeCategory);

    // Default Sorting Options
    const [sortBy, setSortBy] = useState("Default sorting");

    const getSortedProducts = () => {
        let sorted = [...filteredProducts];
        if (sortBy === "Price: Low to High") {
            sorted.sort((a, b) => parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, '')));
        } else if (sortBy === "Price: High to Low") {
            sorted.sort((a, b) => parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, '')));
        } else if (sortBy === "Top Rated") {
            sorted.sort((a, b) => b.rating - a.rating);
        }
        return sorted;
    };

    const sortedProducts = getSortedProducts();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <main id="main-content" role="main" className="flex-grow">
                {/* Shop Header Breadcrumbs */}
                <div className="bg-white border-b border-gray-200 py-6">
                    <div className="container-main flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest">
                            <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
                            <ChevronRight size={14} className="text-gray-400" />
                            <Link href="/services" className="hover:text-primary transition-colors">FACTORY AND HOUSE DESIGN</Link>
                            <ChevronRight size={14} className="text-gray-400" />
                            <span className="text-gray-900">{categoryMap[activeCategory]}</span>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <span className="text-sm font-bold text-gray-500">Showing 1-{sortedProducts.length} of {sortedProducts.length} results</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-sm font-bold text-gray-700 outline-none border-l border-gray-200 pl-4 py-1 cursor-pointer"
                            >
                                <option>Default sorting</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Top Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content Info */}
                <div className="container-main py-6">
                    <p className="text-sm md:text-base font-bold text-gray-700 bg-blue-50/50 p-4 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
                        <span className="text-blue-600">{categoryMap[activeCategory]} - </span> আমাদের এখানে স্বল্প খরচে {categoryNames[activeCategory]} নকশা পাবেন।
                        অর্ডার করার ২ থেকে ৭ দিনের মধ্যে ডিজাইন বই আপনার হাতে পৌঁছে দেওয়া হবে। এছাড়াও আপনার
                        চাহিদা অনুযায়ী ডিজাইন করে দেওয়া যাবে। বাংলাদেশের সকল জায়গায় {categoryNames[activeCategory]} নিয়ে কাজ করে থাকি।
                    </p>
                </div>

                {/* Shop Layout */}
                <div className="container-main px-3 sm:px-4 md:px-6 pb-16">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar / Filters */}
                        <aside className="w-full lg:w-1/4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-border sticky top-[100px]">
                                <div className="flex items-center gap-2 mb-6">
                                    <Filter size={20} className="text-primary" />
                                    <h3 className="font-bold text-lg">Categories</h3>
                                </div>
                                <div className="space-y-2">
                                    {(Object.keys(categoryNames) as CategoryKey[]).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${activeCategory === cat
                                                ? "bg-primary text-white font-bold shadow-md"
                                                : "text-foreground font-medium hover:bg-primary/5 hover:text-primary"
                                                }`}
                                        >
                                            {categoryNames[cat]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="w-full lg:w-3/4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                                {sortedProducts.map((p, idx) => (
                                    <ProductCardEnhanced
                                        key={idx}
                                        image={p.image}
                                        title={p.title}
                                        price={p.price}
                                        originalPrice={p.originalPrice}
                                        badge={p.badge}
                                        rating={p.rating}
                                        reviews={p.reviews}
                                        productId={p.productId}
                                    />
                                ))}
                            </div>

                            {/* Pagination Placeholder */}
                            <div className="mt-12 flex justify-center pb-8">
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-primary text-white font-bold shadow-md flex items-center justify-center">1</button>
                                    <button className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">2</button>
                                    <button className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">3</button>
                                    <button className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">4</button>
                                    <button className="w-10 h-10 rounded-full bg-white text-gray-600 font-bold border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default DesignShopClient;
