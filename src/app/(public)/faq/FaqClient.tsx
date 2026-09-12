'use client';

import { useState, useEffect, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Home,
  MapPin,
  Wrench,
  Phone,
  MessageCircle,
  Youtube,
  Facebook,
  Building2,
  Ruler,
  Construction,
  FileText,
  Monitor,
  Calculator,
  Eye,
  HardHat,
  MapPinned,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronRight,
} from "lucide-react";

// ─── Shared Service Grid ────────────────────────────────────────────

interface ServiceItem {
  icon: React.ElementType;
  label: string;
  sub: string;
}

const serviceItems: ServiceItem[] = [
  { icon: FileText, label: "বিল্ডিং প্ল্যান", sub: "স্টিল + আর.সি.সি" },
  { icon: Ruler, label: "স্ট্রাকচারাল ডিজাইন", sub: "স্টিল + আর.সি.সি" },
  { icon: Building2, label: "আর্কিটেকচারাল প্ল্যান", sub: "সম্পূর্ণ ডিজাইন" },
  { icon: Monitor, label: "এক্সটেরিয়র ডিজাইন", sub: "+ ভিডিও এনিমেশন" },
  { icon: Construction, label: "কনস্ট্রাকশন", sub: "নির্মাণ কাজ" },
  { icon: HardHat, label: "সয়েল টেস্ট", sub: "মাটি পরীক্ষা" },
  { icon: MapPinned, label: "পৌরসভা / রাজউক প্ল্যান", sub: "অনুমোদন" },
  { icon: Eye, label: "ডিজিটাল সার্ভে", sub: "আধুনিক জরিপ" },
  { icon: Calculator, label: "এস্টিমেটিং এবং কস্টিং", sub: "স্টিল + আর.সি.সি" },
  { icon: HardHat, label: "সাইট সুপারভিশন", sub: "স্টিল + আর.সি.সি" },
];

const ServiceGrid = () => (
  <div className="grid gap-2 sm:grid-cols-2">
    {serviceItems.map(({ icon: Icon, label, sub }) => (
      <div
        key={label}
        className="flex items-center gap-3 rounded-xl border border-border/40 bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>
    ))}
  </div>
);

