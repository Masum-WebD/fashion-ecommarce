'use client';

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Lightbulb, Sprout, Hammer, Home, Calendar } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { tips, civilTips, decorTips } from "@/data/tips";

const TipsClient = () => {
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    const headerHeight = 120;
                    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: elementPosition - headerHeight,
                        behavior: "smooth"
                    });
                }
            }
        };

        const timeoutId = setTimeout(handleHashChange, 100);
        window.addEventListener("hashchange", handleHashChange);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/30">
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative bg-gray-900 py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000"
                            alt="Background"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/60 to-gray-900" />
                    </div>

                    <div className="container-main relative z-10 text-center">
                        <AnimatedSection>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-400 border border-primary/30 text-sm font-bold mb-6">
                                Knowledge Hub
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                                Tips and <span className="text-primary italic">Tricks</span>
                            </h1>
                            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                আধুনিক কৃষি পদ্ধতি, টেকসই নির্মাণ কৌশল এবং গৃহসজ্জার সেরা টিপসগুলো বিশেষজ্ঞরা শেয়ার করছেন আপনার সাথে।
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mt-10">
                                <a href="#agro" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary/30">
                                    Agro Tips
                                </a>
                                <a href="#civil" className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all">
                                    Civil Hacks
                                </a>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Floating icons for visual flair */}
                    <div className="absolute top-1/4 left-10 text-primary/20 animate-pulse hidden lg:block">
                        <Sprout size={120} />
                    </div>
                    <div className="absolute bottom-1/4 right-10 text-primary/20 animate-pulse hidden lg:block" style={{ animationDelay: '1s' }}>
                        <Hammer size={120} />
                    </div>
                </div>

                {/* Main Content Sections */}
                <section className="py-20">
                    <div className="container-main space-y-32">

                        {/* 1. Agro Tips Section */}
                        <div id="agro" className="scroll-mt-32">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                    <Sprout size={28} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900">Agro Tips & Tricks</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {tips.map((tip, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/tips/${tip.id}`}
                                        className="group bg-white rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img
                                                src={tip.image}
                                                alt={tip.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary/90 text-white px-3 py-1 rounded-lg text-xs font-black backdrop-blur-md">
                                                    {tip.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-bold">
                                                <Calendar size={14} /> {tip.date}
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                                {tip.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 font-medium">
                                                {tip.excerpt}
                                            </p>
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-primary text-sm font-black flex items-center gap-2">
                                                    বিস্তারিত পড়ুন <ArrowRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* 2. Civil Engineering Section Card */}
                        <div id="civil" className="scroll-mt-32">
                            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] overflow-hidden shadow-2xl p-8 md:p-16 border border-white/10">
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
                                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />

                                <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                                    <div className="w-full lg:w-2/5 text-left">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-primary mb-8 backdrop-blur-md">
                                            <Hammer size={32} />
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Civil Engineering <br /><span className="text-primary">& Geotextile</span></h2>
                                        <p className="text-gray-400 text-lg mb-8 font-medium">
                                            আধুনিক নির্মাণ শিল্পে জিওটেক্সটাইল এবং জিও-পণ্য ব্যবহারের সঠিক কৌশল ও বিশেষজ্ঞ মতামত জানুন।
                                        </p>
                                        <div className="flex items-center gap-4 text-white font-bold text-sm">
                                            <div className="flex -space-x-3">
                                                <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center overflow-hidden">
                                                    <img src="https://i.pravatar.cc/100?u=1" alt="Expert" />
                                                </div>
                                                <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center overflow-hidden">
                                                    <img src="https://i.pravatar.cc/100?u=2" alt="Expert" />
                                                </div>
                                            </div>
                                            <span>প্রকৌশলীদের পরামর্শ</span>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {civilTips.map((tip, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/tips/${tip.id}`}
                                                className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                                                    <Lightbulb size={24} />
                                                </div>
                                                <h4 className="text-xl font-black text-white mb-3 group-hover:text-primary transition-colors">{tip.title}</h4>
                                                <p className="text-gray-400 text-sm mb-6 line-clamp-2">{tip.excerpt}</p>
                                                <span className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                    আরও জানুন <ArrowRight size={14} />
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Home Decor Ideas Section */}
                        <div id="decor" className="scroll-mt-32">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-accent-100 flex items-center justify-center text-accent shadow-sm border border-accent/10">
                                        <Home size={28} />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-gray-900">Home Decor Ideas</h2>
                                </div>
                                <div className="hidden md:block">
                                    <button className="text-sm font-black text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                                        See All Decor Tips <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {decorTips.map((tip, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/tips/${tip.id}`}
                                        className="group relative h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl"
                                    >
                                        <img
                                            src={tip.image}
                                            alt={tip.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="bg-accent text-white px-3 py-1 rounded-lg text-xs font-black">
                                                    {tip.category}
                                                </span>
                                                <span className="text-white/60 text-xs font-bold flex items-center gap-1.5">
                                                    <Calendar size={14} /> {tip.date}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-accent transition-colors">
                                                {tip.title}
                                            </h3>
                                            <p className="text-white/70 text-sm md:text-base line-clamp-2 mb-6 font-medium max-w-lg">
                                                {tip.excerpt}
                                            </p>
                                            <div className="flex items-center gap-3 text-accent font-black text-sm">
                                                পরিপাটি করে জানুন <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Newsletter / CTA Section */}
                <section className="py-20 bg-primary/5 border-y border-primary/10">
                    <div className="container-main text-center max-w-3xl">
                        <AnimatedSection>
                            <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3">
                                <BookOpen size={40} />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">জানুন এবং বড় হোন</h2>
                            <p className="text-gray-600 text-lg mb-10 font-medium">
                                আমাদের নিয়মিত ইমেইল সাবস্ক্রাইব করুন এবং আপনার বাগান ও ঘরের জন্য নতুন সব আইডিয়া সরাসরি ইনবক্সে পান।
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="আপনার ইমেইল দিন"
                                    className="flex-grow px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                />
                                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary/30 shrink-0">
                                    সাবস্ক্রাইব
                                </button>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TipsClient;
