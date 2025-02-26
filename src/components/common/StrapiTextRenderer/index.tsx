import "@/components/common/StrapiTextRenderer/styles.css";
// import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import { iStrapiTextRenderer } from "./types";

const StrapiTextRenderer = ({ content, type }: iStrapiTextRenderer) => {
  if (type == "HTML") {
    return (
      <div
        className="ck-content"
        dangerouslySetInnerHTML={{
          __html: content,
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
