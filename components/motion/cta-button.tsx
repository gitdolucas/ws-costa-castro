"use client";

import { m, useReducedMotion } from "framer-motion";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primario" | "secundario";
  target?: string;
  rel?: string;
};

export function CtaButton({ className = "", variant = "primario", children, href, target, rel }: Props) {
  const reduce = useReducedMotion();
  const base = `botao botao-${variant === "primario" ? "primario" : "secundario"} ${className}`.trim();

  if (reduce) {
    return (
      <a className={base} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <m.a
      className={base}
      href={href}
      target={target}
      rel={rel}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {children}
    </m.a>
  );
}
