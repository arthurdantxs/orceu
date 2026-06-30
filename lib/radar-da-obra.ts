export type RadarDaObraStatus = "favoravel" | "atencao" | "ruim";

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

type CacheStore = {
  selic?: CacheEntry<SelicIndicator>;
  radarObra: Map<string, CacheEntry<RadarDaObraResponse>>;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationInput = {
  uf?: string;
  cidade?: string;
  lat?: string;
  lon?: string;
};

type ResolvedLocation = Coordinates & {
  uf: string;
  cidade: string;
};

type SelicIndicator = {
  chave: "selic";
  nome: "Selic";
  valor: string;
  valor_bruto: number;
  fonte: "Banco Central" | "Fallback";
  periodo: string;
  status: "neutral";
};

type ClimaIndicator = {
  chave: "clima_obra";
  nome: "Clima de Obra";
  valor: string;
  temperatura: number;
  chuva: number;
  vento: number;
  fonte: "Open-Meteo" | "Fallback";
  status: RadarDaObraStatus;
};

export type RadarDaObraResponse = {
  success: boolean;
  updated_at: string;
  location: ResolvedLocation;
  indicadores: [SelicIndicator, ClimaIndicator];
};

const SELIC_URL =
  "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json";
const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const SELIC_TTL_MS = 24 * 60 * 60 * 1000;
const CLIMA_TTL_MS = 60 * 60 * 1000;

export const DEFAULT_RADAR_DA_OBRA_LOCATION = {
  uf: "TO",
  cidade: "Palmas",
  latitude: -10.184,
  longitude: -48.3336,
} satisfies ResolvedLocation;

const CAPITALS_BY_UF: Record<string, ResolvedLocation> = {
  AC: { uf: "AC", cidade: "Rio Branco", latitude: -9.97499, longitude: -67.8243 },
  AL: { uf: "AL", cidade: "Maceió", latitude: -9.66599, longitude: -35.735 },
  AP: { uf: "AP", cidade: "Macapá", latitude: 0.034934, longitude: -51.0694 },
  AM: { uf: "AM", cidade: "Manaus", latitude: -3.11903, longitude: -60.0217 },
  BA: { uf: "BA", cidade: "Salvador", latitude: -12.9714, longitude: -38.5014 },
  CE: { uf: "CE", cidade: "Fortaleza", latitude: -3.73186, longitude: -38.5267 },
  DF: { uf: "DF", cidade: "Brasília", latitude: -15.7939, longitude: -47.8828 },
  ES: { uf: "ES", cidade: "Vitória", latitude: -20.3155, longitude: -40.3128 },
  GO: { uf: "GO", cidade: "Goiânia", latitude: -16.6869, longitude: -49.2648 },
  MA: { uf: "MA", cidade: "São Luís", latitude: -2.53073, longitude: -44.3068 },
  MT: { uf: "MT", cidade: "Cuiabá", latitude: -15.601, longitude: -56.0974 },
  MS: { uf: "MS", cidade: "Campo Grande", latitude: -20.4697, longitude: -54.6201 },
  MG: { uf: "MG", cidade: "Belo Horizonte", latitude: -19.9167, longitude: -43.9345 },
  PA: { uf: "PA", cidade: "Belém", latitude: -1.45583, longitude: -48.5044 },
  PB: { uf: "PB", cidade: "João Pessoa", latitude: -7.11532, longitude: -34.861 },
  PR: { uf: "PR", cidade: "Curitiba", latitude: -25.4284, longitude: -49.2733 },
  PE: { uf: "PE", cidade: "Recife", latitude: -8.04756, longitude: -34.877 },
  PI: { uf: "PI", cidade: "Teresina", latitude: -5.08921, longitude: -42.8016 },
  RJ: { uf: "RJ", cidade: "Rio de Janeiro", latitude: -22.9068, longitude: -43.1729 },
  RN: { uf: "RN", cidade: "Natal", latitude: -5.79448, longitude: -35.211 },
  RS: { uf: "RS", cidade: "Porto Alegre", latitude: -30.0346, longitude: -51.2177 },
  RO: { uf: "RO", cidade: "Porto Velho", latitude: -8.76077, longitude: -63.8999 },
  RR: { uf: "RR", cidade: "Boa Vista", latitude: 2.82384, longitude: -60.6753 },
  SC: { uf: "SC", cidade: "Florianópolis", latitude: -27.5954, longitude: -48.548 },
  SP: { uf: "SP", cidade: "São Paulo", latitude: -23.5505, longitude: -46.6333 },
  SE: { uf: "SE", cidade: "Aracaju", latitude: -10.9472, longitude: -37.0731 },
  TO: DEFAULT_RADAR_DA_OBRA_LOCATION,
};

const STATE_NAME_TO_UF: Record<string, string> = {
  acre: "AC",
  alagoas: "AL",
  amapá: "AP",
  amapa: "AP",
  amazonas: "AM",
  bahia: "BA",
  ceará: "CE",
  ceara: "CE",
  "distrito federal": "DF",
  "espírito santo": "ES",
  "espirito santo": "ES",
  goiás: "GO",
  goias: "GO",
  maranhão: "MA",
  maranhao: "MA",
  "mato grosso": "MT",
  "mato grosso do sul": "MS",
  "minas gerais": "MG",
  pará: "PA",
  para: "PA",
  paraíba: "PB",
  paraiba: "PB",
  paraná: "PR",
  parana: "PR",
  pernambuco: "PE",
  piauí: "PI",
  piaui: "PI",
  "rio de janeiro": "RJ",
  "rio grande do norte": "RN",
  "rio grande do sul": "RS",
  rondônia: "RO",
  rondonia: "RO",
  roraima: "RR",
  "santa catarina": "SC",
  "são paulo": "SP",
  "sao paulo": "SP",
  sergipe: "SE",
  tocantins: "TO",
};

const globalForCache = globalThis as typeof globalThis & {
  __radarDaObraCache?: CacheStore;
};

const cache: CacheStore =
  globalForCache.__radarDaObraCache ??
  (globalForCache.__radarDaObraCache = { radarObra: new Map() });

function normalizeText(value: string) {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function normalizeUf(value?: string | null) {
  const uf = value?.trim().toUpperCase();
  return uf && CAPITALS_BY_UF[uf] ? uf : undefined;
}

function parseCoordinate(value?: string | null) {
  if (!value) return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

function formatNumber(value: number, digits = 1) {
  return Number(value.toFixed(digits));
}

function getFromCache<T>(entry?: CacheEntry<T>) {
  if (!entry || entry.expiresAt <= Date.now()) return undefined;
  return entry.value;
}

function setCache<T>(ttlMs: number, value: T): CacheEntry<T> {
  return {
    expiresAt: Date.now() + ttlMs,
    value,
  };
}

function fallbackSelic(): SelicIndicator {
  return {
    chave: "selic",
    nome: "Selic",
    valor: "9,75%",
    valor_bruto: 9.75,
    fonte: "Fallback",
    periodo: "30/06/2026",
    status: "neutral",
  };
}

function fallbackClima(): ClimaIndicator {
  return {
    chave: "clima_obra",
    nome: "Clima de Obra",
    valor: "28° Favorável",
    temperatura: 28,
    chuva: 0,
    vento: 12,
    fonte: "Fallback",
    status: "favoravel",
  };
}

async function fetchJson<T>(url: string, revalidateSeconds: number): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: revalidateSeconds },
    signal: AbortSignal.timeout(6000),
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function getSelicIndicator(): Promise<SelicIndicator> {
  const cached = getFromCache(cache.selic);
  if (cached) return cached;

  try {
    const data = await fetchJson<Array<{ data: string; valor: string }>>(
      SELIC_URL,
      24 * 60 * 60,
    );
    const latest = data[0];
    const rawValue = Number(String(latest?.valor ?? "").replace(",", "."));

    if (!latest?.data || !Number.isFinite(rawValue)) {
      throw new Error("Resposta inválida da Selic");
    }

    const indicator: SelicIndicator = {
      chave: "selic",
      nome: "Selic",
      valor: formatPercent(rawValue),
      valor_bruto: rawValue,
      fonte: "Banco Central",
      periodo: latest.data,
      status: "neutral",
    };

    cache.selic = setCache(SELIC_TTL_MS, indicator);
    return indicator;
  } catch {
    return fallbackSelic();
  }
}

function classifyClima(temperature: number, rain: number, wind: number): RadarDaObraStatus {
  if (rain > 2 || wind > 35 || temperature > 38) return "ruim";
  if (rain > 0 || wind > 25 || temperature > 33) return "atencao";
  return "favoravel";
}

function labelClima(status: RadarDaObraStatus) {
  if (status === "ruim") return "Ruim";
  if (status === "atencao") return "Atenção";
  return "Favorável";
}

function capitalFallback(uf?: string) {
  return uf ? CAPITALS_BY_UF[uf] ?? DEFAULT_RADAR_DA_OBRA_LOCATION : DEFAULT_RADAR_DA_OBRA_LOCATION;
}

async function geocodeCity(cidade: string, uf?: string): Promise<ResolvedLocation> {
  const url = new URL(OPEN_METEO_GEOCODING_URL);
  url.searchParams.set("name", cidade);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "pt");
  url.searchParams.set("format", "json");

  const data = await fetchJson<{
    results?: Array<{
      name?: string;
      latitude?: number;
      longitude?: number;
      admin1?: string;
      country_code?: string;
    }>;
  }>(url.toString(), 60 * 60);

  const brazilResults = (data.results ?? []).filter((result) => result.country_code === "BR");
  const selected =
    brazilResults.find((result) => {
      if (!uf || !result.admin1) return false;
      return STATE_NAME_TO_UF[normalizeText(result.admin1)] === uf;
    }) ??
    brazilResults[0] ??
    data.results?.[0];

  if (selected?.latitude == null || selected?.longitude == null) {
    throw new Error("Cidade não encontrada no geocoding");
  }

  return {
    uf: uf ?? STATE_NAME_TO_UF[normalizeText(selected.admin1 ?? "")] ?? "BR",
    cidade: selected.name ?? cidade,
    latitude: selected.latitude,
    longitude: selected.longitude,
  };
}

async function resolveLocation(input: LocationInput): Promise<ResolvedLocation> {
  const uf = normalizeUf(input.uf);
  const cidade = input.cidade?.trim();
  const lat = parseCoordinate(input.lat);
  const lon = parseCoordinate(input.lon);

  if (lat !== undefined && lon !== undefined) {
    return {
      uf: uf ?? DEFAULT_RADAR_DA_OBRA_LOCATION.uf,
      cidade: cidade || capitalFallback(uf).cidade,
      latitude: lat,
      longitude: lon,
    };
  }

  if (cidade) {
    try {
      return await geocodeCity(cidade, uf);
    } catch {
      return capitalFallback(uf);
    }
  }

  return capitalFallback(uf);
}

async function getClimaIndicator(location: ResolvedLocation): Promise<ClimaIndicator> {
  try {
    const url = new URL(OPEN_METEO_FORECAST_URL);
    url.searchParams.set("latitude", String(location.latitude));
    url.searchParams.set("longitude", String(location.longitude));
    url.searchParams.set(
      "current",
      "temperature_2m,precipitation,rain,weather_code,wind_speed_10m",
    );
    url.searchParams.set("timezone", "auto");

    const data = await fetchJson<{
      current?: {
        temperature_2m?: number;
        precipitation?: number;
        rain?: number;
        wind_speed_10m?: number;
      };
    }>(url.toString(), 60 * 60);

    const current = data.current;
    const temperature = formatNumber(Number(current?.temperature_2m ?? NaN), 0);
    const precipitation = Number(current?.precipitation ?? 0);
    const rain = Number(current?.rain ?? 0);
    const chuva = formatNumber(Math.max(precipitation, rain), 1);
    const vento = formatNumber(Number(current?.wind_speed_10m ?? 0), 1);

    if (!Number.isFinite(temperature) || !Number.isFinite(chuva) || !Number.isFinite(vento)) {
      throw new Error("Resposta inválida do clima");
    }

    const status = classifyClima(temperature, chuva, vento);
    const statusLabel = labelClima(status);

    return {
      chave: "clima_obra",
      nome: "Clima de Obra",
      valor: `${temperature}° ${statusLabel}`,
      temperatura: temperature,
      chuva,
      vento,
      fonte: "Open-Meteo",
      status,
    };
  } catch {
    return fallbackClima();
  }
}

function cacheKeyFromInput(input: LocationInput) {
  const uf = normalizeUf(input.uf) ?? "";
  const cidade = normalizeText(input.cidade ?? "");
  const lat = parseCoordinate(input.lat);
  const lon = parseCoordinate(input.lon);

  if (lat !== undefined && lon !== undefined) {
    return `latlon:${lat.toFixed(4)},${lon.toFixed(4)}:${uf}:${cidade}`;
  }

  return `local:${uf}:${cidade || "capital"}`;
}

export async function getRadarDaObra(input: LocationInput): Promise<RadarDaObraResponse> {
  const key = cacheKeyFromInput(input);
  const cached = getFromCache(cache.radarObra.get(key));
  if (cached) return cached;

  const location = await resolveLocation(input);
  const [selic, clima] = await Promise.all([getSelicIndicator(), getClimaIndicator(location)]);

  const response: RadarDaObraResponse = {
    success: true,
    updated_at: new Date().toISOString(),
    location,
    indicadores: [selic, clima],
  };

  cache.radarObra.set(key, setCache(CLIMA_TTL_MS, response));
  return response;
}
