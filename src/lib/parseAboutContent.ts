const SERVICES_HEADING = "আমাদের সার্ভিস সমুহঃ";

export interface ParsedAboutIntro {
  companyName: string;
  tagline: string;
  intro: string;
  services: string[];
}

export function parseShortDescription(shortDescription: string): {
  companyName: string;
  tagline: string;
} {
  const lines = (shortDescription || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return { companyName: "সিরাজ টেক লিমিটেড", tagline: lines[0] ?? shortDescription ?? "" };
  }

  return {
    companyName: lines[0],
    tagline: lines.slice(1).join(" "),
  };
}

export function parseLongDescription(html: string): { intro: string; services: string[] } {
  if (!html?.trim()) {
    return { intro: "", services: [] };
  }

  // Strip HTML tags to get plain text (server-safe)
  const plain = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain.includes(SERVICES_HEADING)) {
    return { intro: plain, services: [] };
  }

  const [introPart, servicesPart] = plain.split(SERVICES_HEADING);
  const intro = introPart.trim();

  const services = servicesPart
    .split(/[।\n\r]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 3);

  return { intro, services };
}

export function parseAboutIntro(
  shortDescription: string,
  longDescription: string
): ParsedAboutIntro {
  const { companyName, tagline } = parseShortDescription(shortDescription);
  const { intro, services } = parseLongDescription(longDescription);

  return { companyName, tagline, intro, services };
}


