import { Metadata } from 'next';
import BrandPartnersSection from "@/components/BrandPartnersSection";
import AboutIntro from "@/components/about/AboutIntro";
import AboutSectionBlock from "@/components/about/AboutSectionBlock";
import { fetchAboutUs, getActiveAboutSections } from "@/lib/api";
import { parseAboutIntro } from "@/lib/parseAboutContent";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Siraj Tech",
  alternates: {
    canonical: "/about",
  }
};

export const revalidate = 60; // Revalidate every minute

export default async function AboutPage() {
  try {
    const data = await fetchAboutUs();
    
    if (!data?.page) {
      throw new Error("Content not found");
    }

    const sections = getActiveAboutSections(data.sections ?? []);
    const introContent = parseAboutIntro(data.page.short_description, data.page.long_description);

    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow bg-white">
          {introContent && (
            <AboutIntro pageTitle={data.page.title} content={introContent} />
          )}

          {sections.length > 0 && (
            <div className="divide-y divide-border/40">
              {sections.map((section, index) => (
                <AboutSectionBlock key={section.id} section={section} index={index} />
              ))}
            </div>
          )}

          <BrandPartnersSection />
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow bg-white">
          <div className="container-main flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-muted-foreground">About page content could not be loaded.</p>
          </div>
        </main>
      </div>
    );
  }
}
