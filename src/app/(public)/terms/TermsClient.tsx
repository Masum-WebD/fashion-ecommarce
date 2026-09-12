'use client';

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import {
  FileText,
  Truck,
  ChevronRight,
  Scale,
  Cookie,
  Copyright,
  MessageSquare,
  Link2,
  Layout,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Info,
  Package,
  MapPin,
  DollarSign,
  RotateCcw,
} from "lucide-react";

// ─── TOC Items ───────────────────────────────────────────────────────

const termsSections = [
  { id: "welcome", label: "Introduction", icon: Info },
  { id: "cookies", label: "Cookies", icon: Cookie },
  { id: "license", label: "License", icon: Copyright },
  { id: "comments", label: "User Comments", icon: MessageSquare },
  { id: "hyperlinking", label: "Hyperlinking", icon: Link2 },
  { id: "iframes", label: "iFrames", icon: Layout },
  { id: "content-liability", label: "Content Liability", icon: AlertTriangle },
  { id: "reservation-rights", label: "Reservation of Rights", icon: ShieldCheck },
  { id: "removal-links", label: "Removal of Links", icon: ExternalLink },
  { id: "disclaimer", label: "Disclaimer", icon: Scale },
];

const deliverySections = [
  { id: "order-method", label: "অর্ডার পদ্ধতি", icon: Package },
  { id: "delivery-method", label: "ডেলিভারি পদ্ধতি", icon: Truck },
  { id: "delivery-charge", label: "ডেলিভারি চার্জ", icon: DollarSign },
  { id: "return-policy", label: "পরিবর্তন ও ফেরত", icon: RotateCcw },
];

// ─── Tab Configuration ───────────────────────────────────────────────

