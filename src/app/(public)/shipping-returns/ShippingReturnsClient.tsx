'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import {
  Truck,
  RotateCcw,
  ChevronRight,
  Package,
  MapPin,
  DollarSign,
  ShoppingCart,
  Clock,
  Gift,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ShippingReturnData, ShippingReturnSection, fetchShippingReturns } from "@/lib/api";

// ─── Fallback Data ───────────────────────────────────────────────────

const fallbackShippingSections: ShippingReturnSection[] = [
  {
    id: "order-method",
    title: "অর্ডার পদ্ধতি",
    content: `
      <ul class="list-inside list-disc space-y-2">
        <li>ওয়েবসাইট থেকে অর্ডার করতে পারবেন।</li>
        <li>
          সরাসরি হোয়াটসঅ্যাপ মেসেঞ্জার বা ফোন করে অর্ডার করতে
          পারবেন। (এক্ষেত্রে অবশ্যই প্রোডাক্টের বিবরণ উল্লেখ
          করতে হবে, যেমনঃ কতো গ্যালন, কি রঙের, কত GSM + কোন
          জেলায় নিবেন।)
        </li>
      </ul>
    `,
  },
  {
    id: "delivery-method",
    title: "ডেলিভারি পদ্ধতি",
    content: `
      <p class="mb-3 font-medium text-foreground">
        সাধারণত ২ থেকে ৭ দিনের মধ্যে আমরা ডেলিভারি দিয়ে থাকি।
        আমাদের ডেলিভারি ৩ ভাবে হয়ে থাকে।
      </p>
      <div class="space-y-4">
        <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
          <h3 class="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
            হোম ডেলিভারি
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            প্রত্যন্ত গ্রাম হলে আশেপাশের বাজার গুলোতে দিয়ে আসবে।
          </p>
        </div>
        <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
          <h3 class="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
            স্টেড ফাস্ট অফিস ডেলিভারি
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            স্টেড ফাস্ট এর অফিস থেকে ডেলিভারি নিতে হবে। অনেকটা
            সুন্দরবন কুরিয়ারের মত। তবে স্টেড ফাস্ট এর অফিস
            প্রতিটি থানা পর্যায় রয়েছে।
          </p>
        </div>
        <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
          <h3 class="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
            সুন্দরবন কুরিয়ার
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            সুন্দরবন কুরিয়ারের মাধ্যমে পার্সেল নিতে পারবেন। তবে
            সুন্দরবন এর এজেন্ট পয়েন্ট গুলো থেকে নিলে পণ্যের মূল্য
            অগ্রিম পরিশোধ করতে হবে।
          </p>
        </div>
      </div>
    `,
  },
  {
    id: "delivery-charge",
    title: "ডেলিভারি চার্জ কত?",
    content: `
      <div class="space-y-4">
        <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
          <h3 class="mb-1 flex items-center gap-2 text-base font-semibold text-foreground">
            হোম ডেলিভারি
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            ১ গ্রাম থেকে ১ কেজি ১২০ টাকা, এর পর প্রতি কেজিতে ১৬
            টাকা করে যোগ হবে।
          </p>
        </div>
        <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
          <h3 class="mb-1 flex items-center gap-2 text-base font-semibold text-foreground">
            স্টেড ফাস্ট অফিস ডেলিভারি
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            ১ গ্রাম থেকে ১ কেজি ১০০ টাকা, এর পর প্রতি কেজিতে ১৫
            টাকা করে যোগ হবে।
          </p>
        </div>
        <div class="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
          <h3 class="mb-1 flex items-center gap-2 text-base font-semibold text-foreground">
            সুন্দরবন কুরিয়ার
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            কুরিয়ার অফিস যে চার্জ লেখবে। সেটি দিয়ে কুরিয়ার অফিস
            থেকে পার্সেল নিয়ে নিতে হবে। তবে তারা মিনিমাম ১২০
            টাকার নিচে চার্জ ধরে না। বড় পার্সেল গুলো সুন্দরবনে
            নেওয়া ভালো। এবং এর সাথে VD বা COD চার্জ যোগ হবে।
            সুন্দরবনের এজেন্সি বা অন্য কুরিয়ারে নিলে পণ্যের মূল্য
            অগ্রিম পরিশোধ করতে হবে।
          </p>
        </div>
      </div>
      <div class="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm font-medium text-foreground">
        <strong>বিঃদ্রঃ</strong> – হোম ডেলিভারি ও স্টেড ফাস্ট
        অফিস ডেলিভারির চেয়ে সুন্দরবন কুরিয়ার চার্জ অনেক কম নিয়ে
        থাকে।
      </div>
    `,
  },
  {
    id: "return-exchange",
    title: "পণ্য পরিবর্তন ও ফেরত",
    content: `
      <div class="space-y-4">
        <div class="rounded-xl border border-blue-200/60 bg-blue-50/50 p-4">
          <h3 class="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
            পরিবর্তন
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            কেবলমাত্র ১ থেকে ৩৫ গ্যালন এবং সবজি বেডের মধ্যে রাউন্ড
            বেড ২৪ &times; ৮″ ও ৩৬ &times; ১০″ পণ্যগুলো পরিবর্তন
            করা যাবে। এর চেয়ে বড়ো সাইজের ব্যাগ কোনোভাবেই পরিবর্তন
            করা যাবে না। ছাদ-বাগানের জন্যে এর চেয়ে বড়ো ব্যাগের
            প্রয়োজন হয়না। ২০০ ও ৩০০ জি এস এম এর ব্যাগ গুলো
            পরিবর্তন করা যাবে না। উল্লেখ্য যে, ২০০ ও ৩০০ জি এস এম
            এর ব্যাগ গুলো অনেক পাতলা ও লো কোয়ালিটি হয়ে থাকে।
          </p>
        </div>
        <div class="rounded-xl border border-green-200/60 bg-green-50/50 p-4">
          <h3 class="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
            ফেরত
          </h3>
          <p class="text-sm leading-relaxed mb-0">
            পণ্যের কোনো সমস্যা থাকলে (সেলাই খুলে যাওয়া, ফেটে যাওয়া
            ইত্যাদি) তা পরিবর্তন করা যাবে বা ফেরত পাঠাতে পারবেন।
          </p>
        </div>
      </div>
    `,
  },
];

