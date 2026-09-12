'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import {
  Building2,
  Ruler,
  Construction,
  Monitor,
  Calculator,
  HardHat,
  MapPinned,
  ArrowRight,
  AlertTriangle,
  Home,
  Lightbulb,
  Layers,
  Zap,
  Droplets,
  Image as ImageIcon,
  Landmark,
  Map as MapIcon,
  BarChart3,
  Compass,
  ChevronRight,
  Youtube,
  Phone,
  Facebook,
  MessageCircle,
  Users,
  Star,
  PenTool,
  LayoutDashboard,
} from "lucide-react";

// ─── TOC Items ───────────────────────────────────────────────────────

const serviceSections = [
  { id: "architectural-design", label: "আর্কিটেকচারাল ডিজাইন", icon: Building2 },
  { id: "why-proper-design", label: "সঠিক ডিজাইনের গুরুত্ব", icon: AlertTriangle },
  { id: "our-services", label: "আমাদের সেবাসমূহ", icon: Layers },
  { id: "design-portfolio", label: "আমাদের কাজের নমুনা", icon: ImageIcon },
  { id: "house-factory-design", label: "বাড়ি ও কারখানা ডিজাইন", icon: Home },
  { id: "tips-tricks", label: "সিভিল ইঞ্জিনিয়ারিং টিপস", icon: Lightbulb },
  { id: "contact", label: "যোগাযোগ", icon: Phone },
];

// ─── TOC Sidebar Component ───────────────────────────────────────────

interface TOCItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const TOCSidebar = ({
  sections,
  activeSection,
}: {
  sections: TOCItem[];
  activeSection: string;
}) => {
  const handleClick = (id: string) => {
    const el = document.getElementById(`service-${id}`);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full space-y-1" aria-label="On this page">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleClick(id)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200",
            activeSection === id
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <Icon size={14} className="shrink-0" />
          <span className="truncate">{label}</span>
          {activeSection === id && (
            <ChevronRight size={14} className="ml-auto shrink-0 text-primary" />
          )}
        </button>
      ))}
    </nav>
  );
};

// ─── Active Section Tracker Hook ─────────────────────────────────────

function useActiveSection(
  sectionIds: string[],
  prefix: string,
  offset = 160
): string {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace(`${prefix}-`, ""));
          }
        }
      },
      {
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold: 0,
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(`${prefix}-${id}`))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, prefix, offset]);

  return active;
}

// ─── Section Block Component ─────────────────────────────────────────

