"use client";

import { useEffect, useRef, useState } from "react";

/** Abertura da home: vídeo → cartaz em tela cheia → clique revela a loja. */
type Fase = "video" | "cartaz" | "saindo" | "fim";

const FADE_MS = 900;

export function Abertura() {
  const [fase, setFase] = useState<Fase>("video");
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (fase === "fim") return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [fase]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFase("cartaz");
      return;
    }
    video.current?.play().catch(() => setFase("cartaz"));
  }, []);

  useEffect(() => {
    if (fase !== "saindo") return;
    const t = setTimeout(() => setFase("fim"), FADE_MS);
    return () => clearTimeout(t);
  }, [fase]);

  if (fase === "fim") return null;

  const entrar = () => setFase("saindo");

  return (
    <div className={`abertura abertura--${fase}`}>
      {fase !== "saindo" && (
        <video
          ref={video}
          className="abertura-video"
          src="/costa-castro-banner-intro.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={() => setFase("cartaz")}
          onError={() => setFase("cartaz")}
          aria-hidden="true"
        />
      )}
      <button type="button" className="abertura-cartaz" onClick={entrar} aria-label="Entrar na loja">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/costa-castro-banner-intro.png" alt="Costa Castro — cama, mesa e banho" />
        <span className="abertura-dica">Toque para entrar</span>
      </button>
      {fase === "video" && (
        <button type="button" className="abertura-pular" onClick={() => setFase("cartaz")}>
          Pular
        </button>
      )}
    </div>
  );
}
