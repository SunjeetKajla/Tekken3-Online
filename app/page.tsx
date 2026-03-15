"use client";

import Script from "next/script";

const ROM_URL = "https://github.com/SunjeetKajla/Tekken3-Online/releases/download/ROM/Tekken.3.USA.chd";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold tracking-widest mb-6">🎮 TEKKEN 3</h1>
      <div id="game" className="w-full max-w-4xl" />

      <Script id="emulator-config" strategy="beforeInteractive">
        {`
          window.EJS_player = "#game";
          window.EJS_core = "psx";
          window.EJS_gameUrl = "${ROM_URL}";
          window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
          window.EJS_startOnLoaded = true;
        `}
      </Script>
      <Script
        src="https://cdn.emulatorjs.org/stable/data/loader.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
