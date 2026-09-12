const logo = "/assets/logo.png";
import { ParsedAboutIntro } from "@/lib/parseAboutContent";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Building2,
  Factory,
  Leaf,
  PenTool,
  Ruler,
  Warehouse,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_ICONS = [Building2, Factory, Leaf, Warehouse, Ruler, PenTool];

interface AboutIntroProps {
  pageTitle: string;
  content: ParsedAboutIntro;
}

const AboutIntro = ({ pageTitle, content }: AboutIntroProps) => {
  const { companyName, tagline, intro, services } = content;

  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <section className="relative bg-white border-b border-slate-100 py-8 sm:py-20">
        {/* Top accent bar */}
       

        <div className="container-main max-w-4xl text-center">
          <ScrollReveal direction="up">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src={logo}
                alt="Siraj Tech"
                className="h-16 w-auto sm:h-20 object-contain"
              />
            </div>

            {/* Page Title */}
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {pageTitle}
            </h1>

            {/* Company Name */}
            {companyName && (
              <p className="mt-2 text-lg font-semibold text-primary sm:text-xl">
                {companyName}
              </p>
            )}

            {/* Divider */}
            <div className="mx-auto mt-5 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-slate-200" />
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-px w-16 bg-slate-200" />
            </div>

            {/* Tagline pill */}
            {tagline && (
              <div className="mt-5 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f99b1c]/10 px-5 py-2 text-sm font-bold text-[#f99b1c] ring-1 ring-[#f99b1c]/20 sm:text-base">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {tagline}
                </span>
              </div>
            )}

            {/* Intro paragraph */}
            {intro && (
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
                {intro}
              </p>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* ===== SERVICES GRID ===== */}
      {services.length > 0 && (
        <section className="bg-[hsl(var(--section-alt))] py-14 sm:py-20">
          <div className="container-main max-w-6xl">
            {/* Section header */}
            <ScrollReveal direction="up">
              <div className="mb-10 text-center">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  আমাদের সেবা
                </span>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  আমাদের সার্ভিস সমূহ
                </h2>
                <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary" />
              </div>
            </ScrollReveal>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {services.map((service, index) => {
                const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
                return (
                  <ScrollReveal key={service} delay={80 + index * 70} direction="up">
                    <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
                      {/* Icon */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      {/* Text */}
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-semibold leading-snug text-slate-800 sm:text-base">
                          {service}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AboutIntro;