// ─── FAQ Categories Data ────────────────────────────────────────────

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface FaqCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  titleBn: string;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    id: "house-design",
    icon: Home,
    title: "House & Factory Design",
    titleBn: "বাড়ি ও কারখানা ডিজাইন",
    items: [
      {
        id: "design-free",
        question: "আমি একটি বাড়ির ডিজাইন করব. আপনারা কি ফ্রিতে দিবেন নাকি টাকা নিবেন?",
        answer: (
          <div className="space-y-4">
            <p className="text-base leading-relaxed">
              জি ভাই, কিছু টাকা দিয়ে করে নিতে হবে। যেকোনো ধরনের বাড়ির ডিজাইন অনলাইনের মাধ্যমে সার্ভিস দিয়ে থাকি।
            </p>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                <Star size={16} className="text-primary" />
                আমাদের ডিজাইন সেবা সমূহ
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-white p-3.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">শুধু মাত্র ২ডি ফ্লোর প্লান</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">বেসিক ফ্লোর প্ল্যান ডিজাইন</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-white p-3.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">২ডি ফ্লোর প্লান + ভিডিও এনিমেশন সহ ৩ডি ডিজাইন (এক্সটেরিয়র)</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">সম্পূর্ণ ৩ডি ভিজুয়ালাইজেশন সহ এক্সটেরিয়র ডিজাইন</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-white p-3.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">আর্কিটেকচারাল প্ল্যান + স্ট্রাকচারাল ডিজাইন + ভিডিও এনিমেশন সহ ৩ডি ডিজাইন + এস্টিমেটিং এবং কস্টিং</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">সম্পূর্ণ প্যাকেজ - ডিজাইন থেকে কনস্ট্রাকশন পর্যন্ত</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-orange-200/60 bg-orange-50/70 p-4">
              <p className="flex items-start gap-2 text-sm font-medium text-orange-800">
                <Youtube size={18} className="mt-0.5 shrink-0" />
                <span>
                  ইউটিউবে আমরা আপনাদের সুবিধার্থে কিছু বাড়ির ডিজাইন শেয়ার করেছি, ওগুলো আপনারা ফ্রিতে দেখতে পারেন.{" "}
                  <a
                    href="https://www.youtube.com/SirajTech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-orange-700 underline hover:text-orange-900"
                  >
                    ভিডিও দেখতে এখানে ক্লিক করুন <ArrowRight size={14} />
                  </a>
                </span>
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "design-service-type",
        question: "আপনাদের ডিজাইন সেবা গুলো কি কি?",
        answer: (
          <div className="space-y-3">
            <p className="text-base font-medium text-foreground">আমাদের সেবা সমূহ:</p>
            <ServiceGrid />
            <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">এবং আরও:</strong> Factory, High rise building, Steel building, Rcc building, Steel warehouse and Rcc & Steel Structures Design, and all kind of Erection and Fabrication.
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "coverage",
    icon: MapPin,
    title: "Service Coverage",
    titleBn: "সেবা এলাকা",
    items: [
      {
        id: "coverage-area",
        question: "আপনারা কি সমগ্র বাংলাদেশে কাজ করেন?",
        answer: (
          <div className="space-y-4">
            <p className="text-base leading-relaxed">
              আমরা সমগ্র বাংলাদেশের যেকোনো প্রকার স্টিল বিল্ডিং, ইন্ডাস্ট্রিয়াল শেড ও আর সি সি (RCC) বাড়ি তৈরী করি।
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/70 p-4">
              <CheckCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-800">
                তবে ছোট কোনো কাজ হলে ভেবে দেখতে হবে, কারণ এখানে আপনার আমার ২ জনারই পরতা পরবে না।
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "services",
    icon: Wrench,
    title: "Our Services",
    titleBn: "আমাদের সেবা",
    items: [
      {
        id: "services-list",
        question: "আপনাদের সেবা গুলো কি কি?",
        answer: (
          <div className="space-y-4">
            <p className="text-base font-medium text-foreground">আমাদের সেবা সমূহ:</p>
            <ServiceGrid />
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">এবং আরও:</strong> Factory, High rise building, Steel building, RCC building, Steel warehouse and RCC & Steel Structures Design, and all kind of Erection and Fabrication.
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "contact",
    icon: Phone,
    title: "Contact Us",
    titleBn: "যোগাযোগ",
    items: [
      {
        id: "contact-methods",
        question: "আপনাদের সাথে কিভাবে যোগাযোগ করব?",
        answer: (
          <div className="space-y-5">
            <p className="text-base font-medium text-foreground">
              আমাদের সাথে যোগাযোগের ঠিকানা:
            </p>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">অনলাইনে তিন ভাবে আমাদের সাথে যোগাযোগ করতে পারেন:</h4>
              <div className="space-y-3">
                <a
                  href="https://www.facebook.com/engineers720"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Facebook size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">ফেসবুক পেজ / Facebook Page</p>
                    <p className="text-sm text-muted-foreground">Click: Siraj Tech</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-muted-foreground" />
                </a>

                <a
                  href="https://wa.me/8801741454219"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-white p-4 shadow-sm transition-all duration-200 hover:border-green-300 hover:shadow-md hover:shadow-green-100/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <MessageCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Whatsapp / হোয়াটসঅ্যাপ</p>
                    <p className="text-sm text-muted-foreground">01741454219</p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-muted-foreground" />
                </a>

                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Phone size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Imo / ইমু Or Viber</p>
                    <p className="text-sm text-muted-foreground">01741454219</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-green-200/60 bg-green-50/70 p-3.5 text-sm text-green-800">
                <p className="flex items-center gap-2 font-medium">
                  <CheckCircle size={16} />
                  এ তিন পদ্ধতির মধ্যে যেকোনো একটিতে Text অথবা Voice Record করলে, আমরা ১০০% রিপ্লাই দিব
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">অথবা সরাসরি আমাদের অফিসে আসতে পারেন:</h4>
              <div className="rounded-xl border border-border/50 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <MapPinned size={20} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">সিরাজ টেক লিমিটেড</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      House-4, Road-3, Block-E, Mirpur-1, Kolwalapara, Dhaka-1216
                    </p>
                    <p className="mt-1 text-xs italic text-muted-foreground/70">
                      Beside of Dr. Amanat Khan Hospital and Diagnostic Center
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="https://www.facebook.com/engineers720"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl border border-blue-200/60 bg-blue-50/50 p-4 text-sm font-semibold text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:shadow-md"
              >
                <Facebook size={20} />
                Facebook Page
              </a>
              <a
                href="https://www.youtube.com/SirajTech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-xl border border-red-200/60 bg-red-50/50 p-4 text-sm font-semibold text-red-700 transition-all duration-200 hover:bg-red-100 hover:shadow-md"
              >
                <Youtube size={20} />
                YouTube Channel
              </a>
            </div>

            <div className="rounded-xl border border-orange-200/60 bg-orange-50/70 p-4">
              <a
                href="https://www.youtube.com/SirajTech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm font-medium text-orange-800"
              >
                <Youtube size={20} className="shrink-0" />
                <span>
                  ভিডিও দেখতে এখানে ক্লিক করুন -{" "}
                  <span className="font-semibold underline">youtube.com/SirajTech</span>
                </span>
                <ArrowRight size={16} className="ml-auto shrink-0" />
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
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
    const el = document.getElementById(`faq-section-${id}`);
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

// ─── FAQ Category Accordion Section ──────────────────────────────────

const FaqCategorySection = ({
  category,
  index,
}: {
  category: FaqCategory;
  index: number;
}) => {
  const Icon = category.icon;
  return (
    <ScrollReveal direction="up" delay={index * 80}>
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-center gap-3 border-b border-border/40 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent px-5 py-4 sm:px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground sm:text-lg">{category.titleBn}</h2>
            <p className="text-xs text-muted-foreground">{category.title}</p>
          </div>
        </div>

        <Accordion type="single" collapsible className="px-5 sm:px-7">
          {category.items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-border/30 last:border-0">
              <AccordionTrigger className="py-4 text-left text-sm font-semibold text-foreground hover:no-underline hover:text-primary data-[state=open]:text-primary sm:text-base">
                <span className="flex items-start gap-2.5 pr-2">
                  <HelpCircle size={16} className="mt-0.5 shrink-0 text-primary/70" />
                  <span>{item.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground">
                <div className="pl-7">{item.answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollReveal>
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

// ─── Page Component ──────────────────────────────────────────────────

const tocSections: TOCItem[] = faqCategories.map((c) => ({
  id: c.id,
  label: c.titleBn,
  icon: c.icon,
}));

const FaqHelp = () => {
  const sectionIds = faqCategories.map((c) => c.id);
  const activeSection = useActiveSection(sectionIds, "faq-section");
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
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">

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
                <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  FAQ &amp; Help
                </h1>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                  সিরাজ টেক সম্পর্কিত আপনার যেকোনো প্রশ্নের উত্তর এখানে খুঁজুন। বাড়ির ডিজাইন, সেবা, যোগাযোগ ও আরও অনেক কিছু।
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
              {tocSections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  data-section-id={id}
                  onClick={() => {
                    const el = document.getElementById(`faq-section-${id}`);
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

        {/* ── FAQ Content ── */}
        <div className="container-main py-10 sm:py-12 md:py-16 pt-14 sm:pt-14 md:pt-16">
          <div className="min-w-0 lg:pr-[280px]">
            {/* Section Intro */}
            <ScrollReveal direction="up">
              <div className="mb-10 text-center">
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  সচরাচর জিজ্ঞাসিত প্রশ্ন
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  আপনার সুবিধার্থে আমরা কিছু সাধারণ প্রশ্নের উত্তর নিচে সাজিয়েছি। আপনার প্রশ্নের উত্তর না পেলে সরাসরি আমাদের সাথে যোগাযোগ করুন।
                </p>
              </div>
            </ScrollReveal>

            {/* FAQ Categories */}
            {faqCategories.map((category, index) => (
              <div key={category.id} id={`faq-section-${category.id}`} className="scroll-mt-28">
                <FaqCategorySection category={category} index={index} />
              </div>
            ))}

            {/* ── Still Have Questions? ── */}
            <ScrollReveal direction="up" delay={200}>
              <div className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <HelpCircle size={28} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
                  এখনও কি প্রশ্ন আছে?
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  আপনার প্রশ্নের উত্তর না পেলে সরাসরি আমাদের সাথে যোগাযোগ করুন। আমরা ২৪ ঘন্টার মধ্যে আপনার উত্তর দিব।
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="https://www.facebook.com/engineers720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-primary-600 hover:shadow-xl hover:scale-105"
                  >
                    <Facebook size={18} />
                    Facebook Page
                  </a>
                  <a
                    href="https://wa.me/8801741454219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <MessageCircle size={18} className="text-green-500" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:01741454219"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
                  >
                    <Phone size={18} className="text-primary" />
                    কল করুন
                  </a>
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
              sections={tocSections}
              activeSection={activeSection}
            />
          </div>
        </aside>
      </main>

    </div>
  );
};

export default FaqHelp;