const fallbackRefundSections: ShippingReturnSection[] = [
  {
    id: "interpretation",
    title: "Return and Refund Policy",
    content: `
      <p class="text-sm italic text-muted-foreground/70">
        Last updated: November 16, 2020
      </p>
      <p class="mt-3">Thank you for shopping at Siraj Tech.</p>
      <p class="mt-3">
        If, for any reason, You are not completely satisfied with a
        purchase We invite You to review our policy on refunds and
        returns.
      </p>
      <p class="mt-3">
        The following terms are applicable for any products that You
        purchased with Us.
      </p>
      <h3 class="mb-3 mt-6 text-lg font-bold text-foreground">
        Interpretation and Definitions
      </h3>
      <p class="font-semibold text-foreground">Interpretation</p>
      <p class="mt-1">
        The words of which the initial letter is capitalized have
        meanings defined under the following conditions. The
        following definitions shall have the same meaning regardless
        of whether they appear in singular or in plural.
      </p>
      <p class="mt-4 font-semibold text-foreground">Definitions</p>
      <p class="mt-1">For the purposes of this Return and Refund Policy:</p>
      <ul class="mt-2 list-inside list-disc space-y-1.5">
        <li><strong>Company</strong> refers to Siraj Tech.</li>
        <li><strong>Goods</strong> refer to the items offered for sale on the Service.</li>
        <li><strong>Orders</strong> mean a request by You to purchase Goods from Us.</li>
        <li><strong>Service</strong> refers to the Website.</li>
        <li><strong>Website</strong> refers to Siraj Tech (<a href="https://sirajtech.org" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">https://sirajtech.org</a>).</li>
        <li><strong>You</strong> means the individual accessing or using the Service.</li>
      </ul>
    `,
  },
  {
    id: "cancellation",
    title: "Your Order Cancellation Rights",
    content: `
      <p>You are entitled to cancel Your Order within 7 days without giving any reason for doing so.</p>
      <p class="mt-3">
        The deadline for cancelling an Order is 7 days from the date on which You received the Goods or on which a third party you have appointed takes possession of the product delivered.
      </p>
      <p class="mt-3">In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement.</p>
      <p class="mt-3">
        We will reimburse You no later than 14 days from the day on which We receive the returned Goods without incurring any fees.
      </p>
    `,
  },
  {
    id: "conditions",
    title: "Conditions for Returns",
    content: `
      <p>In order for the Goods to be eligible for a return, please make sure that:</p>
      <ul class="mt-2 list-inside list-disc space-y-1.5">
        <li>The Goods were purchased in the last 7 days</li>
        <li>The Goods are in the original packaging</li>
      </ul>
      <p class="mt-4 font-semibold text-foreground">The following Goods cannot be returned:</p>
      <ul class="mt-2 list-inside list-disc space-y-1.5">
        <li>The supply of Goods made to Your specifications or personalized.</li>
        <li>The supply of Goods which deteriorate rapidly or expired.</li>
        <li>Goods unsealed after delivery due to health/hygiene protection.</li>
      </ul>
    `,
  },
  {
    id: "returning-goods",
    title: "Returning Goods",
    content: `
      <p>You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods to our office address.</p>
      <p class="mt-3">We cannot be held responsible for Goods damaged or lost in return shipment.</p>
    `,
  },
  {
    id: "gifts",
    title: "Gifts",
    content: `
      <p>If the Goods were marked as a gift when purchased and shipped directly to you, You’ll receive a gift credit for the value of your return.</p>
    `,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `
      <p>If you have any questions about our Returns and Refunds Policy, please contact us via email or phone.</p>
    `,
  },
];

