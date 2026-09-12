'use client';

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Home,
    Building2,
    Warehouse,
    ArrowRight,
    Phone,
    ShieldCheck,
    Zap,
    HardHat,
    CheckCircle2,
    ChevronRight
} from "lucide-react";

// Images
const tinShedCollage = "/assets/tin-shed-designs.png";
const oneStoreyCollage = "/assets/one-storey-designs.png";
const twoStoreyCollage = "/assets/two-storey-designs.png";
const industrialCollage = "/assets/industrial-designs.png";

const HouseDesignClient = () => {
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    const headerHeight = 120; // topbar + navbar
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
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-grow">
                {/* Premium Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900 text-white">
                    <div className="absolute inset-0 bg-primary/20 -skew-y-6 origin-right translate-y-1/2 -z-10" />
                    <div className="container-main relative z-10">
                        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-xs font-black uppercase tracking-widest text-primary-100">
                                <ShieldCheck size={14} /> Premium Architectural Solutions
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter">
                                House & Factory <span className="text-primary tracking-normal">Design Services</span>
                            </h1>
                            <p className="text-xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
                                আধুনিক স্থাপত্যশৈলী এবং নিখুঁত প্রকৌশলবিদ্যার সমন্বয়ে আপনার স্বপ্নের বাড়ি বা ফ্যাক্টরির ডিজাইন তৈরি করতে আমরা প্রতিশ্রুতিবদ্ধ।
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 pt-6">
                                <a href="#tin-shed" className="btn-gradient-primary px-8 py-4 rounded-xl font-bold text-lg shadow-2xl flex items-center gap-2 hover:-translate-y-1 transition-all">
                                    আমাদের ডিজাইন দেখুন <ArrowRight size={20} />
                                </a>
                                <a href="tel:01705175403" className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                                    <Phone size={20} /> ফ্রি কনসালটেন্সি
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Sections */}
                <section className="py-24 bg-white">
                    <div className="container-main space-y-32">

                        {/* Tin Shed Section */}
                        <div id="tin-shed" className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center scroll-mt-32">
                            <div className="w-full lg:w-1/2 group">
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-gray-100 relative aspect-[4/3]">
                                    <Image
                                        src={tinShedCollage}
                                        alt="Tin Shed Designs"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="p-3 bg-primary/5 rounded-2xl w-fit text-primary transform -rotate-3 mb-2">
                                    <Home size={32} />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                    Tin Shed House Design <br />
                                    <span className="text-primary text-2xl md:text-3xl font-bold">(টিন শেড বাড়ির ডিজাইন)</span>
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                    অল্প খরচে অভিজাত এবং মজবুত টিন শেড বাড়ির জন্য আমাদের আধুনিক ডিজাইনগুলো সেরা পছন্দ। আমরা এমনভাবে ডিজাইন করি যা গরম সহ্য করতে সক্ষম এবং দেখতেও চমৎকার।
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {["রিসোর্ট স্টাইল লুক", "মজবুত স্ট্রাকচার", "খরচ সাশ্রয়ী", "দ্রুত নির্মাণ উপযোগী"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 font-bold text-gray-700">
                                            <CheckCircle2 size={18} className="text-primary" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6">
                                    <Link href="/design-shop/tin-shed" className="inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all">
                                        অর্ডার দিতে এখানে ক্লিক করুন <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* One Storey Section */}
                        <div id="one-storey" className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center scroll-mt-32">
                            <div className="w-full lg:w-1/2 group">
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-gray-100 relative aspect-[4/3]">
                                    <Image
                                        src={oneStoreyCollage}
                                        alt="One Storey House Designs"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-6 text-left">
                                <div className="p-3 bg-accent/10 rounded-2xl w-fit text-accent transform rotate-3 mb-2">
                                    <Building2 size={32} />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                    One Storey House Design <br />
                                    <span className="text-accent text-2xl md:text-3xl font-bold">(একতলা বাড়ির নকশা)</span>
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                    একতলা বাড়ির ক্ষেত্রে আপনি যাতে প্রতি ইঞ্চি জায়গার সঠিক ব্যবহার করতে পারেন, আমরা সেভাবেই আমাদের প্ল্যানগুলো তৈরি করেছি। ছোট থেকে বড় সব ধরণের জমির জন্য আমাদের কাছে অপশন রয়েছে।
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {["স্পেসিয়াস লেআউট", "অসাধারণ ভেন্টিলেশন", "আধুনিক ফ্রন্ট লুক", "ফার্নিচার প্ল্যানিং"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 font-bold text-gray-700">
                                            <CheckCircle2 size={18} className="text-accent" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6">
                                    <Link href="/design-shop/one-storey" className="inline-flex items-center gap-2 text-accent font-black hover:gap-3 transition-all">
                                        ফ্রি কনসালটেন্সি নিন <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Duplex Section */}
                        <div id="duplex" className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center scroll-mt-32">
                            <div className="w-full lg:w-1/2 group">
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-gray-100 relative aspect-[4/3]">
                                    <Image
                                        src={twoStoreyCollage}
                                        alt="Duplex House Designs"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="p-3 bg-primary/5 rounded-2xl w-fit text-primary transform -rotate-3 mb-2">
                                    <Zap size={32} />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                    Duplex House Design <br />
                                    <span className="text-primary text-2xl md:text-3xl font-bold">(ডুপ্লেক্স বাড়ির ডিজাইন)</span>
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                    একটি অসাধারণ ডুপ্লেক্স বাড়ি আপনার সামাজিক মর্যাদাকে ফুটিয়ে তোলে। আমাদের ডিজাইন করা ডুপ্লেক্সগুলোতে আপনি পাবেন আভিজাত্য এবং আরামের অপূর্ব মিশেল।
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {["লাক্সারি ইন্টেরিয়র", "ডাবল হাইট সিলিং", "ড্রামাটিক সিড়ি", "গ্র্যান্ড এন্ট্রান্স"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 font-bold text-gray-700">
                                            <CheckCircle2 size={18} className="text-primary" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6">
                                    <Link href="/design-shop/duplex" className="inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all">
                                        অর্ডার শুরু করুন <ChevronRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Industrial Section */}
                        <div id="industrial" className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-20 items-center scroll-mt-32 pb-20">
                            <div className="w-full lg:w-1/2 group">
                                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-gray-100 relative aspect-[4/3]">
                                    <Image
                                        src={industrialCollage}
                                        alt="Industrial Designs"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 space-y-6">
                                <div className="p-3 bg-gray-900 rounded-2xl w-fit text-white transform rotate-3 mb-2">
                                    <Warehouse size={32} />
                                </div>
                                <div id="multi-storey" className="scroll-mt-32">
                                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                        Multi Storey & Factory <br />
                                        <span className="text-gray-600 text-2xl md:text-3xl font-bold">(৩তলা+ এবং ইন্ডাস্ট্রিয়াল শেড)</span>
                                    </h2>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                    আমরা তিন তলা বা তার বেশি উচ্চতার বহুতল ভবন এবং আধুনিক ফ্যাক্টরি বা গরুর শেডের জন্য পেশাদার ইঞ্জিনিয়ারিং সার্ভিস প্রদান করে থাকি। প্রতিটি ইঞ্চি নিখুঁতভাবে মাপা হয়।
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    <div className="flex items-center gap-3 font-bold text-gray-700">
                                        <HardHat size={18} className="text-primary" /> ইন্ডাস্ট্রিয়াল স্ট্যান্ডার্ড স্ট্রাকচারাল এনালাইসিস
                                    </div>
                                    <div className="flex items-center gap-3 font-bold text-gray-700">
                                        <CheckCircle2 size={18} className="text-primary" /> প্রোপার ভেন্টিলেশন ও মেশিনারি লেআউট
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <Link href="/design-shop/industrial" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-black hover:bg-gray-800 transition-all">
                                        বিস্তারিত আলোচনা করুন <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default HouseDesignClient;
