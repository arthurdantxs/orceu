import { readFile } from "node:fs/promises";
import path from "node:path";

const ARAGUAINA_COORDS = {
  latitude: -7.19207,
  longitude: -48.2078,
};

const TICKER_LABEL_FIX =
  "background:#2146AD;color:#2146AD;font-weight:800;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;padding:9px 18px;display:flex;align-items:center;white-space:nowrap;flex-shrink:0";
const TICKER_LABEL_FIXED =
  "background:#2146AD;color:#FAF7F1;font-weight:800;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;padding:9px 18px;display:flex;align-items:center;white-space:nowrap;flex-shrink:0";
const RADAR_LIGHT_BLUE = "#8EA3E3";
const RADAR_DOT_FIX =
  'width:7px;height:7px;border-radius:50%;background:#FF6A1A;box-shadow:0 0 0 3px rgba(255,106,26,.16);flex-shrink:0';
const RADAR_DOT_FIXED =
  'width:7px;height:7px;border-radius:50%;background:#8EA3E3;box-shadow:0 0 0 3px rgba(142,163,227,.22);flex-shrink:0';
const MASTHEAD_BRAND_FIX =
  `<div onclick=\\"{{ goHome }}\\" style=\\"cursor:pointer;line-height:1\\">\\n        <div style=\\"display:flex;align-items:flex-end;gap:18px;flex-wrap:wrap\\">\\n          <img src=\\"/assets/logo-orceu.svg\\" alt=\\"Orceu\\" style=\\"height:42px;width:auto;display:block;flex:0 0 auto\\">\\n          <span style=\\"font-family:'Axiforma',sans-serif;font-weight:800;font-size:16px;letter-spacing:.34em;text-transform:uppercase;color:#2146AD;padding-bottom:4px\\">RADAR<\\/span>\\n        <\\/div>\\n        <div style=\\"font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#5B72B8;margin-top:8px;font-weight:600\\">Radar da construcao civil com metodo<\\/div>\\n      <\\/div>`;
const MASTHEAD_BRAND_FIXED =
  `<div onclick=\\"{{ goHome }}\\" style=\\"cursor:pointer;line-height:1\\">\\n        <div style=\\"display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap\\">\\n          <span style=\\"font-family:'Axiforma',sans-serif;font-weight:800;font-size:15px;letter-spacing:.34em;text-transform:uppercase;color:#FAF7F1;padding-bottom:3px\\">RADAR<\\/span>\\n          <img src=\\"/assets/logo-orceu.svg\\" alt=\\"Orceu\\" style=\\"height:42px;width:auto;display:block;flex:0 0 auto\\">\\n        <\\/div>\\n        <div style=\\"font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8EA3E3;margin-top:12px;font-weight:600\\">O Radar oficial da construcao civil<\\/div>\\n      <\\/div>`;
const ARTICLE_META_FIX =
  `<div style=\\"display:flex;align-items:center;gap:14px;padding:16px 0;border-top:1px solid #E7E2D8;border-bottom:1px solid #E7E2D8;margin-bottom:26px\\">\\n          <div style=\\"width:44px;height:44px;border-radius:50%;background:#2146AD;color:#2146AD;display:flex;align-items:center;justify-content:center;font-family:'Axiforma',serif;font-weight:700;font-size:19px;flex-shrink:0\\">{{ sel.author }}<\\/div>\\n          <div style=\\"flex:1\\">\\n            <div style=\\"font-size:14px;font-weight:700;color:#2146AD\\">Por {{ sel.author }}<\\/div>\\n            <div style=\\"font-size:12.5px;color:#5B72B8\\">{{ sel.role }} • {{ sel.date }} • {{ sel.read }}<\\/div>\\n          <\\/div>\\n          <div style=\\"display:flex;gap:8px\\">\\n            <span style=\\"width:34px;height:34px;border:1px solid #E0DACE;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#5A5349;cursor:pointer\\">in<\\/span>\\n            <span style=\\"width:34px;height:34px;border:1px solid #E0DACE;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#5A5349;cursor:pointer\\">↗<\\/span>\\n          <\\/div>\\n        <\\/div>`;