// Helper to select an appropriate Lucide icon dynamically
const getSectionIcon = (id: string, index: number): React.ElementType => {
  const lower = id.toLowerCase();
  if (lower.includes("order") || lower.includes("অর্ডার")) return ShoppingCart;
  if (lower.includes("delivery") || lower.includes("ডেলিভারি") || lower.includes("truck")) return Truck;
  if (lower.includes("charge") || lower.includes("চার্জ") || lower.includes("price") || lower.includes("cost")) return DollarSign;
  if (lower.includes("return") || lower.includes("exchange") || lower.includes("ফেরত") || lower.includes("পরিবর্তন")) return RotateCcw;
  if (lower.includes("cancell") || lower.includes("clock") || lower.includes("time")) return Clock;
  if (lower.includes("condition") || lower.includes("shield") || lower.includes("security")) return ShieldCheck;
  if (lower.includes("package") || lower.includes("good")) return Package;
  if (lower.includes("gift")) return Gift;
  if (lower.includes("contact") || lower.includes("mail") || lower.includes("phone")) return Mail;
  if (lower.includes("definition") || lower.includes("interpretation") || lower.includes("policy")) return FileText;
  
  const iconList = [FileText, Truck, DollarSign, RotateCcw, Package, ShieldCheck, Clock, Gift, Mail, MapPin];
  return iconList[index % iconList.length];
};

// ─── TOC Sidebar Component ───────────────────────────────────────────

