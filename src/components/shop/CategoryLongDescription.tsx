'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryLongDescriptionProps {
  categoryName?: string;
  shortDescription?: string;
  longDescription?: string;
  className?: string;
}

export default function CategoryLongDescription({
  categoryName,
  shortDescription,
  longDescription,
  className,
}: CategoryLongDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!longDescription && !shortDescription) {
    return null;
  }

  // Check if content is lengthy to show expand/collapse button
  const isLongContent = longDescription && longDescription.length > 500;

  return (
    <div
      className={cn(
        'w-full bg-white border border-border/60 rounded-2xl shadow-sm p-5 sm:p-8 md:p-10 mt-8 sm:mt-12 transition-all duration-300',
        className
      )}
    >
      {/* Category Short Description Banner (if present) */}
      {shortDescription && (
        <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-3">
          <Info size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            {shortDescription}
          </p>
        </div>
      )}

      {/* Category Long Description Header */}
      {longDescription && (
        <div>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border/50">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                About {categoryName || 'This Category'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Detailed information and buying guide
              </p>
            </div>
          </div>

          {/* Long Description Body */}
          <div className="relative">
            <div
              className={cn(
                'prose prose-slate max-w-none transition-all duration-300',
                'prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-6 prose-headings:mb-3',
                'prose-h1:text-xl sm:prose-h1:text-2xl prose-h2:text-lg sm:prose-h2:text-xl prose-h3:text-base sm:prose-h3:text-lg',
                'prose-p:text-sm sm:prose-p:text-base prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4',
                'prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-li:text-sm sm:prose-li:text-base prose-li:text-slate-700 prose-li:mb-1',
                'prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4',
                'prose-a:text-primary prose-a:font-semibold prose-a:underline hover:prose-a:text-primary/80',
                'prose-strong:font-bold prose-strong:text-slate-900',
                'prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600',
                !isExpanded && isLongContent
                  ? 'max-h-[300px] overflow-hidden'
                  : 'max-h-none'
              )}
              dangerouslySetInnerHTML={{ __html: longDescription }}
            />

            {/* Gradient Overlay when collapsed */}
            {!isExpanded && isLongContent && (
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            )}
          </div>

          {/* Expand/Collapse Button */}
          {isLongContent && (
            <div className="mt-4 pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-200 shadow-xs border border-primary/20"
              >
                {isExpanded ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
