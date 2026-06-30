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

const mindModalScript = `(() => {
  const modal = document.getElementById("orceu-mind-modal");
  if (!modal) return;

  const triggers = document.querySelectorAll("#solucoes-mind .card-cta.light");
  const closeButtons = modal.querySelectorAll("[data-mind-modal-close]");
  const cta = modal.querySelector(".mind-modal-cta");

  const openModal = (event) => {
    if (event) event.preventDefault();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("mind-modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mind-modal-open");
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", openModal);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  if (cta) {
    cta.addEventListener("click", () => {
      closeModal();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();`;

export default async function Home() {
  const homeHtml = await loadLegacyHomeHtml();

  return (
    <>
      <div
        className="legacy-home"
        dangerouslySetInnerHTML={{ __html: homeHtml }}
      />
      <div
        className="mind-modal"
        id="orceu-mind-modal"
        role="presentation"
        aria-hidden="true"
      >
        <button
          className="mind-modal-backdrop"
          type="button"
          aria-label="Fechar Orceu Mind"
          data-mind-modal-close
        />
        <section
          className="mind-modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mind-modal-title"
        >
          <button
            className="mind-modal-close"
            type="button"
            aria-label="Fechar Orceu Mind"
            data-mind-modal-close
          >
            FECHAR
          </button>
          <img
            className="mind-modal-head"
            src="/assets/orceu-mind-head.webp"
            alt="Orceu Mind. O mastermind mais exclusivo da construção civil."
          />
          <h2 className="mind-modal-title" id="mind-modal-title">
            O MASTERMIND MAIS EXCLUSIVO DA CONSTRUÇÃO CIVIL.
          </h2>
          <div className="mind-modal-content">
            <p className="mind-modal-lead">
              O ORCEU MIND REÚNE DONOS DE CONSTRUTORA, ENGENHEIROS E ARQUITETOS
              QUE JÁ
              <br />
              SAÍRAM DA OBRA CAOS E OPERAM NUM OUTRO NÍVEL.
              <br />
              UM AMBIENTE FECHADO, ONDE DECISÃO SE ACELERA,
              <br />
              EXPERIÊNCIA REAL SE TROCA E CADA MEMBRO CRESCE
              <br />
              CERCADO DE GENTE QUE JOGA O MESMO JOGO.
            </p>
            <div className="mind-modal-logo-marquee" aria-hidden="true">
              <div className="mind-modal-logo-track">
                <img src="/assets/logos%20minds0.svg" alt="" />
                <img src="/assets/logos%20minds0.svg" alt="" />
              </div>
            </div>
            <p className="mind-modal-kicker">AQUI DENTRO VOCÊ ENCONTRA:</p>
            <div className="mind-modal-benefits">
              <p>
                <span className="mind-benefit-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 22a5 5 0 0 0 5-5H2a5 5 0 0 0 5 5Zm10 0a5 5 0 0 0 5-5H12a5 5 0 0 0 5 5Zm-5-8 3-3-3-3-3 3 3 3Z" />
                  </svg>
                </span>
                NETWORKING QUALIFICADO COM QUEM JÁ CONSTRUIU OPERAÇÃO
                PREVISÍVEL E LUCRATIVA
              </p>
              <p>
                <span className="mind-benefit-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7h12l-3-3 1.8-1.8L21 8.5 14.8 15 13 13l3-3H4V7Zm16 10H8l3 3-1.8 1.8L3 15.5 9.2 9 11 11l-3 3h12v3Z" />
                  </svg>
                </span>
                TROCA DIRETA DE EXPERIÊNCIA SOBRE GESTÃO, PROCESSOS, PESSOAS E
                CRESCIMENTO
              </p>
              <p>
                <span className="mind-benefit-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 10 10h-3a7 7 0 1 1-7-7V2Zm1 1v8h8a8 8 0 0 0-8-8Zm-1 13a4 4 0 0 0 4-4h-3a1 1 0 1 1-1-1V8a4 4 0 1 0 0 8Z" />
                  </svg>
                </span>
                ACESSO A DISCUSSÕES ESTRATÉGICAS QUE NÃO ACONTECEM EM NENHUM
                OUTRO LUGAR DO SETOR
              </p>
              <p>
                <span className="mind-benefit-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 9V7A5 5 0 0 0 7 7v2H5v13h14V9h-2Zm-7 0V7a2 2 0 1 1 4 0v2h-4Zm3.5 7.7V19h-3v-2.3a2 2 0 1 1 3 0Z" />
                  </svg>
                </span>
                UM CÍRCULO DE CONFIANÇA PARA DESTRAVAR AS DECISÕES MAIS
                DIFÍCEIS DO SEU NEGÓCIO
              </p>
            </div>
            <p className="mind-modal-access">
              O MIND NÃO ESTÁ ABERTO AO PÚBLICO. O ACESSO É EXCLUSIVO PARA
              QUEM PASSOU PELA IMERSÃO DO ORCEU EMPRESARIAL E PROVOU QUE ESTÁ
              PRONTO PARA ESSE NÍVEL.
            </p>
          </div>
          <p className="mind-modal-note">
            A PORTA DE ENTRADA PARA O ORCEU MIND:
          </p>
          <a
            className="mind-modal-cta"
            href="https://www.orceuempresarial.com.br/"
            target="_blank"
            rel="noreferrer"
          >
            CONHECER O ORCEU EMPRESARIAL
          </a>
        </section>
      </div>
      <Script id="hero-header-bounds" strategy="afterInteractive">
        {heroHeaderBoundsScript}
      </Script>
      <Script id="orceu-mind-modal" strategy="afterInteractive">
        {mindModalScript}
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
