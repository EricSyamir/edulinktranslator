import React from "react";
import TranslationPage from "./TranslationPage.jsx";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col">
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <img
                src="/photo_2026-01-27_00-12-15.jpg"
                alt="Edulink"
                className="h-10 w-10 rounded-lg object-cover shadow-sm"
              />
              <img
                src="/logosekolah.png"
                alt="School"
                className="h-10 w-10 rounded-lg object-contain shadow-sm"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Edulink AI Translator
              </p>
              <p className="text-xs text-slate-500">
                Seamless multilingual communication
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <TranslationPage />
      </main>

      <footer className="border-t border-blue-100 bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-slate-400 flex justify-between">
          <span>© {new Date().getFullYear()} Edulink</span>
          <span>Built for a white & blue theme</span>
        </div>
      </footer>

      <Toaster position="top-right" />
    </div>
  );
}

