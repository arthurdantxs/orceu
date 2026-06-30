import { getRadarArticleIsoDate, radarArticles } from "@/lib/radar-news";
import { getSiteUrl } from "@/lib/site-config";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();

  const items = radarArticles
    .map((article) => {
      const url = `${siteUrl}/radar/${article.id}`;

      return `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <description>${escapeXml(article.dek)}</description>
          <pubDate>${new Date(getRadarArticleIsoDate(article.date)).toUTCString()}</pubDate>
          <category>${escapeXml(article.cat)}</category>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Radar Orceu</title>
    <link>${siteUrl}/radar</link>
    <description>Notícias, análises e tendências da construção civil publicadas pelo Radar Orceu.</description>
    <language>pt-BR</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
