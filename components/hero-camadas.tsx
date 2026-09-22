"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { CtaButton } from "@/components/motion/cta-button";
import { whatsappUrl } from "@/lib/site";

const spring = { type: "spring" as const, stiffness: 240, damping: 28 };

export function HeroCamadas({
  titulo,
  subtitulo,
  lead,
  imagemSrc,
  imagemAlt,
}: {
  titulo: ReactNode;
  subtitulo: string;
  lead: string;
  imagemSrc?: string | null;
  imagemAlt: string;
}) {
  const reduce = useReducedMotion();

  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: spring },
  };

  return (
    <section className="hero-ed" aria-labelledby="hero-titulo">
      <div className="hero-ed-foto" aria-hidden="true">
        {imagemSrc ? (
          <m.img
            src={imagemSrc}
            alt=""
            initial={reduce ? false : { scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.6, ease: [0.22, 0.61, 0.36, 1] }}
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div className="hero-ed-foto-placeholder" />
        )}
        <div className="hero-ed-foto-veu" />
      </div>

      <m.div
        className="hero-ed-texto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: reduce ? { staggerChildren: 0 } : { staggerChildren: 0.1, delayChildren: 0.25 } },
        }}
      >
        <m.p className="hero-ed-meta" variants={item}>
          <span className="hero-ed-meta-num">Nº 01</span>
          <span className="hero-ed-meta-sep" />
          <span>{subtitulo}</span>
        </m.p>
        <m.h1 id="hero-titulo" className="hero-ed-titulo" variants={item}>
          {titulo}
        </m.h1>
        <m.p className="hero-ed-lead" variants={item}>
          {lead}
        </m.p>
        <m.div className="hero-acoes" variants={item}>
          <CtaButton href="#vitrine" className="botao-primario">
            Ver a vitrine
          </CtaButton>
          <CtaButton href={whatsappUrl()} target="_blank" rel="noopener noreferrer" variant="secundario">
            Falar no WhatsApp
          </CtaButton>
        </m.div>
      </m.div>

      <m.p
        className="hero-ed-legenda"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.1, duration: 0.8 }}
      >
        <span className="hero-ed-legenda-linha" />
        {imagemAlt}
      </m.p>
    </section>
  );
}
