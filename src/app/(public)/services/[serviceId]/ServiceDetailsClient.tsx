'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    Phone,
    Building2,
    Layers,
    Zap,
    Droplets,
    Image as ImageIcon,
    Calculator,
    ArrowRight
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const homeDesignImg = "/assets/home-design.jpg";
const architecturalModelImg = "/architectural-model.png";
const tinShedCollage = "/assets/tin-shed-designs.png";
const industrialCollage = "/assets/industrial-designs.png";
const oneStoreyCollage = "/assets/one-storey-designs.png";
const twoStoreyCollage = "/assets/two-storey-designs.png";

type ServiceData = {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    colorClass: string;
    themeColor: string;
    features: string[];
    image: string;
};

const servicesData: Record<string, ServiceData> = {
    "architectural-design": {
        title: "আর্কিটেকচার ডিজাইন",
        subtitle: "আপনার স্বপ্নের বাড়ির আধুনিক ও দৃষ্টিনন্দন নকশা",
        description: "একটি সঠিক আর্কিটেকচারাল ডিজাইন শুধু একটি বাড়ির সৌন্দর্যই বৃদ্ধি করে না, বরং স্থানের সঠিক ব্যবহার ও আরামদায়ক পরিবেশ নিশ্চিত করে। আমাদের দক্ষ আর্কিটেক্ট টিম আপনার চাহিদা অনুযায়ী আধুনিক ও যুগোপযোগী ডিজাইন তৈরি করে থাকে।",
        icon: Building2,
        colorClass: "bg-primary/10 text-primary",
        themeColor: "from-primary/20 to-transparent",
        features: [
            "ফ্লোর প্ল্যান ও ফার্নিচার লেআউট (Floor Plan)",
            "ফ্রন্ট এবং সাইড এলিভেশন (Elevation)",
            "ডিটেইল সেকশন ড্রয়িং (Section Drawing)",
            "ওয়ার্কিং ডিজাইন (Working Design)",
            "স্লাব আউটলাইন ও ছাদের মাপ",
            "দরজা এবং জানালার ডিটেইলস"
        ],
        image: homeDesignImg
    },
    "structural-design": {
        title: "স্ট্রাকচার ডিজাইন",
        subtitle: "মজবুত ও দীর্ঘস্থায়ী ভবনের নিশ্চয়তা",
        description: "একটি ভবনের স্থায়ীত্ব নির্ভর করে তার স্ট্রাকচারাল ডিজাইনের ওপর। আমরা আধুনিক সফটওয়্যার ব্যবহার করে ফাউন্ডেশন, কলাম, বিম এবং স্লাবের নিখুঁত ডিজাইন প্রদান করি, যা ভবনকে ভূমিকম্প সহনীয় ও নিরাপদ করে।",
        icon: Layers,
        colorClass: "bg-accent/10 text-accent",
        themeColor: "from-accent/20 to-transparent",
        features: [
            "ফাউন্ডেশন/পাইলিং ডিজাইন (Foundation)",
            "কলাম ও গ্রেড বিম লেআউট (Column Layout)",
            "বিম সেকশন ও রড বাইন্ডিং ডিটেইলিং",
            "ছাদের রড প্লেসমেন্ট (Slab Design)",
            "সেপটিক ও রিজার্ভ ট্যাংকের পুর্ণাঙ্গ ডিজাইন",
            "সিঁড়ির রড ডিটেইলিং"
        ],
        image: architecturalModelImg
    },
    "electric-layout": {
        title: "ইলেকট্রিক লেআউট",
        subtitle: "নিরাপদ ও আধুনিক বিদ্যুৎ ব্যবস্থা",
        description: "একটি বাড়ির আধুনিক সুযোগ-সুবিধা নিশ্চিত করতে ইলেকট্রিক্যাল ড্রয়িং অত্যন্ত গুরুত্বপূর্ণ। সঠিক তারের মাপ ও সার্কিট ব্রেকারের হিসাব না থাকলে বৈদ্যুতিক দুর্ঘটনার ঝুঁকি থাকে। আমরা বাংলাদেশ ন্যাশনাল বিল্ডিং কোড (BNBC) মেনে ডিজাইন করি।",
        icon: Zap,
        colorClass: "bg-blue-100 text-blue-600",
        themeColor: "from-blue-200 to-transparent",
        features: [
            "সুইচ বোর্ড ও লাইট-ফ্যান পয়েন্ট লেআউট",
            "এয়ার কন্ডিশন (AC) ও গিজার পয়েন্ট",
            "সার্কিট ব্রেককার ও মেইন ডিস্ট্রিবিউশন বোর্ড",
            "টেলিভিশন ও ইন্টারনেট ক্যাবল লাইন",
            "জেনারেটর ও সোলার প্যানেল সংযোগ"
        ],
        image: industrialCollage
    },
    "plumbing-layout": {
        title: "প্লাম্বিং লেআউট",
        subtitle: "সুষ্ঠু ও টেকসই পানি নিষ্কাশন ব্যবস্থা",
        description: "পানি সরবরাহ এবং পয়ঃনিষ্কাশন ব্যবস্থা সঠিক না হলে ভবিষ্যতে দেওয়াল ড্যাম্প হওয়াসহ বড় ধরনের ক্ষতির সম্মুখীন হতে হয়। আমাদের ডিজাইন আপনার বাড়ির প্রতিটি বাথরুম এবং রান্নাঘরের জন্য সঠিক ও দীর্ঘস্থায়ী প্লাম্বিং সমাধান নিশ্চিত করে।",
        icon: Droplets,
        colorClass: "bg-cyan-100 text-cyan-600",
        themeColor: "from-cyan-200 to-transparent",
        features: [
            "ঠান্ডা ও গরম পানির পাইপ লাইন",
            "পয়ঃনিষ্কাশন ও রেইন ওয়াটার ড্রেনেজ",
            "বাথরুম ও কিচেন ফিটিংস লেআউট",
            "গভীর নলকূপ ও পাম্প ডিটেইলস",
            "সেপটিক ট্যাংকের সংযোগ ড্রয়িং"
        ],
        image: tinShedCollage
    },
    "3d-design": {
        title: "৩ডি ডিজাইন",
        subtitle: "নির্মাণের আগেই দেখুন আপনার স্বপ্নের বাড়ি",
        description: "একটি বাড়ির বাহিরের এবং ভেতরের সৌন্দর্য কেমন হবে তা নির্মাণের আগেই দেখে নেওয়া যায় ৩ডি ডিজাইনের মাধ্যমে। এটি বাড়ি তৈরির ব্যাপারে সঠিক সিদ্ধান্ত নিতে এবং রঙের কম্বিনেশন বুঝতে সাহায্য করে।",
        icon: ImageIcon,
        colorClass: "bg-rose-100 text-rose-600",
        themeColor: "from-rose-200 to-transparent",
        features: [
            "এক্সটেরিয়র বা বাহিরের ভিউ (3D Exterior)",
            "ইন্টেরিয়র ডিজাইন (3D Interior)",
            "ল্যান্ডস্কেপিং এবং বাগান ডিজাইন",
            "লাইটিং এবং কালার কনসেপ্ট",
            "অ্যানিমেশন বা ভিডিও ওয়াকথ্রু"
        ],
        image: homeDesignImg
    },
    "estimation": {
        title: "মালামালের হিসাব (BOQ)",
        subtitle: "বাজেট অনুযায়ী নির্মাণের সঠিক পরিকল্পনা",
        description: "বাড়ি নির্মাণে কত ইট, বালি, সিমেন্ট ও রড লাগবে এবং মোট খরচ কত হবে, তার একটি সঠিক পূর্বানুমান থাকা খুবই জরুরি। আমাদের মেটেরিয়াল এস্টিমেশন আপনাকে সঠিক বাজেট নির্ধারণ করতে সহায়তা করবে।",
        icon: Calculator,
        colorClass: "bg-emerald-100 text-emerald-600",
        themeColor: "from-emerald-200 to-transparent",
        features: [
            "ইট, বালু, সিমেন্ট ও রডের নিখুঁত হিসাব",
            "বর্তমান বাজার দর অনুযায়ী মেটেরিয়াল খরচ",
            "লেবার বা মিস্ত্রি খরচের সঠিক ধারণা",
            "প্রতিটি কাজের ধাপে ধাপে খরচের তালিকা",
            "অপচয় রোধে প্রয়োজনীয় পরামর্শ"
        ],
        image: architecturalModelImg
    },
    "floor-plan": {
        title: "ফ্লোর প্ল্যান",
        subtitle: "শুধুমাত্র ফ্লোরের নকশা",
        description: "যে কোনো বাড়ির নির্মাণের জন্য প্রথমেই প্রয়োজন হয় একটি নিখুঁত ফ্লোর প্ল্যান। আমাদের দক্ষ আর্কিটেক্টরা আপনার জমির মাপ অনুযায়ী সর্বোচ্চ স্পেস ইউটিলাইজ করে ফ্লোর প্ল্যান তৈরি করে থাকেন।",
        icon: Building2,
        colorClass: "bg-primary/10 text-primary",
        themeColor: "from-primary/20 to-transparent",
        features: [
            "কাস্টমাইজড ফ্লোর প্ল্যান (Floor Plan)",
            "ফার্নিচার লেআউট (Furniture Layout)",
            "সর্বোচ্চ ১০ বার ড্রয়িং সংশোধনের সুবিধা",
            "নির্ভুল মাপ ও ডায়মেনশন"
        ],
        image: homeDesignImg
    },
    "combo-design": {
        title: "Floor Plan + 3D Visualizer",
        subtitle: "ফ্লোর প্ল্যান এবং ৩ডি এক্সটেরিয়র ডিজাইন একসাথে",
        description: "এই প্যাকেজে আপনি ফ্লোর প্ল্যানের পাশাপাশি আপনার স্বপ্নের বাড়ির একটি বাস্তবসম্মত ৩ডি এক্সটেরিয়র ভিউ পাবেন। এতে বাড়ি তৈরির আগেই আপনি এর বাইরের সৌন্দর্য কেমন হবে তা দেখতে পারবেন।",
        icon: Layers,
        colorClass: "bg-accent/10 text-accent",
        themeColor: "from-accent/20 to-transparent",
        features: [
            "ফ্লোর প্ল্যান (Floor Plan)",
            "ফার্নিচার লেআউট",
            "৩ডি এক্সটেরিয়র ডিজাইন (3D Exterior)",
            "ফ্লোর প্ল্যানে ১০ বার সংশোধনের সুযোগ",
            "৩ডিতে ৫ বার সংশোধনের সুযোগ"
        ],
        image: architecturalModelImg
    },
    "tin-shed": {
        title: "টিন শেড বাড়ির ডিজাইন",
        subtitle: "আধুনিক ও দৃষ্টিনন্দন টিন শেড বাড়ি",
        description: "কম খরচে আধুনিক ও দৃষ্টিনন্দন টিন শেড বাড়ি নির্মাণের জন্য আমাদের এই প্যাকেজটি বেস্ট। আমরা জায়গা অনুযায়ী সঠিক ফ্লোর প্ল্যান এবং রুফ ডিজাইনের জন্য বিস্তারিত ড্রয়িং দিয়ে থাকি।",
        icon: Building2,
        colorClass: "bg-rose-100 text-rose-600",
        themeColor: "from-rose-200 to-transparent",
        features: [
            "ফ্লোর প্ল্যান (Floor Plan)",
            "৩ডি এক্সটেরিয়র ডিজাইন (3D Exterior)",
            "বিস্তারিত ওয়ার্কিং ড্রয়িং",
            "সর্বোচ্চ ১০ বার ফ্লোর প্ল্যান সংশোধন",
            "সর্বোচ্চ ৫ বার ৩ডি ডিজাইন সংশোধন"
        ],
        image: tinShedCollage
    },
    "one-storey": {
        title: "একতলা বাড়ির ডিজাইন",
        subtitle: "আধুনিক একতলা বাড়ির সম্পূর্ণ ড্রয়িং",
        description: "আপনার একতলা বাড়িটি যেন হয় নিরাপদ, সুন্দর ও টেকসই, আমরা সেই নিশ্চয়তা দিই। আধুনিক ডিজাইন এবং সঠিক স্ট্রাকচারাল সলিউশনের মাধ্যমে আমরা আপনার স্বপ্নের একতলা বাড়ির পূর্ণাঙ্গ ডিজাইন প্রদান করি।",
        icon: Building2,
        colorClass: "bg-emerald-100 text-emerald-600",
        themeColor: "from-emerald-200 to-transparent",
        features: [
            "আর্কিটেকচারাল ফ্লোর প্ল্যান",
            "৩ডি এক্সটেরিয়র ডিজাইন",
            "স্ট্রাকচারাল ওয়ার্কিং ড্রয়িং",
            "ফ্লোর প্ল্যানে ১০ বার সংশোধনের সুযোগ",
            "৩ডিতে ৫ বার সংশোধনের সুযোগ"
        ],
        image: oneStoreyCollage
    },
    "duplex": {
        title: "দোতলা বাড়ির ডিজাইন",
        subtitle: "আধুনিক ও দৃষ্টিনন্দন দোতলা বাড়ি (Duplex/Two-Storey)",
        description: "যারা পরিবার নিয়ে শান্তিতে থাকতে চান ও বড় একটি বাড়ির স্বপ্ন দেখেন তাদের জন্য দোতলা বাড়ির ডিজাইন। আমরা দৃষ্টিনন্দন এবং স্পেস-সেভিং ডিজাইন নিশ্চিত করি।",
        icon: Building2,
        colorClass: "bg-blue-100 text-blue-600",
        themeColor: "from-blue-200 to-transparent",
        features: [
            "আর্কিটেকচারাল ফ্লোর প্ল্যান",
            "৩ডি এক্সটেরিয়র ডিজাইন",
            "স্ট্রাকচারাল ওয়ার্কিং ড্রয়িং",
            "প্লাম্বিং ও ইলেকট্রিক্যাল লেআউট",
            "সিঁড়ির বিস্তারিত ড্রয়িং"
        ],
        image: twoStoreyCollage
    },
    "industrial": {
        title: "তিনতলা, স্টিল শেড ও গরুর শেড",
        subtitle: "বাণিজ্যিক ও আবাসিক মাল্টি-স্টোরি ভবন",
        description: "বড় প্রজেক্টের জন্য প্রয়োজন একটি দক্ষ এবং নির্ভরযোগ্য ইঞ্জিনিয়ারিং টিম। তিনতলা ভবন,কমার্শিয়াল স্টিল শেড কিংবা গরুর শেড নির্মাণের জন্য আমরা দিচ্ছি পরিপূর্ণ ইঞ্জিনিয়ারিং সেবা।",
        icon: Building2,
        colorClass: "bg-cyan-100 text-cyan-600",
        themeColor: "from-cyan-200 to-transparent",
        features: [
            "আর্কিটেকচারাল ও স্ট্রাকচারাল ডিজাইন",
            "৩ডি এক্সটেরিয়র ডিজাইন",
            "ইলেকট্রিক ও প্লাম্বিং লেআউট",
            "সঠিক মেটেরিয়াল এস্টিমেশন",
            "সেফটি চেকিং ও মাটি পরীক্ষার পরামর্শ"
        ],
        image: industrialCollage
    },
    "cow-shed-design": {
        title: "Cow Shed Design",
        subtitle: "Standard Cattle Shed",
        description: "আধুনিক ফিড ব্যবস্থা, আলো-বাতাস চলাচলের সুবিধা এবং গরুর স্বাস্থ্যের কথা বিবেচনা করে তৈরি করা একটি আদর্শ গরুর শেডের ডিজাইন। আমাদের ডিজাইনের মাধ্যমে খামারের উৎপাদনশীলতা বৃদ্ধি পায়।",
        icon: Layers,
        colorClass: "bg-primary/10 text-primary",
        themeColor: "from-primary/20 to-transparent",
        features: [
            "সর্বোচ্চ স্পেস ইউটিলাইজেশন (Space Utilization)",
            "বর্জ্য নিষ্কাশন ব্যবস্থা (Waste Management)",
            "সঠিক ভেন্টিলেশন ডিজাইন",
            "খরচ কমানোর ডিজাইন অপটিমাইজেশন"
        ],
        image: industrialCollage
    },
    "steel-shed-design": {
        title: "Steel shed 3D Design",
        subtitle: "Steel shed 3D Design and Plans",
        description: "শিল্প কারখানা, গোডাউন কিংবা আধুনিক বাণিজ্যিক ভবনের জন্য মজবুত এবং টেকসই স্টিল শেড ডিজাইন। আমাদের স্ট্রাকচারাল ইঞ্জিনিয়াররা শতভাগ সেফটি নিশ্চিত করে স্টিল শেডের নিখুঁত ডিজাইন প্রদান করে থাকেন।",
        icon: Building2,
        colorClass: "bg-accent/10 text-accent",
        themeColor: "from-accent/20 to-transparent",
        features: [
            "স্ট্রাকচারাল এবং আর্কিটেকচারাল ডিজাইন",
            "৩ডি ভিউ ও ওয়ার্কিং ড্রয়িং",
            "উইন্ড লোড ও আর্থকোয়েক লোড ক্যালকুলেশন",
            "মেটেরিয়াল এস্টিমেশন (BOQ)"
        ],
        image: industrialCollage
    },
    "warehouse-design": {
        title: "Warehouse Design",
        subtitle: "Steel Shed building for warehouse",
        description: "মালামাল নিরাপদে সংরক্ষণের জন্য উন্নতমানের ওয়্যারহাউস ডিজাইন। বড় স্প্যান, ট্রাক লোড-আনলোড স্পেস এবং পর্যাপ্ত ভেন্টিলেশনের ব্যবস্থা রেখে আধুনিক ডিজাইনের নিশ্চয়তা।",
        icon: Building2,
        colorClass: "bg-blue-100 text-blue-600",
        themeColor: "from-blue-200 to-transparent",
        features: [
            "ম্যাক্সিমাম স্টোরেজ স্পেস ডিজাইন",
            "হেভি ডিউটি ফ্লোরিং লেআউট",
            "নিরাপত্তা এবং ফায়ার সেফটি প্ল্যান",
            "ট্রাক যাতায়াতের সুব্যবস্থা"
        ],
        image: industrialCollage
    },
    "modern-house-design": {
        title: "Modern House Design",
        subtitle: "3 storey modern house designs and floor plans",
        description: "শহরের সীমিত জায়গায় আধুনিক সুযোগ-সুবিধা সম্বলিত তিন তলা বাড়ির চমৎকার ডিজাইন। নান্দনিক এক্সটেরিয়র, ন্যাচারাল লাইটিং এবং বিলাসবহুল ইন্টেরিয়র স্পেস প্ল্যানিং।",
        icon: Building2,
        colorClass: "bg-rose-100 text-rose-600",
        themeColor: "from-rose-200 to-transparent",
        features: [
            "মডার্ন আর্কিটেকচারাল ফ্লোর প্ল্যান",
            "বিলাসবহুল ৩ডি এক্সটেরিয়র ডিজাইন",
            "কমপ্লিট স্ট্রাকচারাল ডিজাইন",
            "ডিপ টেইল প্লাম্বিং ও ইলেকট্রিক্যাল লেআউট"
        ],
        image: twoStoreyCollage
    }
};

