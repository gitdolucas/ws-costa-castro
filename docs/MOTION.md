# Motion — Costa Castro

- Provider: `components/motion/motion-provider.tsx` (`LazyMotion` + `domAnimation`).
- Reveal on scroll: `Reveal`, `RevealStagger`, `RevealItem` — respeitam `prefers-reduced-motion`.
- CTAs: `CtaButton` — hover/tap spring leve.
- Hero: única sequência de entrada em `HeroCamadas` — foto `scale 1.06→1` (1.6s) + stagger do texto (0.1s).
- Faixa (`FaixaPalavras`): marquee CSS-only, 38s linear, `animation: none` sob reduced-motion.
- Capítulos/feed: hover `translateY(-4px)`; etiqueta gira levemente. Sem hover sob reduced-motion.
- Abertura em vídeo (`SecaoCinematografica`): fora da home v1; ligar só com aprovação.
- Não animar `width`, `height`, `top`, `left`.
