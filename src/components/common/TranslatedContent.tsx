import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "@/components/common/LanguageToggle";
import { translateText } from "@/lib/translationService";

interface TranslatedContentProps {
  content: string;
  type?: "HTML" | "MARKDOWN";
}

const TranslatedContent = ({ content, type = "HTML" }: TranslatedContentProps) => {
  const { i18n } = useTranslation();
  const language = i18n.language as Language;
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

      // Step 1: Clean up HTML - convert custom tags and remove unnecessary attributes
      let cleanedContent = cleanupHTML(content);

      // Parse cleaned HTML to identify translatable sections
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanedContent, "text/html");
      const body = doc.body;

      // Collect block-level elements for translation
      const translatableElements: Array<{ element: Element; originalText: string }> = [];
      
      const walkElements = (node: Node) => {
        if (node.nodeType !== 1) return;
        
        const element = node as Element;
        const tagName = element.tagName;
        
        // Skip non-translatable elements
        if (['STRONG', 'B', 'CODE', 'PRE', 'KBD', 'SCRIPT', 'STYLE', 'A'].includes(tagName)) {
          return;
        }
        
        // Extract text content from block elements
        if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SECTION', 'ARTICLE', 'TD', 'TH'].includes(tagName)) {
          const plainText = element.textContent?.trim() || '';
          if (plainText.length > 0 && plainText.length < 1000) {
            translatableElements.push({ element, originalText: plainText });
          }
        } else {
          // Recursively check children
          element.childNodes.forEach(walkElements);
        }
      };
      
      walkElements(body);

      // Translate elements in batches
      const chunkSize = 5;
      for (let i = 0; i < translatableElements.length; i += chunkSize) {
        const chunk = translatableElements.slice(i, i + chunkSize);
        
        await Promise.all(
          chunk.map(async ({ element, originalText }) => {
            try {
              const translated = await translateText(originalText, language);
              // Replace text content while preserving HTML structure
              const childNodes = Array.from(element.childNodes);
              
              if (childNodes.length === 1 && childNodes[0].nodeType === 3) {
                // Simple text node - direct replacement
                childNodes[0].textContent = translated;
              } else {
                // Complex structure - replace text content in place
                element.textContent = translated;
              }
            } catch (error) {
              console.error("Failed to translate element:", error);
            }
          })
        );
      }

      setTranslatedContent(normalizeHTML(body.innerHTML));
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedContent(content);
    } finally {
      setIsTranslating(false);
    }
  }, [language, content]);

  // Helper function to clean up messy HTML (custom tags, unnecessary attributes)
  const cleanupHTML = (html: string): string => {
    let cleaned = html;
    
    // Convert custom tags like <$2> to <p>
    cleaned = cleaned.replace(/<\$\d+/g, '<p');
    cleaned = cleaned.replace(/<\/\$\d+>/g, '</p>');
    
    // Remove only dir attributes, KEEP style attributes for formatting
    cleaned = cleaned.replace(/\s+dir="[^"]*"/g, '');
    
    // Remove unnecessary style properties but keep: font-weight, text-align, padding, margin, line-height
    cleaned = cleaned.replace(/style="([^"]*)"/g, (match: string, styleContent: string) => {
      const styles = styleContent.split(';').filter((s: string) => s.trim());
      const keepStyles = styles.filter((style: string) => {
        const prop = style.split(':')[0].trim().toLowerCase();
        return [
          'font-weight',
          'text-align',
          'padding',
          'padding-top',
          'padding-bottom',
          'padding-left',
          'padding-right',
          'margin',
          'margin-top',
          'margin-bottom',
          'margin-left',
          'margin-right',
          'line-height'
        ].includes(prop);
      });
      
      if (keepStyles.length > 0) {
        return `style="${keepStyles.join(';')}"`;
      }
      return '';
    });
    
    // Clean up multiple spaces
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    
    return cleaned;
  };

  // Helper function to normalize HTML after translation - Preserves structure intelligently
  const normalizeHTML = (html: string): string => {
    try {
      // Step 1: Fix spacing and structure issues (but preserve style attributes)
      let normalized = html
        // Remove spaces before punctuation
        .replace(/\s+([.,!?;:])/g, '$1')
        // Remove multiple spaces only in text content, not in attributes
        .replace(/>\s+</g, '><')
        // Remove newlines in content
        .replace(/\n+/g, ' ');

      // Step 2: Parse and clean using DOM
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<root>${normalized}</root>`, "text/html");
      
      const cleanTextNodes = (node: Node) => {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach((child) => {
          if (child.nodeType === 3) { // Text node
            let text = child.textContent || '';
            // Trim leading/trailing spaces
            text = text.replace(/^\s+/, '').replace(/\s+$/, '');
            // Normalize internal spaces (but keep single meaningful spaces)
            text = text.replace(/\s{2,}/g, ' ');
            
            if (text.trim()) {
              child.textContent = text;
            } else if (child.parentNode) {
              child.parentNode.removeChild(child);
            }
          } else if (child.nodeType === 1) {
            cleanTextNodes(child);
          }
        });
      };
      
      cleanTextNodes(doc.documentElement);
      
      let result = doc.documentElement.innerHTML
        .replace(/^<root[^>]*>/i, '')
        .replace(/<\/root>$/i, '')
        .trim();
      
      // Step 3: Ensure paragraphs have proper spacing but preserve styles
      result = result
        .replace(/<\/p>\s*<p/gi, '</p><p')  // Remove extra space between paragraphs
        .replace(/<p\s+/g, '<p ')             // Normalize spacing in opening tags
        .replace(/\s+>/g, '>');               // Remove extra spaces before closing >
      
      return result;
    } catch (error) {
      // Fallback: simple cleanup
      return html
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([.,!?;:])/g, '$1')
        .trim();
    }
  };

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
