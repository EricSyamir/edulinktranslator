import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mic,
  MicOff,
  Globe,
  Languages,
  Volume2,
  MoveRight
} from "lucide-react";
import toast from "react-hot-toast";

const LANGUAGES = [
  { code: "ms", name: "Malay" },
  { code: "en", name: "English" },
  { code: "zh", name: "Mandarin" },
  { code: "ta", name: "Tamil" }
];

export default function TranslationPage() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("ms");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionClass();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.lang =
        sourceLang === "auto"
          ? "en-US"
          : sourceLang === "ms"
          ? "ms-MY"
          : sourceLang === "zh"
          ? "zh-CN"
          : sourceLang === "ta"
          ? "ta-MY"
          : "en-US";

      recognitionInstance.onresult = event => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognitionInstance.onerror = () => {
        setIsRecording(false);
        toast.error("Voice input failed. Please try again.");
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [sourceLang]);

  const toggleRecording = () => {
    if (!recognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch {
        toast.error("Could not start microphone");
      }
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/translation/`, {
        text: inputText,
        source_lang: sourceLang,
        target_lang: targetLang
      });

      setOutputText(response.data.translated_text);
    } catch {
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (!outputText) return;

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(outputText);
      const langMap = {
        ms: "ms-MY",
        en: "en-US",
        zh: "zh-CN",
        ta: "ta-MY"
      };

      const targetTag = langMap[targetLang] || "en-US";
      utterance.lang = targetTag;
      utterance.rate = 0.9;

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(voice => voice.lang === targetTag);

      if (!selectedVoice) {
        const langCode = targetTag.split("-")[0];
        selectedVoice = voices.find(voice => voice.lang.startsWith(langCode));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech is not supported in this browser.");
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary-light rounded-xl text-primary shadow-sm">
          <Globe className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Translator</h1>
          <p className="text-sm text-slate-500">
            White & blue interface with voice support
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-sky-50 border-b border-blue-100 gap-4">
          <select
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
            className="w-full md:w-52 rounded-lg border-slate-200 focus:ring-2 focus:ring-primary/60 focus:border-primary py-2 text-sm"
          >
            <option value="auto">Detect Language</option>
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <MoveRight className="w-5 h-5 text-slate-400 hidden md:block" />

          <select
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            className="w-full md:w-52 rounded-lg border-slate-200 focus:ring-2 focus:ring-primary/60 focus:border-primary py-2 text-sm"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-6 space-y-4 bg-white">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type or speak to translate..."
                className="w-full h-48 resize-none border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-base px-4 py-3 bg-slate-50 placeholder-slate-400 outline-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-full border text-sm shadow-sm transition-colors ${
                    isRecording
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-slate-200 text-slate-500 hover:border-primary/50 hover:text-primary"
                  }`}
                  title="Voice Input"
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{inputText.length} characters</span>
              {isRecording && (
                <span className="text-red-500 font-medium">Listening…</span>
              )}
            </div>
          </div>

          <div className="p-6 bg-sky-50/60">
            {isLoading ? (
              <div className="h-48 flex items-center justify-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600" />
              </div>
            ) : (
              <div className="h-48 text-base text-slate-900 whitespace-pre-wrap bg-white/70 rounded-xl border border-blue-50 px-4 py-3">
                {outputText || (
                  <span className="text-slate-400 italic">
                    Translation will appear here…
                  </span>
                )}
              </div>
            )}

            {outputText && (
              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={handlePlayAudio}
                  className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(outputText)}
                  className="text-xs text-primary hover:text-primary-dark font-medium px-3 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-blue-100 bg-sky-50 flex justify-end">
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || isLoading}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-sm font-semibold"
          >
            <Languages className="w-4 h-4" />
            <span>Translate</span>
          </button>
        </div>
      </div>
    </div>
  );
}