interface TOCItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const TOCSidebar = ({
  sections,
  activeSection,
  tabValue,
}: {
  sections: TOCItem[];
  activeSection: string;
  tabValue: string;
}) => {
  const handleClick = (id: string) => {
    const el = document.getElementById(`${tabValue}-${id}`);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="w-full space-y-1" aria-label="Table of contents">
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

// ─── Section Content Component ───────────────────────────────────────

const SectionBlock = ({
  id,
  tabValue,
  title,
  htmlContent,
  children,
}: {
  id: string;
  tabValue: string;
  title: string;
  htmlContent?: string;
  children?: React.ReactNode;
}) => (
  <section id={`${tabValue}-${id}`} className="scroll-mt-28">
    <ScrollReveal>
      <div className="mb-8 rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <div className="prose prose-sm max-w-none leading-relaxed text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline sm:prose-base">
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            children
          )}
        </div>
      </div>
    </ScrollReveal>
  </section>
);

// ─── Active Section Tracker Hook ─────────────────────────────────────

function useActiveSection(
  sectionIds: string[],
  tabValue: string,
  offset = 160
): string {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (!sectionIds.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace(`${tabValue}-`, ""));
          }
        }
      },
      {
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold: 0,
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(`${tabValue}-${id}`))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, tabValue, offset]);

  return active;
}

// ─── Main Component ──────────────────────────────────────────────────

interface ShippingReturnsClientProps {
  initialData?: ShippingReturnData | null;
}

