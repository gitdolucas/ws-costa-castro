"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { ABERTURA_FINALE_SECONDS } from "@/lib/content/abertura-cinematografica";

/** Abertura em vídeo (full viewport). Não usada na home v1 — plugar abaixo da hero quando aprovada. */
export function SecaoCinematografica({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lockedRef = useRef(false);
  const [finale, setFinale] = useState(0);
  const [locked, setLocked] = useState(false);

  const lockFinalFrame = useCallback(() => {
    if (lockedRef.current) return;
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.max(0, v.duration - 0.04);
    v.pause();
    lockedRef.current = true;
    setFinale(1);
    setLocked(true);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onLoaded = () => {
      if (lockedRef.current) return;
      if (reduce) {
        lockFinalFrame();
        return;
      }
      void v.play().catch(() => lockFinalFrame());
    };

    const onTimeUpdate = () => {
      if (lockedRef.current || !Number.isFinite(v.duration)) return;
      const start = Math.max(0, v.duration - ABERTURA_FINALE_SECONDS);
      if (v.currentTime >= v.duration - 0.06) {
        lockFinalFrame();
        return;
      }
      if (v.currentTime >= start) {
        setFinale(Math.min(1, (v.currentTime - start) / ABERTURA_FINALE_SECONDS));
      }
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("ended", lockFinalFrame);
    if (v.readyState >= 1) onLoaded();

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("ended", lockFinalFrame);
    };
  }, [lockFinalFrame]);

  return (
    <section
      className={`secao-cinematografica${locked ? " secao-cinematografica--locked" : ""}`}
      aria-hidden="true"
      style={{ ["--abertura-finale"]: finale } as CSSProperties}
    >
      <div className="secao-cinematografica-video-wrap">
        <video ref={videoRef} className="secao-cinematografica-video" src={videoSrc} muted playsInline preload="auto" />
      </div>
      <div className="secao-cinematografica-finale-white" />
      <div className="secao-cinematografica-finale-wash" />
    </section>
  );
}
