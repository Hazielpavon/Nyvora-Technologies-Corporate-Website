"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

/** Framed brand visual with a slow parallax drift that tracks page scroll. */
export function HeroVisual() {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div
      ref={frameRef}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#050b14] shadow-[0_24px_48px_-28px_hsl(var(--shadow)/0.45)] ring-1 ring-line md:aspect-[5/6] lg:aspect-[4/5]"
    >
      <motion.div className="absolute -inset-y-[8%] inset-x-0" style={reduce ? undefined : { y }}>
        <Image
          src="/brand/hero-signal.webp"
          alt="Trazo de luz azul que asciende entre planos de cristal, imagen de la identidad de Nyvora."
          fill
          preload
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-cover object-[30%_50%]"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
      />
    </div>
  );
}