const ServiceDetailsClient = () => {
    const params = useParams();
    const serviceId = params?.serviceId as string;
    const router = useRouter();

    // Default fallback if ID not found, to avoid crass 404
    const data = (serviceId && servicesData[serviceId]) || servicesData["architectural-design"];
    const Icon = data.icon;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow pt-10 pb-20">
                <AnimatedSection>
                    <div className="container-main">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white border border-gray-200 text-gray-700 hover:text-primary hover:border-primary/50 hover:shadow-md transition-all rounded-full font-medium text-sm"
                        >
                            <ArrowLeft size={16} /> ফিরে যান
                        </button>
                    </div>

                    {/* Hero Area */}
                    <div className="container-main mb-16">
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row">
                            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 relative flex flex-col justify-center">
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${data.themeColor} rounded-bl-full opacity-50 -z-10`} />

                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -rotate-3 ${data.colorClass}`}>
                                    <Icon size={36} className="md:w-10 md:h-10" />
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                                    {data.title}
                                </h1>
                                <p className="text-xl md:text-2xl font-bold text-gray-600 mb-6 border-l-4 border-primary pl-4">
                                    {data.subtitle}
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {data.description}
                                </p>
                                <div className="flex flex-wrap gap-4 mt-auto">
                                    <a href="tel:01706176403" className="btn-gradient-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-base">
                                        <Phone size={18} /> যোগাযোগ করুন
                                    </a>
                                    <Link href="/shop" className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 text-base">
                                        আমাদের প্যাকেজ সমূহ <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 relative bg-gray-100 min-h-[300px] lg:min-h-0">
                                <img
                                    src={data.image}
                                    alt={data.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:hidden" />
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection>
                    <div className="container-main">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Left Content - Details */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-200">
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        এই সেবায় যা যা থাকছে
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {data.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                                <span className="font-bold text-gray-700 text-base">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-900 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
                                    <h3 className="text-2xl font-black mb-6 relative z-10">কেন Siraj Tech কে বেছে নিবেন?</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary text-xl">১০০০+ প্রজেক্ট</h4>
                                            <p className="text-gray-400 text-sm font-medium">সারা বাংলাদেশে ১০০০ এর বেশি সফল প্রজেক্ট সম্পন্ন করার অভিজ্ঞতা।</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary text-xl">দক্ষ টিম</h4>
                                            <p className="text-gray-400 text-sm font-medium">অভিজ্ঞ বিএসসি ইঞ্জিনিয়ার এবং সৃজনশীল আর্কিটেক্টদের সমন্বয়ে গঠিত টিম।</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary text-xl">সংশোধনের সুবিধা</h4>
                                            <p className="text-gray-400 text-sm font-medium">আপনার পছন্দ না হওয়া পর্যন্ত একাধিকবার সংশোধনের সুযোগ।</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-primary text-xl">সাশ্রয়ী মূল্য</h4>
                                            <p className="text-gray-400 text-sm font-medium">আপনার বাজেটের মধ্যে সেরা কোয়ালিটির ডিজাইন নিশ্চিত করা।</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                                    <h4 className="font-black text-xl mb-6 pb-4 border-b border-gray-100">অন্যান্য সেবাসমূহ</h4>
                                    <div className="space-y-3">
                                        {Object.entries(servicesData).map(([key, service], idx) => {
                                            if (key === serviceId) return null; // Skip current service
                                            const NavIcon = service.icon;
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={`/services/${key}`}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${service.colorClass} group-hover:scale-110 transition-transform`}>
                                                        <NavIcon size={18} />
                                                    </div>
                                                    <div className="font-bold text-sm text-gray-700 group-hover:text-primary transition-colors">
                                                        {service.title}
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md text-primary mb-2">
                                        <Phone size={28} />
                                    </div>
                                    <h4 className="font-black text-xl text-gray-900">ফ্রি পরামর্শ নিন</h4>
                                    <p className="text-sm font-medium text-gray-600">আপনার স্বপ্ন পূরণে আমরা আছি আপনার পাশে। আজই কল করুন।</p>
                                    <div className="pt-2">
                                        <a href="tel:01706176403" className="block w-full bg-primary text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                            01706176403
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
};

export default ServiceDetailsClient;
