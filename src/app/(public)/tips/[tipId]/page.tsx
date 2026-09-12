import { Metadata } from 'next';
import TipDetailClient from './TipDetailClient';
import { tips, civilTips, decorTips } from "@/data/tips";

export function generateMetadata({ params }: { params: { tipId: string } }): Metadata {
  const allTipsContent = [...tips, ...civilTips, ...decorTips];
  const tip = allTipsContent.find(t => t.id === params.tipId);
  return {
    title: tip ? `${tip.title} | Siraj Tech Tips` : "Tip | Siraj Tech",
    description: tip ? tip.excerpt : "Tip details",
  };
}

export default function TipDetailPage() {
  return <TipDetailClient />;
}
