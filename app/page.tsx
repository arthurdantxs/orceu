import Script from "next/script";
import { loadLegacyHomeHtml } from "@/lib/legacy-site";

const heroHeaderBoundsScript = `(() => {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  if (!header || !hero) return;

  const syncHeaderBounds = () => {
    const heroRect = hero.getBoundingClientRect();
    const headerHeight = header.offsetHeight || 0;
    const floatingOffset = window.innerWidth <= 680 ? 8 : 14;
    const headerBottom = floatingOffset + headerHeight;
    const staysInsideHero = heroRect.bottom > headerBottom;

    header.classList.toggle("is-outside-hero", !staysInsideHero);
  };

  syncHeaderBounds();
  window.addEventListener("scroll", syncHeaderBounds, { passive: true });
  window.addEventListener("resize", syncHeaderBounds, { passive: true });
  window.addEventListener("load", syncHeaderBounds);
  window.addEventListener("hashchange", syncHeaderBounds, { passive: true });
  window.requestAnimationFrame(syncHeaderBounds);
})();`;

export default async function Home() {
  const homeHtml = await loadLegacyHomeHtml();

  return (
    <>
      <div
        className="legacy-home"
        dangerouslySetInnerHTML={{ __html: homeHtml }}
      />
      <Script id="hero-header-bounds" strategy="afterInteractive">
        {heroHeaderBoundsScript}
      </Script>
      <Script
        src="/legacy-scripts/home-part-1.js"
        strategy="afterInteractive"
      />
      <Script
        src="/legacy-scripts/home-part-2.js"
        strategy="afterInteractive"
      />
    </>
  );
}
