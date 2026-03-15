"use client";

import Script from "next/script";
import { useState } from "react";

const ROM_URL = "/api/rom";

export default function Home() {
  const [status, setStatus] = useState("Initializing emulator...");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold tracking-widest mb-4">🎮 TEKKEN 3</h1>
      <p id="status-text" className="text-sm text-gray-400 mb-4">{status}</p>
      <div id="game" className="w-full max-w-4xl" />

      <Script id="emulator-config" strategy="beforeInteractive">{`
        window.EJS_player = "#game";
        window.EJS_core = "psx";
        window.EJS_gameUrl = "${ROM_URL}";
        window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
        window.EJS_startOnLoaded = true;
        window.EJS_loadStateURL = null;
        window.EJS_AdUrl = "";
        window.EJS_onDownloadProgress = function(loaded, total) {
          const el = document.getElementById("status-text");
          if (!el) return;
          if (total && total > 0) {
            const pct = Math.round((loaded / total) * 100);
            const mb = (loaded / 1024 / 1024).toFixed(1);
            const totalMb = (total / 1024 / 1024).toFixed(1);
            el.innerText = "⬇️ Downloading ROM... " + pct + "% (" + mb + " / " + totalMb + " MB)";
          } else {
            const mb = (loaded / 1024 / 1024).toFixed(1);
            el.innerText = "⬇️ Downloading ROM... " + mb + " MB";
          }
        };
        window.EJS_onGameStart = function() {
          document.getElementById("status-text").innerText = "✅ Game started!";
        };
      `}</Script>
      <Script
        src="https://cdn.emulatorjs.org/stable/data/loader.js"
        strategy="afterInteractive"
        onLoad={() => setStatus("⬇️ Loading emulator core...")}
        onError={() => setStatus("❌ Failed to load emulator. Check your connection.")}
      />
    </main>
  );
}
