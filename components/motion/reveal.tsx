"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const spring = { type: "spring" as const, stiffness: 320, damping: 28 };

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={reduce ? { duration: 0 } : { ...spring, delay }}
    >
      {children}
    </m.div>
  );
}

export function RevealStagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      variants={{
        hidden: {},
        visible: {
          transition: reduce ? { staggerChildren: 0 } : { staggerChildren: 0.08, delayChildren: 0.05 },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <m.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: spring },
      }}
    >
      {children}
    </m.div>
  );
}
