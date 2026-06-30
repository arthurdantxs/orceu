const DEFAULT_SITE_URL = "http://127.0.0.1:4173";

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!envUrl) return DEFAULT_SITE_URL;

  const normalized = envUrl.startsWith("http")
    ? envUrl
    : `https://${envUrl}`;

  return normalized.replace(/\/$/, "");
}

