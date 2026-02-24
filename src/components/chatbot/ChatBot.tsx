"use client";

import react, { useState, useRef, useEffect } from "react";
import {
  ChatMessage,
  UserPreferences,
  generateChatbotResponse,
  getGreetingMessage,
} from "@/lib/chatbotService";
import { generateQuotationPDF } from "@/lib/pdfService";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([getGreetingMessage()]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll ke bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Tambah user message
    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Extract preferences dari input user
    const budgetMatch = inputValue.match(/\d+/);
    if (budgetMatch) {
      setPreferences((prev) => ({
        ...prev,
        budget: parseInt(budgetMatch[0]) * 1000000, // Convert to actual number
      }));
    }

    if (
      inputValue.toLowerCase().includes("rental") ||
      inputValue.toLowerCase().includes("sewa") ||
      inputValue.toLowerCase().includes("cust rental")
    ) {
      setPreferences((prev) => ({ ...prev, type: "cust rental" }));
    } else if (
      inputValue.toLowerCase().includes("project") ||
      inputValue.toLowerCase().includes("pembelian") ||
      inputValue.toLowerCase().includes("beli") ||
      inputValue.toLowerCase().includes("cust project")
    ) {
      setPreferences((prev) => ({ ...prev, type: "cust project" }));
    }

    // Simulate typing delay (100-500ms)
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 400 + 100)
    );

    // Generate bot response
    const botResponse = generateChatbotResponse(inputValue, preferences);
    const botMessage: ChatMessage = {
      id: "bot-" + Date.now(),
      type: "bot",
      content: botResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  // Handle reset chat
  const handleReset = () => {
    setMessages([getGreetingMessage()]);
    setPreferences({});
    setInputValue("");
    setUploadedFile(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Add user message dengan info file
      const userMessage: ChatMessage = {
        id: "user-" + Date.now(),
        type: "user",
        content: `📎 Upload file: ${file.name}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Simulate typing delay
      setTimeout(() => {
        // Dummy response untuk upload
        const botMessage: ChatMessage = {
          id: "bot-" + Date.now(),
          type: "bot",
          content: "Sorry, masih dalam rancangan mas ellon, tunggu nanti yaa 🛠️\n\nAnalisis file sketsa design panggung akan segera diluncurkan untuk memberikan rekomendasi produk yang lebih akurat!",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 800);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    generateQuotationPDF({
      messages,
      preferences,
      recommendations: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Chat Box - Enhanced Design */}
      <div className="relative w-full sm:w-[420px] h-[680px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
        {/* Gradient Background Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white p-5 rounded-t-2xl flex justify-between items-start">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-bold text-lg">Moxlite Assistant</h3>
                <p className="text-sm text-blue-100">AI Rekomendasi Lampu</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed transition ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm leading-relaxed">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-2 mb-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ketik pesan..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-2.5 rounded-full transition disabled:opacity-50 font-medium text-sm"
            >
              ➤
            </button>
          </form>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2.5 rounded-lg transition flex flex-col items-center justify-center gap-1 font-medium shadow-md"
              title="Upload sketsa design"
            >
              <span className="text-base">📎</span>
              <span>Upload</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={messages.length <= 1}
              className="text-xs bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2.5 rounded-lg transition disabled:opacity-50 flex flex-col items-center justify-center gap-1 font-medium shadow-md"
              title="Export quotation PDF"
            >
              <span className="text-base">📄</span>
              <span>Export</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="text-xs bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-3 py-2.5 rounded-lg transition flex flex-col items-center justify-center gap-1 font-medium shadow-md"
              title="Reset chat"
            >
              <span className="text-base">🔄</span>
              <span>Reset</span>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.ppt,.pptx,.jpg,.jpeg,.png"
            hidden
          />

          {/* Uploaded file info */}
          {uploadedFile && (
            <div className="mt-3 p-3 bg-green-50 border border-green-300 rounded-lg text-xs text-green-800 font-medium leading-relaxed">
              ✓ Berhasil dikirim: {uploadedFile.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
