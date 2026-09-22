"use client";

import { MediaFrame } from "@/components/media-frame";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal";
import type { PostInstagram } from "@/lib/content/instagram";
import { INSTAGRAM_URL } from "@/lib/site";

export function SecaoInstagramClient({ posts }: { posts: PostInstagram[] }) {
  return (
    <section className="secao secao-instagram" aria-labelledby="titulo-instagram">
      <Reveal>
        <header className="secao-cabeca secao-cabeca--linha">
          <p className="rotulo">Do atelier ao feed</p>
          <h2 id="titulo-instagram">
            Três <em>publicações</em> recentes
          </h2>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-forte secao-cabeca-acao">
            @costacastroloja ↗
          </a>
        </header>
      </Reveal>
      <RevealStagger className="feed">
        {posts.map((post, i) => (
          <RevealItem key={post.id} className={`feed-item feed-item--${i + 1}`}>
            <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="feed-cartao">
              <span className="feed-moldura">
                <MediaFrame blobImage={post.blobImage} alt={post.excerpt} className="feed-foto" />
              </span>
              <span className="feed-legenda">
                <time dateTime={post.dataPublicacao} className="nota">
                  {post.dataPublicacao}
                </time>
                <span className="feed-texto">{post.excerpt}</span>
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
