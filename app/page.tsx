import Script from "next/script";
import { loadLegacyHomeHtml } from "@/lib/legacy-site";

const headerScrollScript = `(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const getScrollTop = () => (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );

  const syncHeaderState = () => {
    header.classList.toggle("is-scrolled", getScrollTop() > 10);
  };

  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });
  document.addEventListener("scroll", syncHeaderState, { passive: true, capture: true });
  window.addEventListener("resize", syncHeaderState, { passive: true });
  window.addEventListener("hashchange", syncHeaderState, { passive: true });
  window.addEventListener("load", syncHeaderState);
  window.requestAnimationFrame(syncHeaderState);
})();`;

export default async function Home() {
  const homeHtml = await loadLegacyHomeHtml();

  return (
    <>
      <div
        className="legacy-home"
        dangerouslySetInnerHTML={{ __html: homeHtml }}
      />
      <Script id="legacy-header-scroll" strategy="afterInteractive">
        {headerScrollScript}
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

