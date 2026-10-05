"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Step = { title: string; description: string };

/** Ordered steps joined by a line that fills in as the section scrolls into view. */
export function JourneyTimeline({ steps }: { steps: readonly Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative grid gap-10 md:grid-cols-4 md:gap-8">
      <span
        aria-hidden="true"
        className="absolute left-[0.6875rem] top-3 h-[calc(100%-1.5rem)] w-px bg-line md:left-0 md:top-[0.6875rem] md:h-px md:w-full"
      />
      <motion.span
        aria-hidden="true"
        className="absolute left-[0.6875rem] top-3 hidden h-px w-full origin-left bg-accent md:left-0 md:top-[0.6875rem] md:block"
        style={reduce ? undefined : { scaleX: progress }}
      />
      {steps.map((step, index) => (
        <li key={step.title} className="relative pl-10 md:pl-0 md:pt-10">
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 grid size-[1.375rem] place-items-center rounded-full border border-accent bg-bg font-mono text-[0.6875rem] font-medium text-accent-ink"
          >
            {index + 1}
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-ink">{step.title}</h3>
          <p className="mt-2 leading-relaxed text-ink-soft">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
