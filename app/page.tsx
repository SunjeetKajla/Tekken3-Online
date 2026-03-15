"use client";

import { useEffect, useState } from "react";

const ROM_URL = "/api/rom";
const TOTAL_BYTES = 459374887;

export default function Home() {
  const [status, setStatus] = useState("Initializing emulator...");
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "psx";
    (window as any).EJS_gameUrl = ROM_URL;
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_AdUrl = "";
    (window as any).EJS_onDownloadProgress = (loaded: number, total: number) => {
      const t = total > 0 ? total : TOTAL_BYTES;
      const pct = Math.min(Math.round((loaded / t) * 100), 100);
      const mb = (loaded / 1024 / 1024).toFixed(1);
      const totalMb = (t / 1024 / 1024).toFixed(1);
      setProgress(pct);
      setStatus(`⬇️ ${mb} / ${totalMb} MB`);
    };
    (window as any).EJS_onGameStart = () => {
      setStarted(true);
      setStatus("✅ Game started!");
      setProgress(100);
    };

    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    script.async = true;
    script.onerror = () => setStatus("❌ Failed to load emulator.");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold tracking-widest mb-4">🎮 TEKKEN 3</h1>

      {!started && (
        <div className="w-full max-w-4xl mb-4 px-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>{status}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div id="game" className="w-full max-w-4xl" />
    </main>
  );
}