const ARTICLE_META_FIXED =
  `<div style=\\"display:flex;align-items:center;gap:14px;padding:16px 0;border-top:1px solid #E7E2D8;border-bottom:1px solid #E7E2D8;margin-bottom:26px\\">\\n          <div style=\\"flex:1;min-width:0\\">\\n            <div style=\\"font-size:14px;font-weight:700;color:#2146AD\\">Por {{ sel.author }}<\\/div>\\n            <div style=\\"font-size:12.5px;color:#5B72B8\\">{{ sel.role }} • {{ sel.date }} • {{ sel.read }}<\\/div>\\n          <\\/div>\\n          <div style=\\"display:flex;gap:8px;flex-shrink:0\\">\\n            <span style=\\"width:34px;height:34px;border:1px solid #E0DACE;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#5A5349;cursor:pointer\\">in<\\/span>\\n          <\\/div>\\n        <\\/div>`;
const WEATHER_PANEL_FIX =
  `<div style=\\"display:flex;align-items:center;gap:11px;padding:0 22px;border-left:1px solid #ECE7DD;flex-shrink:0\\">\\n          <span style=\\"font-size:20px;line-height:1\\">{{ clima.glyph }}<\\/span>\\n          <div style=\\"display:flex;flex-direction:column;gap:3px\\">\\n            <span style=\\"font-size:9.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#9A8C7C\\">Clima de obra<\\/span>\\n            <div style=\\"display:flex;align-items:baseline;gap:7px\\">\\n              <span style=\\"font-size:16px;font-weight:800;color:#2146AD\\">{{ clima.temp }}<\\/span>\\n              <span style=\\"font-size:11px;font-weight:700;color:#2146AD\\">{{ clima.status }}<\\/span>\\n            <\\/div>\\n          <\\/div>\\n        <\\/div>\\n      <\\/div>\\n\\n      <div style=\\"display:flex;align-items:center;gap:7px;padding-left:20px;flex-shrink:0\\">\\n        <span style=\\"width:6px;height:6px;border-radius:50%;background:#2146AD\\"><\\/span>\\n        <span style=\\"font-size:10px;font-weight:600;letter-spacing:.04em;color:#A89D8C;white-space:nowrap\\">Atualizado há 4 min<\\/span>\\n      <\\/div>`;
const NEWSLETTER_FIX =
  `<div style=\\"background:#2146AD;border-radius:4px;padding:26px 24px;color:#FAF7F1\\">\\n          <div style=\\"font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#2146AD;margin-bottom:10px\\">Newsletter semanal<\\/div>\\n          <h4 style=\\"font-family:'Axiforma',serif;font-weight:700;font-size:23px;line-height:1.12;margin:0 0 8px\\">O setor muda toda semana. Saiba primeiro.<\\/h4>\\n          <p style=\\"font-size:13.5px;line-height:1.5;color:#B5AD9F;margin:0 0 18px\\">Análises de mercado, gestão e tecnologia da construção direto no seu e-mail.<\\/p>\\n          <div style=\\"display:flex;flex-direction:column;gap:9px\\">\\n            <div style=\\"background:#221E18;border:1px solid rgba(255,255,255,.12);border-radius:2px;padding:11px 13px;font-size:13px;color:#5B72B8\\">seu@email.com.br<\\/div>\\n            <button style=\\"background:#FF6A1A;color:#2146AD;border:0;border-radius:2px;padding:12px;font-family:'Axiforma',sans-serif;font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer\\" style-hover=\\"background:#2146AD\\">Quero receber<\\/button>\\n          <\\/div>\\n        <\\/div>`;
const NEWSLETTER_FIXED =
  `<div style=\\"background:#2146AD;border-radius:8px;overflow:hidden;aspect-ratio:1/2.5;min-height:620px\\">\\n          <image-slot id=\\"newsletter-banner-slot\\" shape=\\"rect\\" placeholder=\\"Banner de marketing 1:2.5\\" style=\\"width:100%;height:100%\\"><\\/image-slot>\\n        <\\/div>`;
const UTILITY_BAR_FIX =
  `<!-- Utility bar -->\\n  <div style=\\"background:#2146AD;color:#EAF0FF;border-bottom:1px solid rgba(33,70,173,.18)\\">\\n    <div class=\\"ub-inner px24\\" style=\\"max-width:1240px;margin:0 auto;padding:9px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px\\">\\n      <span class=\\"ub-date\\" style=\\"font-size:11px;letter-spacing:.14em;font-weight:600\\">{{ dateStr }}<\\/span>\\n      <div style=\\"display:flex;align-items:center;gap:22px;font-size:11.5px;letter-spacing:.1em;font-weight:600;text-transform:uppercase\\">\\n        <span class=\\"ub-hide-sm\\" style=\\"color:#9A9183\\" data-comment-anchor=\\"b8738bc7c8-span\\">Edição Brasil<\\/span>\\n        <span class=\\"ub-hide-sm\\" style=\\"color:#9A9183;cursor:pointer\\">Newsletter<\\/span>\\n        <span style=\\"color:#2146AD;cursor:pointer\\">Entrar<\\/span>\\n      <\\/div>\\n    <\\/div>\\n  <\\/div>\\n\\n  `;

