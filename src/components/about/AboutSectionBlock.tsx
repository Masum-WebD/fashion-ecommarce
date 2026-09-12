import { AboutSection, getAboutSectionImageUrl } from "@/lib/api";
import ScrollReveal from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";

interface AboutSectionBlockProps {
  section: AboutSection;
  index: number;
}



/** Small corner stitch mark used to accent the photo frame. */
const StitchCorner = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true">
    <path
      d="M12 2v7M12 22v-7M2 12h7M22 12h-7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/** "আমাদের কথা" rendered as a cloth swing-tag, not a generic pill. */
const EyebrowTag = () => (
  <span className="relative -rotate-2 inline-flex items-center gap-2 border border-dashed border-[#2F6B4F]/50 bg-[#F3FAF5] px-4 py-1.5 text-xs font-bold tracking-widest text-[#1F5B3F]">
    <span className="h-1.5 w-1.5 rounded-full border border-[#2F6B4F]/60 bg-[#F3FAF5]" />
    আমাদের কথা
  </span>
);

const AboutSectionBlock = ({ section, index }: AboutSectionBlockProps) => {
  const imageUrl = getAboutSectionImageUrl(section);
  const isImageRight = index % 2 === 0;
  const isAltBg = index % 2 !== 0;

  const paragraphs = (section.description || "")
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // ===== NO IMAGE: Full-width clean card =====
  if (!imageUrl) {
    return (
      <section className={cn("py-12 sm:py-16", isAltBg ? "bg-[#EFF7F1]" : "bg-[#FBFDFB]")}>
        <div className="container-main max-w-3xl px-4">
          <ScrollReveal direction="up">
            <div className="relative rounded-xl border border-[#D9EBE0] bg-white px-8 py-10 shadow-[0_14px_36px_-18px_rgba(15,61,46,0.28)] sm:px-12">
              {/* Soft glow accent */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#DCEFE2] blur-2xl" />

              {/* Swing tag, overlapping the card edge */}
              <div className="absolute -top-4 left-8">
                <EyebrowTag />
              </div>

              <div className="relative mt-3">
                <h2 className="mb-3 text-xl font-extrabold leading-tight text-[#0F3D2E] sm:text-2xl md:text-3xl">
                  {section.title}
                </h2>
              </div>

              {/* Text */}
              <div className="relative space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base text-justify">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-4 select-none text-6xl text-[#2F6B4F]/15"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &rdquo;
                </span>
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    );
  }

  // ===== WITH IMAGE: Two-column layout =====
  return (
    <section className={cn("py-12 sm:py-16 md:py-20 overflow-hidden", isAltBg ? "bg-[#EFF7F1]" : "bg-[#FBFDFB]")}>
      <div className="container-main max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* ---- TEXT ---- */}
          <div className={cn("flex flex-col justify-center", isImageRight ? "md:order-1" : "md:order-2")}>
            <ScrollReveal direction={isImageRight ? "left" : "right"}>
              <EyebrowTag />

              <h2 className="mb-4 mt-5 text-2xl font-extrabold leading-tight text-[#0F3D2E] sm:text-3xl">
                {section.title}
              </h2>

              {/* Paragraphs */}
              <div className="relative space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base text-justify">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 -top-5 select-none text-6xl text-[#2F6B4F]/15"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &rdquo;
                </span>
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* ---- IMAGE ---- */}
          <div className={cn("flex justify-center", isImageRight ? "md:order-2" : "md:order-1")}>
            <ScrollReveal
              direction={isImageRight ? "right" : "left"}
              className="relative w-full max-w-md"
            >
              {/* Soft green glow behind the frame */}
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#DCEFE2] via-transparent to-transparent blur-xl" />

              {/* Stitched double-border frame */}
              <div className="relative rounded-2xl border-2 border-dashed border-[#2F6B4F]/45 bg-white p-2.5">
                <div className="overflow-hidden rounded-xl border border-[#0F3D2E]/10 shadow-[0_18px_44px_-18px_rgba(15,61,46,0.4)]">
                  <img
                    src={imageUrl}
                    alt={section.title}
                    className="h-auto w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                {/* Corner stitch marks */}
                <StitchCorner className="absolute -top-2.5 -left-2.5 text-[#1F5B3F]" />
                <StitchCorner className="absolute -bottom-2.5 -right-2.5 text-[#1F5B3F]" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionBlock;