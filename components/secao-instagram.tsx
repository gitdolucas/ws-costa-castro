import { SecaoInstagramClient } from "@/components/secao-instagram-client";
import { POSTS_INSTAGRAM } from "@/lib/content/instagram";

export function SecaoInstagram() {
  return <SecaoInstagramClient posts={POSTS_INSTAGRAM} />;
}
