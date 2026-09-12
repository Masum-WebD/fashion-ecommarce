'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Share2, MessageSquare, Phone } from "lucide-react";
import { tips, civilTips, decorTips } from "@/data/tips";

const TipDetailClient = () => {
    const params = useParams();
    const tipId = params?.tipId as string;
    const router = useRouter();

    // Combine all tips to find the one matching tipId
    const allTipsContent = [...tips, ...civilTips, ...decorTips];
    const tip = allTipsContent.find(t => t.id === tipId);

    if (!tip) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Tip not found</h1>
                        <button
                            onClick={() => router.push("/tips")}
                            className="text-primary hover:underline flex items-center gap-2 justify-center"
                        >
                            <ArrowLeft size={16} /> Back to all tips
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <main className="flex-grow pt-10 pb-20">
                <div className="container-main">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white border border-gray-200 text-gray-700 hover:text-primary hover:border-primary/50 hover:shadow-md transition-all rounded-full font-medium text-sm"
                    >
                        <ArrowLeft size={16} /> ফিরে যান
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border">
                                {tip.image && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={tip.image}
                                            alt={tip.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-6 md:p-10 lg:p-12">
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                                            <Tag size={14} /> {tip.category}
                                        </span>
                                        <span className="text-muted-foreground text-sm flex items-center gap-1.5 font-medium">
                                            <Calendar size={14} /> {tip.date}
                                        </span>
                                        <span className="text-muted-foreground text-sm flex items-center gap-1.5 font-medium">
                                            <User size={14} /> {tip.author}
                                        </span>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                        {tip.title}
                                    </h1>

                                    <div
                                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 prose-headings:text-gray-900 prose-headings:font-black prose-ul:list-disc prose-ol:list-decimal"
                                        dangerouslySetInnerHTML={{ __html: tip.content }}
                                    />

                                    <div className="mt-12 pt-8 border-t border-gray-100">
                                        <div className="flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex flex-wrap gap-2">
                                                {tip.tags.map((tag, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-bold border border-gray-200">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className="p-2.5 rounded-full bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all border border-gray-100">
                                                    <Share2 size={20} />
                                                </button>
                                                <button className="p-2.5 rounded-full bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all border border-gray-100">
                                                    <MessageSquare size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* Author Box */}
                            <div className="mt-8 bg-gradient-to-tr from-gray-900 to-gray-800 text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
                                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                    <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
                                        <User size={48} className="text-primary" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-black mb-2">{tip.author}</h3>
                                        <p className="text-gray-400 font-medium mb-4">আপনার কৃষি ও নকশা সংক্রান্ত যেকোনো জটিল সমস্যায় আমরা আছি আপনার পাশে। বছরের পর বছর অভিজ্ঞতা আর আধুনিক প্রযুক্তির সমন্বয়ে আমরা দিচ্ছি সেরা সমাধান।</p>
                                        <a href="tel:01706176403" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                                            <Phone size={18} /> কথা বলুন আমাদের বিশেষজ্ঞের সাথে
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border">
                                <h4 className="font-black text-xl mb-6 pb-4 border-b border-gray-100">সম্পর্কিত টিপস</h4>
                                <div className="space-y-6">
                                    {allTipsContent
                                        .filter(t => t.id !== tipId && (t.category === tip.category))
                                        .slice(0, 3)
                                        .map((relatedTip, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/tips/${relatedTip.id}`}
                                                className="group flex flex-col gap-3"
                                            >
                                                <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 border border-border">
                                                    {relatedTip.image && (
                                                        <img
                                                            src={relatedTip.image}
                                                            alt={relatedTip.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                                        {relatedTip.title}
                                                    </h5>
                                                    <p className="text-xs text-muted-foreground mt-1">{relatedTip.date}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    {allTipsContent.filter(t => t.id !== tipId && (t.category === tip.category)).length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">কোনো সম্পর্কিত টিপস পাওয়া যায়নি।</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 text-center space-y-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md text-primary mb-2">
                                    <Phone size={28} />
                                </div>
                                <h4 className="font-black text-xl text-gray-900">ফ্রি পরামর্শ নিন</h4>
                                <p className="text-sm font-medium text-gray-600 leading-relaxed">আপনার স্বপ্ন পূরণে আমরা আছি আপনার পাশে। আজই কল করুন আমাদের এক্সপার্টকে।</p>
                                <div className="pt-2">
                                    <a href="tel:01706176403" className="block w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                        01706176403
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TipDetailClient;
