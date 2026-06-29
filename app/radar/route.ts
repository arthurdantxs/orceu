import path from "node:path";
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";

const RADAR_HTML_PATH = path.join(process.cwd(), "radar", "index.html");

type BundledAsset = {
  compressed: boolean;
  data: string;
  mime: string;
};

function expandBundledRadarDocument(html: string) {
  const manifestMatch = html.match(
    /<script type="__bundler\/manifest">\s*([\s\S]*?)\s*<\/script>/i,
  );
  const templateMatch = html.match(
    /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/i,
  );

  if (!manifestMatch || !templateMatch) {
    return html;
  }

  const manifest = JSON.parse(manifestMatch[1]) as Record<string, BundledAsset>;
  let template = JSON.parse(templateMatch[1]) as string;

  for (const [uuid, entry] of Object.entries(manifest)) {
    const encodedBytes = Buffer.from(entry.data, "base64");
    const finalBytes = entry.compressed ? gunzipSync(encodedBytes) : encodedBytes;
    const dataUrl = `data:${entry.mime};base64,${finalBytes.toString("base64")}`;
    template = template.split(uuid).join(dataUrl);
  }

  return template
    .replace(/\s+integrity="[^"]*"/gi, "")
    .replace(/\s+crossorigin="[^"]*"/gi, "");
}

export async function GET() {
  const html = await readFile(RADAR_HTML_PATH, "utf8");
  const expandedHtml = expandBundledRadarDocument(html);

  return new Response(expandedHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
