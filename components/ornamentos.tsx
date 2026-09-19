/**
 * Ornamentos botânicos em traço fino. Desenho nosso, não imagem da marca.
 * Traço herda currentColor; `desenhar` anima o traço uma vez (hero).
 */

export function Ramo({ className, desenhar = false }: { className?: string; desenhar?: boolean }) {
  return (
    <svg
      viewBox="0 0 320 420"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className ?? ""} ${desenhar ? "ramo-desenha" : ""}`}
      aria-hidden="true"
    >
      <path pathLength={1} d="M160 410 C 158 330, 150 250, 176 170 S 214 60, 196 12" />
      <path pathLength={1} d="M166 330 C 120 318, 84 290, 62 250 C 104 252, 142 282, 166 330 Z" />
      <path pathLength={1} d="M161 290 C 204 272, 238 238, 258 196 C 214 202, 180 236, 161 290 Z" />
      <path pathLength={1} d="M170 226 C 128 206, 104 172, 96 132 C 136 144, 162 178, 170 226 Z" />
      <path pathLength={1} d="M178 170 C 218 150, 240 118, 248 82 C 212 94, 186 124, 178 170 Z" />
      <path pathLength={1} d="M190 96 C 164 80, 152 56, 152 30 C 176 44, 190 68, 190 96 Z" />
      <path pathLength={1} d="M66 250 C 110 270, 140 296, 162 326" />
      <path pathLength={1} d="M256 198 C 214 222, 184 254, 164 288" />
      <path pathLength={1} d="M98 134 C 132 162, 156 192, 170 224" />
      <path pathLength={1} d="M246 84 C 214 108, 192 136, 180 168" />
      {/* pássaro pequeno, pousado */}
      <path pathLength={1} d="M236 300 c 10 -8, 24 -8, 32 0 c -6 2, -10 6, -12 12 c -8 -2, -14 -6, -20 -12 Z" />
      <path pathLength={1} d="M268 300 l 12 -4 l -8 8" />
      <path pathLength={1} d="M246 312 l -2 14 M254 312 l 0 14" />
    </svg>
  );
}

export function Folha({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden="true">
      <path d="M8 52 C 10 28, 26 10, 52 8 C 50 32, 34 50, 8 52 Z" />
      <path d="M8 52 C 22 38, 34 24, 48 12" />
    </svg>
  );
}
