"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

/** Content stays visible without JavaScript; each section reveals only once. */
export function RevealSection(props: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion.matches) {
          animation = element.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 550, easing: "cubic-bezier(.22, 1, .36, 1)" },
          );
        }
        observer.disconnect();
      },
      { threshold: 0.08 },
    );
    const stopMotion = () => {
      if (reducedMotion.matches) animation?.cancel();
    };
    reducedMotion.addEventListener("change", stopMotion);
    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
      reducedMotion.removeEventListener("change", stopMotion);
    };
  }, []);
  return <section ref={ref} {...props} />;
}
