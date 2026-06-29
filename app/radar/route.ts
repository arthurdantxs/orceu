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
const WEATHER_STATUS_FIX =
  '<div style=\\"display:flex;align-items:center;gap:7px;padding-left:20px;flex-shrink:0\\">\\n        <span style=\\"width:6px;height:6px;border-radius:50%;background:#2146AD\\"><\\/span>\\n        <span style=\\"font-size:10px;font-weight:600;letter-spacing:.04em;color:#A89D8C;white-space:nowrap\\">Atualizado há 4 min<\\/span>\\n      <\\/div>';

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

    if (rainyDays === 0) return "Sem chuva nos próximos 7 dias";
    if (rainyDays === 1) return "Chuva prevista em 1 dos próximos 7 dias";
    return `Chuva prevista em ${rainyDays} dos próximos 7 dias`;
  } catch {
    return "Sem chuva nos próximos 7 dias";
  }
}

export async function GET() {
  const htmlPath = path.join(process.cwd(), "public", "radar", "index.html");
  const [baseHtml, rainForecastLabel] = await Promise.all([
    readFile(htmlPath, "utf8"),
    getRainForecastLabel(),
  ]);
  const html = baseHtml
    .replace(TICKER_LABEL_FIX, TICKER_LABEL_FIXED)
    .replace(
      WEATHER_STATUS_FIX,
      `<div style=\\"display:flex;align-items:center;gap:7px;padding-left:20px;min-width:0;max-width:190px\\">\\n        <span style=\\"width:6px;height:6px;border-radius:50%;background:#2146AD;flex-shrink:0\\"><\\/span>\\n        <span style=\\"font-size:10px;font-weight:700;letter-spacing:.01em;color:#5B72B8;line-height:1.3;white-space:normal\\">${rainForecastLabel}<\\/span>\\n      <\\/div>`,
    )
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
