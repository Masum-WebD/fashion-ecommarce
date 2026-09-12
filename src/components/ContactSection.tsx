'use client';

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";
import { extractMapEmbedSrc, submitContactForm } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ContactData {
  title: string;
  address: string;
  landmark: string | null;
  phones: string[];
  email: string;
  call_time: string;
  google_map: string | null;
}

const ContactSection = ({ data }: { data: ContactData | null }) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading("Sending message...");

    try {
      const result = await submitContactForm(form);
      toast.dismiss();
      toast.success(result.message || "Message sent successfully! We'll get back to you soon.");
      setForm({ full_name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data) {
    return (
      <section id="contact" className="section-padding">
        <div className="container-main flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Contact information could not be loaded.</p>
        </div>
      </section>
    );
  }

  const mapSrc = data.google_map ? extractMapEmbedSrc(data.google_map) : null;

  const contactFields = [
    {
      icon: MapPin,
      title: "Office Address",
      content: (
        <div className="space-y-1">
          <p>{data.address}</p>
          {data.landmark && (
            <p className="flex items-center gap-1.5 text-primary/80">
              <Navigation className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {data.landmark}
            </p>
          )}
        </div>
      ),
    },
    {
      icon: Phone,
      title: "Phone",
      content: (
        <ul className="space-y-1">
          {data.phones.map((phone) => (
            <li key={phone}>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-primary"
              >
                {phone}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: Mail,
      title: "Email",
      content: (
        <a
          href={`mailto:${data.email}`}
          className="transition-colors hover:text-primary"
        >
          {data.email}
        </a>
      ),
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: <p>{data.call_time}</p>,
    },
  ];

  return (
    <section id="contact" className="section-padding bg-neutral-50/80">
      <div className="container-main">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12 xl:gap-16">
          {/* Contact Form */}
          <ScrollReveal className="lg:col-span-3" direction="left">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
              <div className="mb-6 sm:mb-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Get in Touch
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  Send us a Message
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Fill out the form below and our team will respond as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {(
                  [
                    { id: "full_name", label: "Full Name", type: "text" },
                    { id: "email", label: "Email Address", type: "email" },
                    { id: "phone", label: "Phone Number", type: "tel" },
                  ] as const
                ).map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      required
                      disabled={isSubmitting}
                      value={form[field.id as keyof typeof form]}
                      onChange={(e) =>
                        setForm({ ...form, [field.id]: e.target.value })
                      }
                      className={cn(
                        "w-full rounded-xl border border-input bg-white px-4 py-3 text-sm text-foreground",
                        "transition-all duration-200 placeholder:text-muted-foreground/60",
                        "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    disabled={isSubmitting}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={cn(
                      "w-full resize-none rounded-xl border border-input bg-white px-4 py-3 text-sm text-foreground",
                      "transition-all duration-200 placeholder:text-muted-foreground/60",
                      "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "btn-gradient-primary flex w-full items-center justify-center gap-2 rounded-xl py-3.5",
                    "text-sm font-semibold text-white transition-all duration-200 sm:text-base",
                    "hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={80}>
              <div className="mb-5 sm:mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {data.title}
                </p>
                <h2 className="mt-2 font-heading text-xl font-bold text-foreground sm:text-2xl">
                  Reach Us Directly
                </h2>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {contactFields.map((item, index) => (
                <ScrollReveal key={item.title} delay={120 + index * 70} direction="right">
                  <div
                    className={cn(
                      "group flex items-start gap-4 rounded-2xl border border-border/50 bg-white p-5",
                      "shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15 sm:h-12 sm:w-12">
                      <item.icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-1 text-sm font-semibold text-foreground sm:text-base">
                        {item.title}
                      </h4>
                      <div className="text-sm leading-relaxed text-muted-foreground">
                        {item.content}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        {mapSrc && (
          <ScrollReveal className="mt-10 sm:mt-12 lg:mt-16" delay={200}>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
              <div className="border-b border-border/50 px-5 py-4 sm:px-6">
                <h3 className="font-semibold text-foreground">Find Us on the Map</h3>
                {data.landmark && (
                  <p className="mt-1 text-sm text-muted-foreground">{data.landmark}</p>
                )}
              </div>
              <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
                <iframe
                  src={mapSrc}
                  title="Siraj Tech Location Map"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
