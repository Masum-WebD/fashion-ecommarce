'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import ContactActionButtons from '@/components/shop/ContactActionButtons';
import { cn } from '@/lib/utils';

interface ProductDescriptionToggleProps {
  productName: string;
  description: string | null;
  shortDescription: string | null;
}

const ProductDescriptionToggle = ({
  productName,
  description,
  shortDescription,
}: ProductDescriptionToggleProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-12 md:mb-16 mt-8 rounded-2xl border border-border/60 bg-white shadow-xs overflow-hidden transition-all duration-300 hover:border-primary/30">
      {/* Toggle Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors duration-200 select-none",
          isOpen ? "bg-primary/[0.03] border-b border-border/40" : "hover:bg-muted/40"
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 shrink-0",
            isOpen ? "bg-primary text-white shadow-sm" : "bg-primary/10 text-primary"
          )}>
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
              Product Description
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              {isOpen ? "Click to collapse details" : "Click to view full product details & specifications"}
            </p>
          </div>
        </div>

        {/* Animated Chevron Indicator */}
        <div className={cn(
          "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300 shrink-0",
          isOpen ? "bg-primary/10 text-primary rotate-180" : "bg-muted text-muted-foreground hover:text-foreground"
        )}>
          <ChevronDown size={18} className="transition-transform duration-300" />
        </div>
      </button>

      {/* Expandable Content Panel */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-5 md:p-8 pt-4 md:pt-6">
            <div className="prose max-w-none text-editor-content">
              {description ? (
                <div
                  className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <div className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                  <p>{shortDescription || 'No description available.'}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border/40 mt-6">
              <ContactActionButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionToggle;
