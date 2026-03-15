import { NextRequest } from "next/server";

const ROM_SOURCE = "https://ia600800.us.archive.org/9/items/tekken-3-usa_202603/Tekken%203%20%28USA%29.chd";

export async function GET(req: NextRequest) {
  const range = req.headers.get("range");

  const upstream = await fetch(ROM_SOURCE, {
    headers: range ? { range } : {},
  });

  const headers = new Headers();
  headers.set("Content-Type", "application/octet-stream");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Accept-Ranges", "bytes");

  const contentRange = upstream.headers.get("content-range");
  const contentLength = upstream.headers.get("content-length");
  if (contentRange) headers.set("Content-Range", contentRange);
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
