import { useState, useEffect, useCallback } from "react";
import { Language } from "@/components/common/LanguageToggle";
import { translateText } from "@/lib/translationService";

interface TranslatedContentProps {
  content: string;
  language: Language;
  type?: "HTML" | "MARKDOWN";
}

const TranslatedContent = ({ content, language, type = "HTML" }: TranslatedContentProps) => {
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isTranslating, setIsTranslating] = useState(false);

  const translateHTMLContent = useCallback(async () => {
    if (language === "en") {
      setTranslatedContent(content);
      return;
    }

    setIsTranslating(true);
    try {
      if (typeof window === "undefined") {
        setTranslatedContent(content);
        return;
      }

      // Parse HTML and translate text content
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const body = doc.body;

      // Get all text nodes and translate them
      const textNodes: Array<{ element: Node; text: string }> = [];

      const collectTextNodes = (node: Node) => {
        if (node.nodeType === 3) { // Text node
          const text = node.textContent?.trim();
          if (text && text.length > 0 && text.length < 500) {
            textNodes.push({ element: node, text });
          }
        } else {
          node.childNodes.forEach(collectTextNodes);
        }
      };

      collectTextNodes(body);

      // Translate text nodes in parallel with batching
      const chunkSize = 5;
      for (let i = 0; i < textNodes.length; i += chunkSize) {
        const chunk = textNodes.slice(i, i + chunkSize);
        await Promise.all(
          chunk.map(async ({ element, text }) => {
            const translated = await translateText(text, language);
            element.textContent = translated;
          })
        );
      }

      setTranslatedContent(body.innerHTML);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedContent(content);
    } finally {
      setIsTranslating(false);
    }
  }, [language, content]);

  useEffect(() => {
    translateHTMLContent();
  }, [language, translateHTMLContent]);

  if (isTranslating) {
    return <div className="text-center text-gray-500 py-8">Translating content...</div>;
  }

  if (type === "HTML") {
    return (
      <div
        className="prose prose-sm md:prose-base max-w-none"
        dangerouslySetInnerHTML={{ __html: translatedContent }}
      />
    );
  }

  return <div className="prose prose-sm md:prose-base max-w-none">{translatedContent}</div>;
};

export default TranslatedContent;
