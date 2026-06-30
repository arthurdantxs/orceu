export const RADAR_DA_OBRA_DEFAULT_QUERY = "uf=TO&cidade=Palmas";

export const radarDaObraClientScript = `(() => {
  const defaultQuery = "${RADAR_DA_OBRA_DEFAULT_QUERY}";
  const endpoint = "/api/radar-da-obra";

  function selectedUf() {
    const selector = document.querySelector("[data-radar-state-select]");
    return selector && selector.value ? selector.value : "";
  }

  function buildQuery() {
    const uf = selectedUf();
    if (uf) return "uf=" + encodeURIComponent(uf);
    return defaultQuery;
  }

  async function fetchRadarDaObra(query = defaultQuery) {
    const response = await fetch(endpoint + "?" + query, { cache: "no-store" });
    if (!response.ok) throw new Error("Falha ao carregar Radar da Obra");
    const payload = await response.json();
    if (!payload || payload.success === false) {
      throw new Error("Resposta inválida do Radar da Obra");
    }
    return payload;
  }

  window.fetchRadarDaObra = fetchRadarDaObra;

  function indicatorByKey(payload, key) {
    return Array.isArray(payload.indicadores)
      ? payload.indicadores.find((item) => item.chave === key)
      : null;
  }

  function indicatorBlocksByLabel(label) {
    return Array.from(document.querySelectorAll(".radar-home-indicator")).filter((block) => {
      const title = block.querySelector(".radar-home-indicator-top strong");
      return title && title.textContent.trim().toLowerCase() === label;
    });
  }

  function setSelic(selic) {
    if (!selic) return;
    const blocks = [
      ...document.querySelectorAll('[data-radar-indicator="selic"]'),
      ...indicatorBlocksByLabel("selic"),
    ];

    blocks.forEach((block) => {
      const value = block.querySelector("[data-radar-indicator-value], .radar-home-indicator-value");
      const delta = block.querySelector(".radar-home-indicator-delta");
      if (value) value.textContent = selic.valor;
      if (delta) delta.textContent = "";
    });
  }

  function weatherIcon(status) {
    if (status === "ruim") return "🌧️";
    if (status === "atencao") return "⚠️";
    return "☀️";
  }

  function statusLabel(status, valor) {
    if (status === "ruim") return "Ruim";
    if (status === "atencao") return "Atenção";
    if (status === "favoravel") return "Favorável";
    return String(valor || "").replace(/^\\s*\\d+°\\s*/, "") || "Favorável";
  }

  function setClima(clima) {
    if (!clima) return;
    const blocks = document.querySelectorAll("[data-radar-weather], .radar-home-weather");

    blocks.forEach((block) => {
      block.setAttribute("data-radar-weather-status", clima.status);

      const icon =
        block.querySelector("[data-radar-weather-icon]") ||
        block.querySelector("[aria-hidden='true']");
      const temp =
        block.querySelector("[data-radar-weather-temp]") ||
        block.querySelector(".radar-home-weather-bottom span:first-child");
      const status =
        block.querySelector("[data-radar-weather-status-label]") ||
        block.querySelector(".radar-home-weather-bottom span:last-child");

      if (icon) icon.textContent = weatherIcon(clima.status);
      if (temp) temp.textContent = String(clima.temperatura) + "°";
      if (status) status.textContent = statusLabel(clima.status, clima.valor);
    });
  }

  function renderRadarDaObra(payload) {
    setSelic(indicatorByKey(payload, "selic"));
    setClima(indicatorByKey(payload, "clima_obra"));
  }

  async function refreshRadarDaObra() {
    try {
      const payload = await fetchRadarDaObra(buildQuery());
      renderRadarDaObra(payload);
    } catch {
      // Mantem os valores fixos renderizados como fallback visual.
    }
  }

  function boot() {
    refreshRadarDaObra();
    window.setTimeout(refreshRadarDaObra, 2200);
    document.querySelectorAll("[data-radar-state-select]").forEach((selector) => {
      selector.addEventListener("change", refreshRadarDaObra);
    });
    window.addEventListener("radar-state-change", refreshRadarDaObra);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();`;
