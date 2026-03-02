import { useEffect } from "react";

export type Language = "en" | "id";

interface LanguageToggleProps {
  onLanguageChange: (language: Language) => void;
  currentLanguage: Language;
  position?: "bottom" | "side" | "floating";
}

const LanguageToggle = ({ 
  onLanguageChange, 
  currentLanguage,
  position = "floating"
}: LanguageToggleProps) => {
  useEffect(() => {
    // Pre-translate content in the background
    const savedLanguage = localStorage.getItem("newsLanguage") as Language | null;
    if (savedLanguage && savedLanguage === "id") {
      // Trigger background translation
      const event = new CustomEvent("preloadTranslation", { detail: { language: "id" } });
      window.dispatchEvent(event);
    }
  }, []);

  // Floating position (next to ChatBot button)
  if (position === "floating") {
    return (
      <div className="fixed bottom-6 right-[120px] z-[105] flex gap-2">
        <button
          onClick={() => onLanguageChange("en")}
          className={`px-3 py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${
            currentLanguage === "en"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange("id")}
          className={`px-3 py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${
            currentLanguage === "id"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          ID
        </button>
      </div>
    );
  }

  if (position === "side") {
    return (
      <div className="flex gap-2 absolute right-4 top-1/2 -translate-y-1/2 md:relative md:right-0 md:top-0 md:translate-y-0 md:mb-[24px]">
        <button
          onClick={() => onLanguageChange("en")}
          className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-semibold transition-all ${
            currentLanguage === "en"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          English
        </button>
        <button
          onClick={() => onLanguageChange("id")}
          className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-semibold transition-all ${
            currentLanguage === "id"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Bahasa Indonesia
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-center md:justify-start mb-[24px]">
      <button
        onClick={() => onLanguageChange("en")}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          currentLanguage === "en"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        English
      </button>
      <button
        onClick={() => onLanguageChange("id")}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          currentLanguage === "id"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Bahasa Indonesia
      </button>
    </div>
  );
};

export default LanguageToggle;
