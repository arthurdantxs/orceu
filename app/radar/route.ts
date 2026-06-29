import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const htmlPath = path.join(process.cwd(), "public", "radar", "index.html");
  const html = (await readFile(htmlPath, "utf8")).replace(
    'background:#2146AD;color:#2146AD;font-weight:800;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;padding:9px 18px;display:flex;align-items:center;white-space:nowrap;flex-shrink:0',
    'background:#2146AD;color:#FAF7F1;font-weight:800;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;padding:9px 18px;display:flex;align-items:center;white-space:nowrap;flex-shrink:0',
  );

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
