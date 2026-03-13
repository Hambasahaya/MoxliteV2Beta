"use client";

import { useState } from "react";
import ChatBot from "./ChatBot";

export default function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Button with Pulse Animation */}
      <div className="fixed bottom-6 right-6 z-[110]">
        <button
          onClick={toggleChat}
          className="group relative w-16 h-16 bg-gradient-to-br from-[#667eea] via-[#667eea] to-[#764ba2] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-3xl font-bold"
          aria-label="Open Moxlite Assistant"
          title="Chat dengan Moxlite Assistant"
        >
          {/* Pulse animation rings */}
          <div className="absolute inset-0 rounded-full animate-pulse bg-[#764ba2]/20"></div>
          <div 
            className="absolute inset-0 rounded-full border-2 border-[#667eea] animate-ping"
            style={{ animationDuration: "2s" }}
          ></div>

          {/* Button content */}
          <span className="relative z-10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
            </svg>
          </span>
        </button>

        {/* Badge notifications */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse border border-white"></div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
