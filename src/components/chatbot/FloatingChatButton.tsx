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
          className="group relative w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-3xl font-bold"
          aria-label="Open Moxlite Assistant"
          title="Chat dengan Moxlite Assistant"
        >
          {/* Pulse animation rings */}
          <div className="absolute inset-0 rounded-full animate-pulse bg-blue-400/20"></div>
          <div 
            className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping"
            style={{ animationDuration: "2s" }}
          ></div>

          {/* Button content */}
          <span className="relative z-10">💡</span>
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
