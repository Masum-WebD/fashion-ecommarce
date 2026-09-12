'use client';

import { useState, useEffect, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  ChevronRight,
  FileText,
  Cookie,
  Server,
  Users,
  Eye,
  BarChart3,
  Lock,
  Baby,
  Scale,
} from "lucide-react";

// ─── TOC Items ───────────────────────────────────────────────────────

const privacySections = [
  { id: "introduction", label: "Introduction", icon: ShieldCheck },
  { id: "consent", label: "Consent", icon: FileText },
  { id: "info-collect", label: "Information We Collect", icon: Users },
  { id: "info-use", label: "How We Use Your Info", icon: BarChart3 },
  { id: "log-files", label: "Log Files", icon: Server },
  { id: "cookies", label: "Cookies & Web Beacons", icon: Cookie },
  { id: "advertising", label: "Advertising Partners", icon: Eye },
  { id: "third-party", label: "Third Party Policies", icon: Lock },
  { id: "ccpa", label: "CCPA Privacy Rights", icon: Scale },
  { id: "gdpr", label: "GDPR Data Rights", icon: ShieldCheck },
  { id: "children", label: "Children's Info", icon: Baby },
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
  <section id={`${tabValue}-${id}`} className="scroll-mt-28">
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

const PrivacyPolicy = () => {
  const privacyIds = privacySections.map((s) => s.id);
  const activeSection = useActiveSection(privacyIds, "privacy");
  const tocScrollRef = useRef<HTMLDivElement>(null);

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
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />

          <div className="container-main relative z-10">
            <ScrollReveal direction="up">
              <div className="mx-auto max-w-3xl text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                  <ShieldCheck size={12} />
                  Privacy Policy
                </span>
                <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  Privacy Policy
                </h1>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                  Learn how Siraj Tech collects, uses, and protects your
                  personal information when you visit our website.
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
              {privacySections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  data-section-id={id}
                  onClick={() => {
                    const el = document.getElementById(`privacy-${id}`);
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
              ))}
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="container-main py-10 sm:py-12 md:py-16 pt-14 sm:pt-14 md:pt-16">
          <div className="min-w-0 lg:pr-[280px]">
            <div className="space-y-6">
              <SectionBlock
                id="introduction"
                tabValue="privacy"
                title="Privacy Policy for Siraj Tech"
              >
                <p>
                  At Siraj Tech, accessible from{" "}
                  <a
                    href="https://sirajtech.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    https://sirajtech.org
                  </a>
                  , one of our main priorities is the privacy of our visitors.
                  This Privacy Policy document contains types of information that
                  is collected and recorded by Siraj Tech and how we use it.
                </p>
                <p className="mt-3">
                  If you have additional questions or require more information
                  about our Privacy Policy, do not hesitate to contact us.
                </p>
                <p className="mt-3">
                  This Privacy Policy applies only to our online activities and is
                  valid for visitors to our website with regards to the information
                  that they shared and/or collect in Siraj Tech. This policy is not
                  applicable to any information collected offline or via channels
                  other than this website.
                </p>
              </SectionBlock>

              <SectionBlock
                id="consent"
                tabValue="privacy"
                title="Consent"
              >
                <p>
                  By using our website, you hereby consent to our Privacy Policy
                  and agree to its terms. For our{" "}
                  <a
                    href="/terms"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms and Conditions
                  </a>
                  .
                </p>
              </SectionBlock>

              <SectionBlock
                id="info-collect"
                tabValue="privacy"
                title="Information We Collect"
              >
                <p>
                  The personal information that you are asked to provide, and the
                  reasons why you are asked to provide it, will be made clear to
                  you at the point we ask you to provide your personal information.
                </p>
                <p className="mt-3">
                  If you contact us directly, we may receive additional information
                  about you such as your name, email address, phone number, the
                  contents of the message and/or attachments you may send us, and
                  any other information you may choose to provide.
                </p>
                <p className="mt-3">
                  When you register for an Account, we may ask for your contact
                  information, including items such as name, company name, address,
                  email address, and telephone number.
                </p>
              </SectionBlock>

              <SectionBlock
                id="info-use"
                tabValue="privacy"
                title="How We Use Your Information"
              >
                <p>
                  We use the information we collect in various ways, including to:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1.5">
                  <li>Provide, operate, and maintain our website</li>
                  <li>Improve, personalize, and expand our website</li>
                  <li>Understand and analyze how you use our website</li>
                  <li>
                    Develop new products, services, features, and functionality
                  </li>
                  <li>
                    Communicate with you, either directly or through one of our
                    partners, including for customer service, to provide you with
                    updates and other information relating to the website, and for
                    marketing and promotional purposes
                  </li>
                  <li>Send you emails</li>
                  <li>Find and prevent fraud</li>
                </ul>
              </SectionBlock>

              <SectionBlock
                id="log-files"
                tabValue="privacy"
                title="Log Files"
              >
                <p>
                  Siraj Tech follows a standard procedure of using log files. These
                  files log visitors when they visit websites. All hosting companies
                  do this and a part of hosting services&rsquo; analytics. The
                  information collected by log files include internet protocol (IP)
                  addresses, browser type, Internet Service Provider (ISP), date and
                  time stamp, referring/exit pages, and possibly the number of
                  clicks. These are not linked to any information that is personally
                  identifiable. The purpose of the information is for analyzing
                  trends, administering the site, tracking users&rsquo; movement on
                  the website, and gathering demographic information.
                </p>
              </SectionBlock>

              <SectionBlock
                id="cookies"
                tabValue="privacy"
                title="Cookies and Web Beacons"
              >
                <p>
                  Like any other website, Siraj Tech uses &lsquo;cookies&rsquo;.
                  These cookies are used to store information including
                  visitors&rsquo; preferences, and the pages on the website that
                  the visitor accessed or visited. The information is used to
                  optimize the users&rsquo; experience by customizing our web page
                  content based on visitors&rsquo; browser type and/or other
                  information.
                </p>
                <p className="mt-3">
                  For more general information on cookies, please read &ldquo;What
                  Are Cookies&rdquo;.
                </p>
              </SectionBlock>

              <SectionBlock
                id="advertising"
                tabValue="privacy"
                title="Advertising Partners Privacy Policies"
              >
                <p>
                  You may consult this list to find the Privacy Policy for each of
                  the advertising partners of Siraj Tech.
                </p>
                <p className="mt-3">
                  Third-party ad servers or ad networks uses technologies like
                  cookies, JavaScript, or Web Beacons that are used in their
                  respective advertisements and links that appear on Siraj Tech,
                  which are sent directly to users&rsquo; browser. They automatically
                  receive your IP address when this occurs. These technologies are
                  used to measure the effectiveness of their advertising campaigns
                  and/or to personalize the advertising content that you see on
                  websites that you visit.
                </p>
                <p className="mt-3">
                  Note that Siraj Tech has no access to or control over these
                  cookies that are used by third-party advertisers.
                </p>
              </SectionBlock>

              <SectionBlock
                id="third-party"
                tabValue="privacy"
                title="Third Party Privacy Policies"
              >
                <p>
                  Siraj Tech&rsquo;s Privacy Policy does not apply to other
                  advertisers or websites. Thus, we are advising you to consult the
                  respective Privacy Policies of these third-party ad servers for
                  more detailed information. It may include their practices and
                  instructions about how to opt-out of certain options.
                </p>
                <p className="mt-3">
                  You can choose to disable cookies through your individual browser
                  options. To know more detailed information about cookie management
                  with specific web browsers, it can be found at the browsers&rsquo;
                  respective websites.
                </p>
              </SectionBlock>

              <SectionBlock
                id="ccpa"
                tabValue="privacy"
                title="CCPA Privacy Rights (Do Not Sell My Personal Information)"
              >
                <p>
                  Under the CCPA, among other rights, California consumers have the
                  right to:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1.5">
                  <li>
                    Request that a business that collects a consumer&rsquo;s
                    personal data disclose the categories and specific pieces of
                    personal data that a business has collected about consumers.
                  </li>
                  <li>
                    Request that a business delete any personal data about the
                    consumer that a business has collected.
                  </li>
                  <li>
                    Request that a business that sells a consumer&rsquo;s personal
                    data, not sell the consumer&rsquo;s personal data.
                  </li>
                </ul>
                <p className="mt-3">
                  If you make a request, we have one month to respond to you. If
                  you would like to exercise any of these rights, please contact
                  us.
                </p>
              </SectionBlock>

              <SectionBlock
                id="gdpr"
                tabValue="privacy"
                title="GDPR Data Protection Rights"
              >
                <p>
                  We would like to make sure you are fully aware of all of your
                  data protection rights. Every user is entitled to the following:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1.5">
                  <li>
                    <strong>The right to access</strong> &ndash; You have the right
                    to request copies of your personal data. We may charge you a
                    small fee for this service.
                  </li>
                  <li>
                    <strong>The right to rectification</strong> &ndash; You have
                    the right to request that we correct any information you
                    believe is inaccurate. You also have the right to request that
                    we complete the information you believe is incomplete.
                  </li>
                  <li>
                    <strong>The right to erasure</strong> &ndash; You have the
                    right to request that we erase your personal data, under
                    certain conditions.
                  </li>
                  <li>
                    <strong>The right to restrict processing</strong> &ndash; You
                    have the right to request that we restrict the processing of
                    your personal data, under certain conditions.
                  </li>
                  <li>
                    <strong>The right to object to processing</strong> &ndash; You
                    have the right to object to our processing of your personal
                    data, under certain conditions.
                  </li>
                  <li>
                    <strong>The right to data portability</strong> &ndash; You have
                    the right to request that we transfer the data that we have
                    collected to another organization, or directly to you, under
                    certain conditions.
                  </li>
                </ul>
                <p className="mt-3">
                  If you make a request, we have one month to respond to you. If
                  you would like to exercise any of these rights, please contact
                  us.
                </p>
              </SectionBlock>

              <SectionBlock
                id="children"
                tabValue="privacy"
                title="Children's Information"
              >
                <p>
                  Another part of our priority is adding protection for children
                  while using the internet. We encourage parents and guardians to
                  observe, participate in, and/or monitor and guide their online
                  activity.
                </p>
                <p className="mt-3">
                  Siraj Tech does not knowingly collect any Personal Identifiable
                  Information from children under the age of 13. If you think that
                  your child provided this kind of information on our website, we
                  strongly encourage you to contact us immediately and we will do
                  our best efforts to promptly remove such information from our
                  records.
                </p>
              </SectionBlock>
            </div>
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
              sections={privacySections}
              activeSection={activeSection}
              tabValue="privacy"
            />
          </div>
        </aside>
      </main>

    </div>
  );
};

export default PrivacyPolicy;
