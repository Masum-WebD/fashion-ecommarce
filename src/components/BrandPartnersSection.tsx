import { socialLinks } from "@/lib/socialLinks";

const BrandPartnersSection = () => (
  <section className="section-padding bg-section-alt">
    <div className="container-main max-w-3xl mx-auto text-center space-y-6">
      <p className="text-base md:text-lg text-foreground leading-relaxed font-body">
        পরিশেষে, আমাদের উদ্দেশ্য হল Indoor, Outdoor এবং ছাদের স্থানগুলির প্রাকৃতিক সৌন্দর্য
        বৃদ্ধি করা। আমরা দৃঢ়ভাবে বিশ্বাস করি যে, পরিবেশ বাঁচলে মানুষ বাঁচবে, আর মানুষ
        বাঁচলেই দেশ বাঁচবে।
      </p>

      <div className="flex items-center justify-center gap-1">
        {socialLinks.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-secondary/60 transition-colors"
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default BrandPartnersSection;