const tabs = [
  { value: "terms", label: "Terms & Conditions", icon: FileText },
  { value: "delivery", label: "অর্ডার ও ডেলিভারি", icon: Truck },
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
  children,
}: {
  id: string;
  tabValue: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section
    id={`${tabValue}-${id}`}
    className="scroll-mt-28"
  >
    <ScrollReveal>
      <div className="mb-8 rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8 lg:p-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <div className="prose prose-sm max-w-none leading-relaxed text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline sm:prose-base">
          {children}
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

// ─── Page Component ──────────────────────────────────────────────────

const TermsAndConditions = () => {
  const [activeTab, setActiveTab] = useState("terms");

  const termsIds = termsSections.map((s) => s.id);
  const deliveryIds = deliverySections.map((s) => s.id);

  const activeTermsSection = useActiveSection(termsIds, "terms");
  const activeDeliverySection = useActiveSection(deliveryIds, "delivery");

  const tocScrollRef = useRef<HTMLDivElement>(null);

  const activeSection =
    activeTab === "terms" ? activeTermsSection : activeDeliverySection;

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
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-600 to-primary-800 pb-12 pt-8 sm:pb-16 sm:pt-12 md:pb-20 md:pt-16">
          {/* Decorative background elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />

          <div className="container-main relative z-10">
            <ScrollReveal direction="up">
              <div className="mx-auto max-w-3xl text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                  <FileText size={12} />
                  Legal &amp; Policy
                </span>
                <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  Terms &amp; Conditions
                </h1>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                  Please read these terms carefully before using our website
                  or placing an order. By accessing Siraj Tech, you agree to
                  be bound by these terms.
                </p>
              </div>
            </ScrollReveal>

            {/* ── Tab Switcher ── */}
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
                            {tab.value === "terms" ? "T&C" : "অর্ডার"}
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

        {/* ── Mobile Fixed TOC (always visible below navbar) ── */}
        <div className="lg:hidden fixed top-11 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-border/60 shadow-sm py-2.5 px-4">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-1 mobile-toc-scroll" ref={tocScrollRef}>
              {(activeTab === "terms" ? termsSections : deliverySections).map(
                ({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    data-section-id={id}
                    onClick={() => {
                      const el = document.getElementById(
                        `${activeTab}-${id}`
                      );
                      if (el) {
                        const top =
                          el.getBoundingClientRect().top +
                          window.scrollY -
                          100;
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
                )
              )}
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="container-main py-10 sm:py-12 md:py-16 pt-14 sm:pt-14 md:pt-16">
          <div className="min-w-0 lg:pr-[280px]">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* ── Tab: Terms & Conditions ── */}
                <TabsContent value="terms" className="mt-0">
                  <div className="space-y-6">
                    <SectionBlock
                      id="welcome"
                      tabValue="terms"
                      title="Welcome to Siraj Tech!"
                    >
                      <p>
                        These terms and conditions outline the rules and
                        regulations for the use of Siraj Tech&apos;s Website,
                        located at{" "}
                        <a
                          href="https://sirajtech.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          https://sirajtech.org
                        </a>
                        .
                      </p>
                      <p className="mt-3">
                        By accessing this website we assume you accept these
                        terms and conditions. Do not continue to use Siraj Tech
                        if you do not agree to take all of the terms and
                        conditions stated on this page.
                      </p>
                      <p className="mt-3 text-sm italic text-muted-foreground/70">
                        The following terminology applies to these Terms and
                        Conditions, Privacy Statement and Disclaimer Notice and
                        all Agreements: &ldquo;Client&rdquo;, &ldquo;You&rdquo;
                        and &ldquo;Your&rdquo; refers to you, the person log on
                        this website and compliant to the Company&rsquo;s terms
                        and conditions. &ldquo;The Company&rdquo;,
                        &ldquo;Ourselves&rdquo;, &ldquo;We&rdquo;,
                        &ldquo;Our&rdquo; and &ldquo;Us&rdquo;, refers to our
                        Company. &ldquo;Party&rdquo;, &ldquo;Parties&rdquo;, or
                        &ldquo;Us&rdquo;, refers to both the Client and
                        ourselves. All terms refer to the offer, acceptance and
                        consideration of payment necessary to undertake the
                        process of our assistance to the Client in the most
                        appropriate manner for the express purpose of meeting
                        the Client&rsquo;s needs in respect of provision of the
                        Company&rsquo;s stated services, in accordance with and
                        subject to, prevailing law of Netherlands. Any use of
                        the above terminology or other words in the singular,
                        plural, capitalization and/or he/she or they, are taken
                        as interchangeable and therefore as referring to same.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="cookies"
                      tabValue="terms"
                      title="Cookies"
                    >
                      <p>
                        We employ the use of cookies. By accessing Siraj Tech,
                        you agreed to use cookies in agreement with the Siraj
                        Tech&rsquo;s Privacy Policy.
                      </p>
                      <p className="mt-3">
                        Most interactive websites use cookies to let us retrieve
                        the user&rsquo;s details for each visit. Cookies are
                        used by our website to enable the functionality of
                        certain areas to make it easier for people visiting our
                        website. Some of our affiliate/advertising partners may
                        also use cookies.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="license"
                      tabValue="terms"
                      title="License"
                    >
                      <p>
                        Unless otherwise stated, Siraj Tech and/or its licensors
                        own the intellectual property rights for all material on
                        Siraj Tech. All intellectual property rights are
                        reserved. You may access this from Siraj Tech for your
                        own personal use subjected to restrictions set in these
                        terms and conditions.
                      </p>
                      <p className="mt-4 font-semibold text-foreground">
                        You must not:
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1.5">
                        <li>Republish material from Siraj Tech</li>
                        <li>Sell, rent or sub-license material from Siraj Tech</li>
                        <li>Reproduce, duplicate or copy material from Siraj Tech</li>
                        <li>Redistribute content from Siraj Tech</li>
                      </ul>
                      <p className="mt-3">
                        This Agreement shall begin on the date hereof.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="comments"
                      tabValue="terms"
                      title="User Comments"
                    >
                      <p>
                        Parts of this website offer an opportunity for users to
                        post and exchange opinions and information in certain
                        areas of the website. Siraj Tech does not filter, edit,
                        publish or review Comments prior to their presence on
                        the website. Comments do not reflect the views and
                        opinions of Siraj Tech, its agents and/or affiliates.
                        Comments reflect the views and opinions of the person
                        who post their views and opinions. To the extent
                        permitted by applicable laws, Siraj Tech shall not be
                        liable for the Comments or for any liability, damages or
                        expenses caused and/or suffered as a result of any use
                        of and/or posting of and/or appearance of the Comments
                        on this website.
                      </p>
                      <p className="mt-3">
                        Siraj Tech reserves the right to monitor all Comments
                        and to remove any Comments which can be considered
                        inappropriate, offensive or causes breach of these Terms
                        and Conditions.
                      </p>
                      <p className="mt-4 font-semibold text-foreground">
                        You warrant and represent that:
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1.5">
                        <li>
                          You are entitled to post the Comments on our website
                          and have all necessary licenses and consents to do so
                        </li>
                        <li>
                          The Comments do not invade any intellectual property
                          right, including without limitation copyright, patent
                          or trademark of any third party
                        </li>
                        <li>
                          The Comments do not contain any defamatory, libelous,
                          offensive, indecent or otherwise unlawful material
                          which is an invasion of privacy
                        </li>
                        <li>
                          The Comments will not be used to solicit or promote
                          business or custom or present commercial activities or
                          unlawful activity
                        </li>
                      </ul>
                      <p className="mt-3">
                        You hereby grant Siraj Tech a non-exclusive license to
                        use, reproduce, edit and authorize others to use,
                        reproduce and edit any of your Comments in any and all
                        forms, formats or media.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="hyperlinking"
                      tabValue="terms"
                      title="Hyperlinking to our Content"
                    >
                      <p>
                        The following organizations may link to our Website
                        without prior written approval:
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1.5">
                        <li>Government agencies</li>
                        <li>Search engines</li>
                        <li>News organizations</li>
                        <li>
                          Online directory distributors may link to our Website
                          in the same manner as they hyperlink to the Websites
                          of other listed businesses
                        </li>
                        <li>
                          System wide Accredited Businesses except soliciting
                          non-profit organizations, charity shopping malls, and
                          charity fundraising groups which may not hyperlink to
                          our Web site
                        </li>
                      </ul>
                      <p className="mt-3">
                        These organizations may link to our home page, to
                        publications or to other Website information so long as
                        the link: (a) is not in any way deceptive; (b) does not
                        falsely imply sponsorship, endorsement or approval of
                        the linking party and its products and/or services; and
                        (c) fits within the context of the linking party&rsquo;s
                        site.
                      </p>
                      <p className="mt-3">
                        We may consider and approve other link requests from
                        the following types of organizations:
                        commonly-known consumer and/or business information
                        sources; dot.com community sites; associations or other
                        groups representing charities; online directory
                        distributors; internet portals; accounting, law and
                        consulting firms; and educational institutions and trade
                        associations.
                      </p>
                      <p className="mt-3">
                        Approved organizations may hyperlink to our Website as
                        follows: by use of our corporate name; or by use of the
                        uniform resource locator being linked to; or by use of
                        any other description of our Website being linked to
                        that makes sense within the context and format of
                        content on the linking party&rsquo;s site. No use of
                        Siraj Tech&rsquo;s logo or other artwork will be allowed
                        for linking absent a trademark license agreement.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="iframes"
                      tabValue="terms"
                      title="iFrames"
                    >
                      <p>
                        Without prior approval and written permission, you may
                        not create frames around our Webpages that alter in any
                        way the visual presentation or appearance of our
                        Website.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="content-liability"
                      tabValue="terms"
                      title="Content Liability"
                    >
                      <p>
                        We shall not be hold responsible for any content that
                        appears on your Website. You agree to protect and defend
                        us against all claims that is rising on your Website. No
                        link(s) should appear on any Website that may be
                        interpreted as libelous, obscene or criminal, or which
                        infringes, otherwise violates, or advocates the
                        infringement or other violation of, any third party
                        rights.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="reservation-rights"
                      tabValue="terms"
                      title="Reservation of Rights"
                    >
                      <p>
                        We reserve the right to request that you remove all
                        links or any particular link to our Website. You approve
                        to immediately remove all links to our Website upon
                        request. We also reserve the right to amen these terms
                        and conditions and it&rsquo;s linking policy at any
                        time. By continuously linking to our Website, you agree
                        to be bound to and follow these linking terms and
                        conditions.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="removal-links"
                      tabValue="terms"
                      title="Removal of Links from Our Website"
                    >
                      <p>
                        If you find any link on our Website that is offensive
                        for any reason, you are free to contact and inform us
                        any moment. We will consider requests to remove links
                        but we are not obligated to or so or to respond to you
                        directly.
                      </p>
                      <p className="mt-3">
                        We do not ensure that the information on this website is
                        correct, we do not warrant its completeness or accuracy;
                        nor do we promise to ensure that the website remains
                        available or that the material on the website is kept up
                        to date.
                      </p>
                    </SectionBlock>

                    <SectionBlock
                      id="disclaimer"
                      tabValue="terms"
                      title="Disclaimer"
                    >
                      <p>
                        To the maximum extent permitted by applicable law, we
                        exclude all representations, warranties and conditions
                        relating to our website and the use of this website.
                        Nothing in this disclaimer will:
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1.5">
                        <li>
                          Limit or exclude our or your liability for death or
                          personal injury
                        </li>
                        <li>
                          Limit or exclude our or your liability for fraud or
                          fraudulent misrepresentation
                        </li>
                        <li>
                          Limit any of our or your liabilities in any way that
                          is not permitted under applicable law
                        </li>
                        <li>
                          Exclude any of our or your liabilities that may not be
                          excluded under applicable law
                        </li>
                      </ul>
                      <p className="mt-3">
                        The limitations and prohibitions of liability set in
                        this Section and elsewhere in this disclaimer: (a) are
                        subject to the preceding paragraph; and (b) govern all
                        liabilities arising under the disclaimer, including
                        liabilities arising in contract, in tort and for breach
                        of statutory duty.
                      </p>
                      <p className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm font-medium text-foreground">
                        As long as the website and the information and services
                        on the website are provided free of charge, we will not
                        be liable for any loss or damage of any nature.
                      </p>
                    </SectionBlock>
                  </div>
                </TabsContent>

                {/* ── Tab: অর্ডার ও ডেলিভারি ── */}
                <TabsContent value="delivery" className="mt-0">
                  <div className="space-y-6">
                    <SectionBlock
                      id="order-method"
                      tabValue="delivery"
                      title="অর্ডার পদ্ধতি"
                    >
                      <ul className="list-inside list-disc space-y-2">
                        <li>ওয়েবসাইট থেকে অর্ডার করতে পারবেন।</li>
                        <li>
                          সরাসরি হোয়াটসঅ্যাপ মেসেঞ্জার বা ফোন করে অর্ডার করতে
                          পারবেন। (এক্ষেত্রে অবশ্যই প্রোডাক্টের বিবরণ উল্লেখ
                          করতে হবে, যেমনঃ কতো গ্যালন, কি রঙের, কত GSM + কোন
                          জেলায় নিবেন।)
                        </li>
                      </ul>
                    </SectionBlock>

                    <SectionBlock
                      id="delivery-method"
                      tabValue="delivery"
                      title="ডেলিভারি পদ্ধতি"
                    >
                      <p className="mb-3 font-medium text-foreground">
                        সাধারণত ২ থেকে ৭ দিনের মধ্যে আমরা ডেলিভারি দিয়ে থাকি।
                        আমাদের ডেলিভারি ৩ ভাবে হয়ে থাকে।
                      </p>
                      <div className="space-y-4">
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                          <h3 className="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
                            <MapPin size={16} className="text-primary" />
                            হোম ডেলিভারি
                          </h3>
                          <p className="text-sm leading-relaxed">
                            প্রত্যন্ত গ্রাম হলে আশেপাশের বাজার গুলোতে দিয়ে
                            আসবে।
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                          <h3 className="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
                            <Truck size={16} className="text-primary" />
                            স্টেড ফাস্ট অফিস ডেলিভারি
                          </h3>
                          <p className="text-sm leading-relaxed">
                            স্টেড ফাস্ট এর অফিস থেকে ডেলিভারি নিতে হবে। অনেকটা
                            সুন্দরবন কুরিয়ারের মত। তবে স্টেড ফাস্ট এর অফিস
                            প্রতিটি থানা পর্যায় রয়েছে। তাদের অফিস গুলোর ঠিকানা
                            জানতে লিঙ্কে ক্লিক করুন ={" "}
                            <a
                              href="#"
                              className="font-medium text-primary hover:underline"
                            >
                              Stead Fast Office Address
                            </a>
                            ।
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                          <h3 className="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
                            <Package size={16} className="text-primary" />
                            সুন্দরবন কুরিয়ার
                          </h3>
                          <p className="text-sm leading-relaxed">
                            সুন্দরবন কুরিয়ারের মাধ্যমে পার্সেল নিতে পারবেন।
                            তবে সুন্দরবন এর এজেন্ট পয়েন্ট গুলো থেকে নিলে পণ্যের
                            মূল্য অগ্রিম পরিশোধ করতে হবে।
                          </p>
                        </div>
                      </div>
                    </SectionBlock>

                    <SectionBlock
                      id="delivery-charge"
                      tabValue="delivery"
                      title="ডেলিভারি চার্জ কত?"
                    >
                      <div className="space-y-4">
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                          <h3 className="mb-1 flex items-center gap-2 text-base font-semibold text-foreground">
                            <MapPin size={16} className="text-primary" />
                            হোম ডেলিভারি
                          </h3>
                          <p className="text-sm leading-relaxed">
                            ১ গ্রাম থেকে ১ কেজি ১২০ টাকা, এর পর প্রতি কেজিতে ১৬
                            টাকা করে যোগ হবে।
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                          <h3 className="mb-1 flex items-center gap-2 text-base font-semibold text-foreground">
                            <Truck size={16} className="text-primary" />
                            স্টেড ফাস্ট অফিস ডেলিভারি
                          </h3>
                          <p className="text-sm leading-relaxed">
                            ১ গ্রাম থেকে ১ কেজি ১০০ টাকা, এর পর প্রতি কেজিতে ১৫
                            টাকা করে যোগ হবে।
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                          <h3 className="mb-1 flex items-center gap-2 text-base font-semibold text-foreground">
                            <Package size={16} className="text-primary" />
                            সুন্দরবন কুরিয়ার
                          </h3>
                          <p className="text-sm leading-relaxed">
                            কুরিয়ার অফিস যে চার্জ লেখবে। সেটি দিয়ে কুরিয়ার
                            অফিস থেকে পার্সেল নিয়ে নিতে হবে। তবে তারা মিনিমাম
                            ১২০ টাকার নিচে চার্জ ধরে না। বড় পার্সেল গুলো
                            সুন্দরবনে নেওয়া ভালো। এবং এর সাথে VD বা COD চার্জ
                            যোগ হবে। সুন্দরবনের এজেন্সি বা অন্য কুরিয়ারে নিলে
                            পণ্যের মূল্য অগ্রিম পরিশোধ করতে হবে।
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm font-medium text-foreground">
                        <strong>বিঃদ্রঃ</strong> – হোম ডেলিভারি ও স্টেড ফাস্ট
                        অফিস ডেলিভারির চেয়ে সুন্দরবন কুরিয়ার চার্জ অনেক কম নিয়ে
                        থাকে।
                      </div>
                    </SectionBlock>

                    <SectionBlock
                      id="return-policy"
                      tabValue="delivery"
                      title="পণ্য পরিবর্তন ও ফেরত"
                    >
                      <div className="space-y-4">
                        <div className="rounded-xl border border-blue-200/60 bg-blue-50/50 p-4">
                          <h3 className="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
                            <RotateCcw size={16} className="text-blue-600" />
                            পরিবর্তন
                          </h3>
                          <p className="text-sm leading-relaxed">
                            কেবলমাত্র ১ থেকে ৩৫ গ্যালন এবং সবজি বেডের মধ্যে
                            রাউন্ড বেড ২৪ &times; ৮″ ও ৩৬ &times; ১০″ পণ্যগুলো
                            পরিবর্তন করা যাবে। এর চেয়ে বড়ো সাইজের ব্যাগ
                            কোনোভাবেই পরিবর্তন করা যাবে না। ছাদ-বাগানের জন্যে
                            এর চেয়ে বড়ো ব্যাগের প্রয়োজন হয়না। ২০০ ও ৩০০ জি এস
                            এম এর ব্যাগ গুলো পরিবর্তন করা যাবে না। উল্লেখ্য
                            যে, ২০০ ও ৩০০ জি এস এম এর ব্যাগ গুলো অনেক পাতলা ও
                            লো কোয়ালিটি হয়ে থাকে।
                          </p>
                        </div>
                        <div className="rounded-xl border border-green-200/60 bg-green-50/50 p-4">
                          <h3 className="mb-1.5 flex items-center gap-2 text-base font-semibold text-foreground">
                            <RotateCcw size={16} className="text-green-600" />
                            ফেরত
                          </h3>
                          <p className="text-sm leading-relaxed">
                            পণ্যের কোনো সমস্যা থাকলে (সেলাই খুলে যাওয়া, ফেটে
                            যাওয়া ইত্যাদি) তা পরিবর্তন করা যাবে বা ফেরত
                            পাঠাতে পারবেন।
                          </p>
                        </div>
                      </div>
                    </SectionBlock>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

        {/* ── Fixed TOC Sidebar (desktop, always visible) ── */}
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
            {activeTab === "terms" ? (
              <TOCSidebar
                sections={termsSections}
                activeSection={activeSection}
                tabValue="terms"
              />
            ) : (
              <TOCSidebar
                sections={deliverySections}
                activeSection={activeSection}
                tabValue="delivery"
              />
            )}
          </div>
        </aside>
      </main>

    </div>
  );
};

export default TermsAndConditions;
