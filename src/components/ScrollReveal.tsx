'use client';

import { ReactNode } from "react";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
}

const hiddenTransform: Record<RevealDirection, string> = {
  up: "translateY(28px)",
  left: "translateX(-32px)",
  right: "translateX(32px)",
  none: "none",
};

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollFadeIn(0.12);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : hiddenTransform[direction],
        transition: `opacity 0.65s ease-out ${delay}ms, transform 0.65s ease-out ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