async function getRainForecastLabel() {
  try {
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", String(ARAGUAINA_COORDS.latitude));
    weatherUrl.searchParams.set("longitude", String(ARAGUAINA_COORDS.longitude));
    weatherUrl.searchParams.set("daily", "precipitation_sum");
    weatherUrl.searchParams.set("forecast_days", "7");
    weatherUrl.searchParams.set("timezone", "America/Araguaina");

    const response = await fetch(weatherUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`weather ${response.status}`);

    const data = await response.json();
    const precipitation = Array.isArray(data?.daily?.precipitation_sum)
      ? data.daily.precipitation_sum
      : [];
    const rainyDays = precipitation.filter(
      (value: unknown) => typeof value === "number" && value >= 0.2,
    ).length;

    if (rainyDays === 0) return "Sem previsao";
    if (rainyDays === 1) return "1 dia com chuva";
    return `${rainyDays} dias com chuva`;
  } catch {
    return "Sem previsao";
  }
}

export async function GET() {
  const htmlPath = path.join(process.cwd(), "public", "radar", "index.html");
  const [baseHtml, rainForecastLabel] = await Promise.all([
    readFile(htmlPath, "utf8"),
    getRainForecastLabel(),
  ]);
  const html = baseHtml
    .replace(UTILITY_BAR_FIX, "\n")
    .replace(TICKER_LABEL_FIX, TICKER_LABEL_FIXED)
    .replace(RADAR_DOT_FIX, RADAR_DOT_FIXED)
    .replace(MASTHEAD_BRAND_FIX, MASTHEAD_BRAND_FIXED)
    .replace(ARTICLE_META_FIX, ARTICLE_META_FIXED)
    .replace(
      WEATHER_PANEL_FIX,
      `<div style=\\"display:flex;align-items:center;gap:11px;padding:0 22px;border-left:1px solid #ECE7DD;flex-shrink:0\\">\\n          <span style=\\"font-size:20px;line-height:1\\">{{ clima.glyph }}<\\/span>\\n          <div style=\\"display:flex;flex-direction:column;gap:3px\\">\\n            <span style=\\"font-size:9.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#9A8C7C\\">Clima de obra<\\/span>\\n            <div style=\\"display:flex;align-items:baseline;gap:7px\\">\\n              <span style=\\"font-size:16px;font-weight:800;color:#2146AD\\">{{ clima.temp }}<\\/span>\\n              <span style=\\"font-size:11px;font-weight:700;color:#2146AD\\">{{ clima.status }}<\\/span>\\n            <\\/div>\\n          <\\/div>\\n        <\\/div>\\n      <\\/div>\\n\\n      <div style=\\"display:flex;flex-direction:column;justify-content:center;gap:2px;padding-left:18px;flex-shrink:0;min-width:112px\\">\\n        <span style=\\"font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9A8C7C\\">Chuva 7d<\\/span>\\n        <span style=\\"font-size:11px;font-weight:700;letter-spacing:.01em;color:#5B72B8;line-height:1.25\\">${rainForecastLabel}<\\/span>\\n      <\\/div>`,
    )
    .replace(NEWSLETTER_FIX, NEWSLETTER_FIXED)
    .replaceAll("#FF6A1A", RADAR_LIGHT_BLUE)
    .replaceAll("#D9530A", RADAR_LIGHT_BLUE)
    .replaceAll("rgba(255,106,26,.16)", "rgba(142,163,227,.22)")
    .replace(/<div class=\\"mh-search\\"[\s\S]*?<\\\/div>/, "")
    .replace(
      "display:flex;align-items:center;gap:20px;overflow-x:auto;padding:18px 24px;background:#FAF7F1;border-bottom:1px solid #ECE7DD",
      "display:flex;align-items:center;gap:20px;overflow-x:auto;padding:18px 24px;background:#FAF7F1;border-bottom:1px solid #ECE7DD;flex-wrap:wrap",
  );

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
