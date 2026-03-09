import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type Language = "en" | "id";

interface LanguageToggleProps {
  position?: "bottom" | "side" | "floating";
}

const LanguageToggle = ({ position = "floating" }: LanguageToggleProps) => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language as Language;
  const [mounted, setMounted] = useState(false);

  // mark when running on client to avoid SSR/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // dispatch preload event when Indonesian is active
    if (currentLanguage === "id") {
      const event = new CustomEvent("preloadTranslation", { detail: { language: "id" } });
      window.dispatchEvent(event);
    }
  }, [currentLanguage]);

  if (!mounted) {
    // render nothing on server / before hydration to keep markup consistent
    return null;
  }

  // Floating position (next to ChatBot button)
  if (position === "floating") {
    return (
      <div className="fixed bottom-6 right-[120px] z-[105] flex gap-2">
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`px-3 py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${
            currentLanguage === "en"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t('buttons.EN')}
        </button>
        <button
          onClick={() => i18n.changeLanguage("id")}
          className={`px-3 py-2 text-xs md:text-sm rounded-lg font-semibold transition-all ${
            currentLanguage === "id"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t('buttons.ID')}
        </button>
      </div>
    );
  }

  if (position === "side") {
    return (
      <div className="flex gap-2 absolute right-4 top-1/2 -translate-y-1/2 md:relative md:right-0 md:top-0 md:translate-y-0 md:mb-[24px]">
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-semibold transition-all ${
            currentLanguage === "en"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t('language.english')}
        </button>
        <button
          onClick={() => i18n.changeLanguage("id")}
          className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-semibold transition-all ${
            currentLanguage === "id"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t('language.indonesian')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-center md:justify-start mb-[24px]">
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          currentLanguage === "en"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {t('language.english')}
      </button>
      <button
        onClick={() => i18n.changeLanguage("id")}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          currentLanguage === "id"
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {t('language.indonesian')}
      </button>
    </div>
  );
};

export default LanguageToggle;