const SectionBlock = ({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={`service-${id}`} className="scroll-mt-28">
    <ScrollReveal direction="up">
      <div className={cn("mb-8 rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10", className)}>
        <h2 className="mb-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <div className="prose prose-sm max-w-none leading-relaxed text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline sm:prose-base">
          {children}
        </div>
      </div>
    </ScrollReveal>
  </section>
);

// ─── Page Component ──────────────────────────────────────────────────

const ServicesClient = () => {
  const sectionIds = serviceSections.map((s) => s.id);
  const activeSection = useActiveSection(sectionIds, "service");
  const tocScrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Auto-scroll the active pill into view on mobile
  useEffect(() => {
    if (!activeSection || !tocScrollRef.current) return;
    const activePill = tocScrollRef.current.querySelector(
      `[data-section-id="${activeSection}"]`
    ) as HTMLButtonElement | null;
    if (activePill) {
      activePill.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeSection]);

  // Hide sidebar until scrolled past hero, and hide near footer
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const scrollBottom = scrollY + window.innerHeight;
          const docHeight = document.body.offsetHeight;
          const heroEl = heroRef.current;
          const heroHeight = heroEl?.offsetHeight ?? 500;
          const pastHero = scrollY > heroHeight - 80;
          const notNearFooter = scrollBottom < docHeight - 400;
          setShowSidebar(pastHero && notNearFooter);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Delay initial check slightly to allow hero section to render
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Service items data
  const allServices = [
    { icon: Building2, label: "আর্কিটেকচারাল ডিজাইন", color: "text-blue-600 bg-blue-50" },
    { icon: Ruler, label: "স্ট্রাকচারাল ডিজাইন", color: "text-emerald-600 bg-emerald-50" },
    { icon: Zap, label: "ইলেক্ট্রিক্যাল ডিজাইন", color: "text-amber-600 bg-amber-50" },
    { icon: Droplets, label: "প্লাম্বিং ডিজাইন", color: "text-cyan-600 bg-cyan-50" },
    { icon: PenTool, label: "ওয়ার্কিং ড্রয়িং", color: "text-violet-600 bg-violet-50" },
    { icon: Monitor, label: "3D ডিজাইন ও অ্যানিমেশন", color: "text-rose-600 bg-rose-50" },
    { icon: Compass, label: "ল্যান্ডস্কেপ ডিজাইন", color: "text-green-600 bg-green-50" },
    { icon: LayoutDashboard, label: "মাস্টার প্ল্যান - 2D & 3D", color: "text-indigo-600 bg-indigo-50" },
    { icon: Landmark, label: "সিটি কর্পোরেশন/পৌরসভা অনুমোদন", color: "text-orange-600 bg-orange-50" },
    { icon: Calculator, label: "এস্টিমেট", color: "text-teal-600 bg-teal-50" },
    { icon: BarChart3, label: "প্রজেক্ট ম্যানেজমেন্ট", color: "text-sky-600 bg-sky-50" },
    { icon: Construction, label: "কন্সট্রাকশন ও সুপারভিশন", color: "text-stone-600 bg-stone-50" },
    { icon: HardHat, label: "সয়েল টেস্ট ও পাইল", color: "text-yellow-600 bg-yellow-50" },
    { icon: MapIcon, label: "ডিজিটাল সার্ভে", color: "text-lime-600 bg-lime-50" },
  ];

  // Design gallery images
  const galleryImages = [
    { src: "/assets/footer/arc01.jpg", alt: "Architecture Design Sample 1" },
    { src: "/assets/footer/arc02.jpg", alt: "Architecture Design Sample 2" },
    { src: "/assets/footer/arc03.jpg", alt: "Architecture Design Sample 3" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-section-alt/30 via-background to-background">
      <main className="flex-grow">
        {/* ── Hero Section ── */}
        <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-600 to-primary-800 pb-12 pt-8 sm:pb-16 sm:pt-12 md:pb-20 md:pt-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-1/4 left-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

          <div className="container-main relative z-10">
            <ScrollReveal direction="up">
              <div className="mx-auto max-w-3xl text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                  <Building2 size={12} />
                  Our Services
                </span>
                <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  Architectural &amp; Structural Design Services
                </h1>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                  সিরাজ টেক ডিজাইন এন্ড কনস্ট্রাকশন সলিউশন — আপনার স্বপ্নের বাড়ি ও স্থাপনার জন্য পূর্ণাঙ্গ ডিজাইন ও নির্মাণ সমাধান।
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Mobile Fixed TOC ── */}
        <div className="lg:hidden fixed top-11 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-border/60 shadow-sm py-2.5 px-4">
          <div className="max-w-[1200px] mx-auto">
            <div
              className="flex gap-2 overflow-x-auto pb-1 mobile-toc-scroll"
              ref={tocScrollRef}
            >
              {serviceSections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  data-section-id={id}
                  onClick={() => {
                    const el = document.getElementById(`service-${id}`);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                    activeSection === id
                      ? "bg-primary text-white shadow-md"
                      : "border border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="container-main py-10 sm:py-12 md:py-16 pt-14 sm:pt-14 md:pt-16">
          <div className="min-w-0 lg:pr-[280px]">
            {/* Section Intro */}
            <ScrollReveal direction="up">
              <div className="mb-10 text-center">
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  আর্কিটেকচারাল ডিজাইন ও নির্মাণ সেবা
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  সিরাজ টেক ডিজাইন এন্ড কনস্ট্রাকশন সলিউশনের টিম দিচ্ছে সম্পূর্ণ সমাধান — ডিজাইন থেকে শুরু করে নির্মাণ পর্যন্ত প্রতিটি ধাপে পেশাদার সেবা।
                </p>
              </div>
            </ScrollReveal>

            {/* ─── 1. Architectural Design Warning ─── */}
            <SectionBlock
              id="architectural-design"
              title="আর্কিটেকচারাল ডিজাইন"
            >
              <div className="space-y-6">
                {/* Warning Card */}
                <div className="rounded-xl border border-red-200/60 bg-red-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={24} className="shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <h3 className="mb-2 text-base font-bold text-red-800">ডিজাইন কি শুধু ইন্টারনেট থেকে নামালেই হবে?</h3>
                      <p className="text-sm leading-relaxed text-red-700">
                        একজন ইঞ্জিনিয়ারের কাছে ডিজাইন করতে গেলে অনেক খরচ। তাই মাথা খাটিয়ে ইন্টারনেট থেকে একটা ডিজাইন নামিয়ে নিলেই ইঞ্জিনিয়ারের খরচটা বেঁচে যাবে — এই চিন্তা অনেক ভয়ংকর, কারণ একটা ডিজাইন অনেকগুলো ভ্যারিয়েবল ফ্যাক্টরের উপর নির্ভরশীল।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Factors */}
                <div>
                  <h4 className="mb-3 text-base font-semibold text-foreground">যেমন:</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { icon: MapPinned, label: "মাটির ধরন", sub: "Soil Type Analysis" },
                      { icon: Compass, label: "ভূমিকম্প প্রবণতা", sub: "Seismic Zone" },
                      { icon: Compass, label: "বাতাসের ধরন", sub: "Wind Load Analysis" },
                      { icon: MapPinned, label: "প্লটের দিক", sub: "Plot Orientation" },
                      { icon: BarChart3, label: "মালামালের পর্যাপ্ততা", sub: "Material Availability" },
                    ].map(({ icon: Icon, label, sub }) => (
                      <div key={label} className="flex items-center gap-3 rounded-lg border border-border/40 bg-white p-3 shadow-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm leading-relaxed">
                  সেই সঙ্গে অত্যন্ত সংবেদনশীল এবং জটিল সব সূত্র এবং সফটওয়্যার ব্যবহার করে সেই ডিজাইনের যথার্থতা নির্ণয় করা হয়।
                </p>

                <div className="rounded-xl border border-red-200/60 bg-red-50/70 p-4 text-sm font-semibold text-red-800">
                  <p className="flex items-center gap-2">
                    <AlertTriangle size={18} />
                    <span><strong>সতর্কতা:</strong> খরচ বাঁচাতে জীবন ঝুঁকিতে ফেলবেন না। ভালো মানের ইট, রড, সিমেন্টের পাশাপাশি ভালো মানের একটি ডিজাইন নিশ্চিত করবে আপনার ও আপনার পরিবারের সুরক্ষা।</span>
                  </p>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">সারমর্ম:</strong> সঠিক প্ল্যানিং ও ডিজাইন ছাড়া বাড়ির কাজ শুরু করে কষ্টের টাকাগুলোর অপচয় করবেন ওয়েবসাইটে আসা অনেকজনকেই দেখেছি যে প্ল্যানিং ছাড়া বাড়ির কাজ শুরু করে অনেক টাকা নষ্ট করে ফেলেছেন কিন্তু বাড়ির ভিতরের প্ল্যান ভাল লাগছেনা, বাইরের আউটলুক ভাল লাগছেনা এবং আরও অনেক সমস্যার সম্মুখীন হতে হয়েছে।
                  </p>
                </div>
              </div>
            </SectionBlock>

            {/* ─── 2. Why Proper Design ─── */}
            <SectionBlock
              id="why-proper-design"
              title="আপনার স্বপ্নের বাড়ি নির্মাণের কথা ভাবছেন?"
            >
              <div className="space-y-5">
                <div className="flex items-start gap-4 rounded-xl border border-blue-200/60 bg-blue-50/50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Home size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-bold text-foreground">স্বপ্ন যখন একটি সুন্দর বাড়ির</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      তখন আপনার স্বপ্নের বাড়িটি ডিজাইনের জন্য, আমাদের সৃজনশীল ও দক্ষ ডিজাইন টিম সদা প্রস্তুত। জমির আকৃতি যেমনই হোক না কেন, আপনার স্বপ্নকে বাস্তবে রূপ দেওয়ার দায়িত্ব আমাদের ডিজাইন টিমের।
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed">
                  সারা জীবনের অর্জিত অর্থ দিয়ে বানানো বাড়িটি যেন ছুঁতে পারে আপনার স্বপ্নকে। শখ ও সাধ্যের মাঝে ফুটে উঠুক বসবাসের প্রত্যেকটি ইঞ্চি জায়গা। আপনার কষ্টে অর্জিত টাকায় নির্মিত বাড়িটি হোক সুন্দর, আকর্ষণীয় ও নিরাপদ আবাসস্থল।
                </p>

                <div className="rounded-xl border border-green-200/60 bg-green-50/70 p-4">
                  <p className="flex items-start gap-2 text-sm font-medium text-green-800">
                    <Star size={18} className="mt-0.5 shrink-0" />
                    <span>
                      <strong>"সিরাজ টেক ডিজাইন এন্ড কনস্ট্রাকশন সলিউশন"</strong> এর টিম দিচ্ছে সম্পূর্ণ সমাধান — সুন্দর করে বাড়ি করার জন্য ডিজাইন করা খুবই গুরুত্বপূর্ণ।
                    </span>
                  </p>
                </div>
              </div>
            </SectionBlock>

            {/* ─── 3. Our Services ─── */}
            <SectionBlock
              id="our-services"
              title="আমাদের সেবাসমূহ (স্টিল + আর.সি.সি)"
            >
              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground">
                  আমরা স্টিল ও আর.সি.সি (RCC) উভয় ধরনের নির্মাণের জন্য পূর্ণাঙ্গ সেবা প্রদান করি:
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {allServices.map(({ icon: Icon, label, color }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-border/40 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", color)}>
                        <Icon size={18} />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBlock>

            {/* ─── 4. Design Portfolio (Gallery) ─── */}
            <SectionBlock
              id="design-portfolio"
              title="আমাদের কাজের নমুনা"
            >
              <div className="space-y-5">
                <p className="text-sm leading-relaxed">
                  নিচে আমাদের কিছু আর্কিটেকচারাল ডিজাইনের নমুনা দেওয়া হলো। এই ডিজাইনগুলো আমাদের দক্ষ টিমের সৃজনশীলতার প্রতিফলন।
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((img, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-sm font-semibold text-white">Architecture Design Sample {i + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBlock>

            {/* ─── 5. House Building & Factory Design ─── */}
            <SectionBlock
              id="house-factory-design"
              title="সকল ধরনের বাড়ির ডিজাইন"
            >
              <div className="space-y-5">
                <p className="text-sm leading-relaxed">
                  সকল ধরনের বাড়ির ডিজাইন দেখতে নিচের লিঙ্কে ক্লিক করুন:
                </p>

                <Link
                  href="/blog"
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                    <Home size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      HOUSE-BUILDING AND FACTORY DESIGN
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      বাড়ি, মার্কেট, ইন্ডাস্ট্রি ও ফ্যাক্টরির প্ল্যান ও ডিজাইন দেখুন
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              </div>
            </SectionBlock>

            {/* ─── 6. Civil Engineering Tips & Tricks ─── */}
            <SectionBlock
              id="tips-tricks"
              title="বাড়ি নির্মাণ সম্পর্কে টিপস ও ট্রিকস"
            >
              <div className="space-y-5">
                <p className="text-sm leading-relaxed">
                  বাড়ি নির্মাণ সম্পর্কে টিপস ও ট্রিকস জানতে নিচের লিঙ্কে ক্লিক করুন:
                </p>

                <Link
                  href="/blog"
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-white p-5 shadow-sm transition-all duration-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600">
                    <Lightbulb size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground group-hover:text-amber-600 transition-colors">
                      CIVIL ENGINEERING TIPS & TRICKS
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      বাড়ি নির্মাণ সম্পর্কে দরকারী টিপস, ট্রিকস ও গাইডলাইন
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition-all duration-200 group-hover:bg-amber-600 group-hover:text-white">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              </div>
            </SectionBlock>

            {/* ─── 7. Contact Section ─── */}
            <SectionBlock
              id="contact"
              title="যোগাযোগ"
            >
              <div className="space-y-5">
                <p className="text-sm leading-relaxed">
                  আমাদের সেবা সম্পর্কে বিস্তারিত জানতে বা ডিজাইন অর্ডার করতে আজই যোগাযোগ করুন:
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="https://wa.me/8801741454219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-green-200/60 bg-green-50/50 p-4 transition-all duration-200 hover:border-green-300 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">01741454219</p>
                    </div>
                  </a>
                  <a
                    href="https://www.facebook.com/engineers720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-blue-200/60 bg-blue-50/50 p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Facebook size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Facebook Page</p>
                      <p className="text-xs text-muted-foreground">Siraj Tech</p>
                    </div>
                  </a>
                  <a
                    href="tel:01741454219"
                    className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Phone / IMO / Viber</p>
                      <p className="text-xs text-muted-foreground">01741454219</p>
                    </div>
                  </a>
                  <a
                    href="https://www.youtube.com/SirajTech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-red-200/60 bg-red-50/50 p-4 transition-all duration-200 hover:border-red-300 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <Youtube size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">YouTube</p>
                      <p className="text-xs text-muted-foreground">Siraj Tech</p>
                    </div>
                  </a>
                </div>

                {/* Office Address */}
                <div className="rounded-xl border border-border/50 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <MapPinned size={20} className="mt-0.5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">অফিস ঠিকানা</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        House-4, Road-3, Block-E, Mirpur-1, Kolwalapara, Dhaka-1216
                      </p>
                      <p className="mt-0.5 text-xs italic text-muted-foreground/70">
                        Beside of Dr. Amanat Khan Hospital and Diagnostic Center
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionBlock>

            {/* ── Still Need Help? ── */}
            <ScrollReveal direction="up" delay={200}>
              <div className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Users size={28} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
                  আপনার প্রজেক্ট নিয়ে আলোচনা করতে চান?
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  আমাদের বিশেষজ্ঞ টিম আপনার প্রজেক্ট নিয়ে আলোচনা করতে এবং সঠিক সমাধান দিতে প্রস্তুত। আজই যোগাযোগ করুন।
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="https://wa.me/8801741454219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-600 hover:shadow-xl hover:scale-105"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                  <a
                    href="tel:01741454219"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <Phone size={18} className="text-primary" />
                    কল করুন
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <ArrowRight size={18} />
                    Contact Page
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Fixed TOC Sidebar (desktop) ── */}
        <aside
          className={cn(
            "hidden lg:block fixed top-32 z-30 transition-opacity duration-300",
            showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          style={{
            right: `max(1rem, calc((100vw - 1200px) / 2 + 2rem + 0.5rem))`,
          }}
        >
          <div className="w-64 rounded-2xl border border-border/60 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
            <TOCSidebar
              sections={serviceSections}
              activeSection={activeSection}
            />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ServicesClient;
