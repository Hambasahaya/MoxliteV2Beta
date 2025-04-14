// import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import { iStrapiTextRenderer } from "./types";

const StrapiTextRenderer = ({ content, type }: iStrapiTextRenderer) => {
  if (type == "HTML") {
    let htmlContent = content;

    // Convert oembed to iframe (simple regex-based YouTube only example)
    htmlContent = htmlContent.replace(
      /<oembed url="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"><\/oembed>/g,
      (_, videoId) => `
        <iframe width="100%" height="500px"
          src="https://www.youtube.com/embed/${videoId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      `
    );

    return (
      <div
        className="ck-content"
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    );
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          ul: ({ children }) => <ul className="custom-list">{children}</ul>,
          li: ({ children }) => (
            <li className="custom-list-item">{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default StrapiTextRenderer;