const ShippingReturnsClient = ({ initialData }: ShippingReturnsClientProps) => {
  const [activeTab, setActiveTab] = useState("shipping");

  const { data: dynamicData } = useQuery({
    queryKey: ["shipping-returns"],
    queryFn: fetchShippingReturns,
    initialData: initialData,
    staleTime: 30 * 1000,
  });

  const data = dynamicData || initialData;

  // Dynamic Data & Fallbacks
  const heroBadge = data?.hero_badge || "Shipping & Returns";
  const heroTitle = data?.hero_title || "Shipping & Returns";
  const heroSubtitle =
    data?.hero_subtitle ||
    "Learn about our shipping methods, delivery charges, and return & refund policies for a smooth shopping experience.";

  const shippingTabLabel = data?.shipping_tab_title || "Shipping & Delivery";
  const returnTabLabel = data?.return_tab_title || "Return & Refund Policy";

  const contactEmail = data?.contact_email || "info@sirajtech.org";
  const contactPhone = data?.contact_phone || "01706176403";

  const shippingSections = useMemo(() => {
    return (
      data?.shipping_sections && data.shipping_sections.length > 0
        ? data.shipping_sections
        : fallbackShippingSections
    ).map((s, idx) => ({
      ...s,
      icon: getSectionIcon(s.id || s.title, idx),
    }));
  }, [data?.shipping_sections]);

  const refundSections = useMemo(() => {
    return (
      data?.return_sections && data.return_sections.length > 0
        ? data.return_sections
        : fallbackRefundSections
    ).map((s, idx) => ({
      ...s,
      icon: getSectionIcon(s.id || s.title, idx),
    }));
  }, [data?.return_sections]);

  const shippingIds = useMemo(() => shippingSections.map((s) => s.id), [shippingSections]);
  const refundIds = useMemo(() => refundSections.map((s) => s.id), [refundSections]);

  const activeShippingSection = useActiveSection(shippingIds, "shipping");
  const activeRefundSection = useActiveSection(refundIds, "refund");

  const tocScrollRef = useRef<HTMLDivElement>(null);

  const activeSection =
    activeTab === "shipping" ? activeShippingSection : activeRefundSection;

  const currentTOCSections = useMemo<TOCItem[]>(() => {
    const list = activeTab === "shipping" ? shippingSections : refundSections;
    return list.map((s) => ({
      id: s.id,
      label: s.title,
      icon: s.icon,
    }));
  }, [activeTab, shippingSections, refundSections]);

  // Tab configurations
  const tabs = useMemo(
    () => [
      { value: "shipping", label: shippingTabLabel, icon: Truck },
      { value: "refund", label: returnTabLabel, icon: RotateCcw },
    ],
    [shippingTabLabel, returnTabLabel]
  );

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
  }, [activeSection, activeTab]);

  // Hide sidebar when near footer (throttled with rAF)
  const [showSidebar, setShowSidebar] = useState(true);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollBottom = window.innerHeight + window.scrollY;
          const docHeight = document.body.offsetHeight;
          setShowSidebar(scrollBottom < docHeight - 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-section-alt/30">
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-600 to-primary-800 pb-12 pt-8 sm:pb-16 sm:pt-12 md:pb-20 md:pt-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />

          <div className="container-main relative z-10">
            <ScrollReveal direction="up">
              <div className="mx-auto max-w-3xl text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                  <Truck size={12} />
                  {heroBadge}
                </span>
                <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  {heroTitle}
                </h1>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                  {heroSubtitle}
                </p>
              </div>
            </ScrollReveal>

            {/* Tab Switcher */}
            <ScrollReveal direction="up" delay={150}>
              <div className="mx-auto mt-8 flex justify-center sm:mt-10">
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => {
                    setActiveTab(val);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <TabsList className="h-auto gap-1 rounded-xl bg-white/15 p-1.5 backdrop-blur-sm">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white/80 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg",
                            "data-[state=active]:scale-105"
                          )}
                        >
                          <Icon size={16} />
                          <span className="hidden sm:inline">{tab.label}</span>
                          <span className="sm:hidden">
                            {tab.value === "shipping" ? "Shipping" : "Refund"}
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mobile Fixed TOC */}
        <div className="lg:hidden fixed top-11 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-border/60 shadow-sm py-2.5 px-4">
          <div className="max-w-[1200px] mx-auto">
            <div
              className="flex gap-2 overflow-x-auto pb-1 mobile-toc-scroll"
              ref={tocScrollRef}
            >
              {currentTOCSections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  data-section-id={id}
                  onClick={() => {
                    const el = document.getElementById(`${activeTab}-${id}`);
                    if (el) {
                      const top =
                        el.getBoundingClientRect().top + window.scrollY - 100;
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

        {/* Content Area */}
        <div className="container-main py-10 sm:py-12 md:py-16 pt-14 sm:pt-14 md:pt-16">
          <div className="min-w-0 lg:pr-[280px]">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Tab: Shipping & Delivery */}
              <TabsContent value="shipping" className="mt-0">
                <div className="space-y-6">
                  {shippingSections.map((section) => (
                    <SectionBlock
                      key={section.id}
                      id={section.id}
                      tabValue="shipping"
                      title={section.title}
                      htmlContent={section.content}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Tab: Return & Refund Policy */}
              <TabsContent value="refund" className="mt-0">
                <div className="space-y-6">
                  {refundSections.map((section) => {
                    // Inject support contact info if it's the contact section
                    const isContactSec =
                      section.id === "contact" ||
                      section.title.toLowerCase().includes("contact");

                    return (
                      <SectionBlock
                        key={section.id}
                        id={section.id}
                        tabValue="refund"
                        title={section.title}
                        htmlContent={section.content}
                      >
                        {isContactSec && (
                          <div className="mt-4 space-y-3">
                            {contactEmail && (
                              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                                <Mail size={18} className="shrink-0 text-primary" />
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">
                                    Email
                                  </p>
                                  <a
                                    href={`mailto:${contactEmail}`}
                                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                                  >
                                    {contactEmail}
                                  </a>
                                </div>
                              </div>
                            )}
                            {contactPhone && (
                              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                                <Phone size={18} className="shrink-0 text-primary" />
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">
                                    Phone
                                  </p>
                                  <a
                                    href={`tel:${contactPhone}`}
                                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                                  >
                                    {contactPhone}
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </SectionBlock>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Fixed TOC Sidebar (Desktop) */}
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
              sections={currentTOCSections}
              activeSection={activeSection}
              tabValue={activeTab}
            />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ShippingReturnsClient;
