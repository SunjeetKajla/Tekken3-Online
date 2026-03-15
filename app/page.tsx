"use client";

import { useEffect, useState } from "react";

const TOTAL_BYTES = 459374887;

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [mb, setMb] = useState("0");
  const [phase, setPhase] = useState<"downloading" | "starting" | "playing">("downloading");

  useEffect(() => {
    let cancelled = false;

    async function loadROM() {
      const cache = await caches.open("tekken3-rom");
      let res = await cache.match("/api/rom");

      if (!res) {
        const download = await fetch("/api/rom");
        await cache.put("/api/rom", download.clone());
        res = await cache.match("/api/rom");
      }

      if (!res) throw new Error("ROM not found in cache after storing");

      const total = Number(res.headers.get("content-length")) || TOTAL_BYTES;
      const reader = res.body!.getReader();
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done || cancelled) break;
        chunks.push(value);
        loaded += value.byteLength;
        const pct = Math.min(Math.round((loaded / total) * 100), 100);
        setProgress(pct);
        setMb((loaded / 1024 / 1024).toFixed(1));
      }

      if (cancelled) return;

      // Merge chunks into a single blob
      const blob = new Blob(chunks, { type: "application/octet-stream" });
      const blobUrl = URL.createObjectURL(blob);

      setPhase("starting");

      (window as any).EJS_player = "#game";
      (window as any).EJS_core = "psx";
      (window as any).EJS_gameUrl = blobUrl;
      (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
      (window as any).EJS_startOnLoaded = true;
      (window as any).EJS_AdUrl = "";
      (window as any).EJS_onGameStart = () => setPhase("playing");

      const script = document.createElement("script");
      script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
      document.body.appendChild(script);
    }

    loadROM();
    return () => { cancelled = true; };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold tracking-widest mb-6">🎮 TEKKEN 3</h1>

      {phase !== "playing" && (
        <div className="w-full max-w-4xl px-4 mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              {phase === "downloading"
                ? `⬇️ Downloading ROM... ${mb} / ${(TOTAL_BYTES / 1024 / 1024).toFixed(1)} MB`
                : "⚙️ Starting emulator..."}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div id="game" className="w-full max-w-4xl" />
    </main>
  );
}
