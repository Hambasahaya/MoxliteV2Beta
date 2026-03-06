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
        budget: parseInt(budgetMatch[0]) * 1000000,
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

    try {
      // Call Gemini API to generate bot response
      const botResponse = await generateChatbotResponse(inputValue, preferences);
      const botMessage: ChatMessage = {
        id: "bot-" + Date.now(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: ChatMessage = {
        id: "bot-" + Date.now(),
        type: "bot",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset chat
  const handleReset = () => {
    setMessages([getGreetingMessage()]);
    setPreferences({});
    setInputValue("");
    setUploadedFile(null);
  };

  // Handle file upload with image preview
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        // Add user message dengan image preview
        const userMessage: ChatMessage = {
          id: "user-" + Date.now(),
          type: "user",
          content: `📸 Analisis Design Stage: ${file.name}`,
          imageData: base64Image,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
          // Call API with image data
          const response = await fetch("/api/chatbot", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Analisis design stage/panggung berikut dan berikan rekomendasi lampu yang cocok. Jelaskan: tipe stage, ukuran estimasi, jenis event, kompleksitas lighting, dan rekomendasi produk Moxlite yang sesuai berdasarkan layout yang terlihat.`,
              imageData: base64Image,
              imageType: file.type,
              budget: preferences.budget,
              type: preferences.type,
              isImageAnalysis: true,
            }),
          });

          const data = await response.json();
          
          if (data.success && data.response) {
            const botMessage: ChatMessage = {
              id: "bot-" + Date.now(),
              type: "bot",
              content: data.response,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
          } else {
            const errorMessage: ChatMessage = {
              id: "bot-" + Date.now(),
              type: "bot",
              content: "Maaf, gagal menganalisis gambar. Coba lagi atau gunakan deskripsi text.",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          const errorMessage: ChatMessage = {
            id: "bot-" + Date.now(),
            type: "bot",
            content: "Terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.readAsDataURL(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      alert("Silakan upload gambar (JPG, PNG, WebP, dll)");
    }
  };

  const handleExportPDF = () => {
    generateQuotationPDF({
      messages,
      preferences,
      recommendations: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center md:justify-end p-2 sm:p-4 md:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Chat Box - Responsive Design */}
      <div className="relative w-full h-[calc(100vh-1rem)] sm:h-[680px] md:w-[440px] md:h-[720px] bg-white rounded-2xl shadow-2xl flex flex-col z-[110] overflow-hidden max-h-[95vh]">
        {/* Gradient Background Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white p-3 sm:p-5 rounded-t-2xl flex justify-between items-start flex-shrink-0">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="text-2xl sm:text-3xl">💡</div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Moxlite Assistant</h3>
                <p className="text-xs sm:text-sm text-blue-100">AI Rekomendasi Lampu</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-gradient-to-b from-gray-50 to-white space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-xs">
                {/* Image preview if exists */}
                {message.imageData && (
                  <img
                    src={message.imageData}
                    alt="Upload preview"
                    className="rounded-lg sm:rounded-2xl max-w-full h-auto shadow-md"
                  />
                )}
                {/* Text message */}
                <div
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed transition break-words ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {/* WhatsApp CTA Button - Show if last message contains CTA */}
          {messages.length > 0 && messages[messages.length - 1].content.includes("LANGKAH SELANJUTNYA") && (
            <div className="flex justify-center mt-2 sm:mt-4 px-2">
              <a
                href="https://wa.me/?text=Halo%20Tim%20Moxlite%2C%20Saya%20tertarik%20dengan%20rekomendasi%20lighting%20yang%20diberikan."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg transition-all hover:shadow-xl active:scale-95"
              >
                <span className="text-lg sm:text-xl"></span>
                <span>Hubungin Tim Sales</span>
              </a>
            </div>
          )}

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
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-white rounded-b-2xl flex-shrink-0 space-y-2 sm:space-y-3">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ketik pesan..."
              disabled={isLoading}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition disabled:opacity-50 font-medium text-sm flex-shrink-0"
            >
              ➤
            </button>
          </form>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] sm:text-xs bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition flex flex-col items-center justify-center gap-0.5 sm:gap-1 font-medium shadow-md"
              title="Upload sketsa design"
            >
              <span className="text-sm sm:text-base">📎</span>
              <span className="hidden sm:inline">Upload</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPDF}
              disabled={messages.length <= 1}
              className="text-[10px] sm:text-xs bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 sm:gap-1 font-medium shadow-md"
              title="Export quotation PDF"
            >
              <span className="text-sm sm:text-base">📄</span>
              <span>Export</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="text-[10px] sm:text-xs bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition flex flex-col items-center justify-center gap-0.5 sm:gap-1 font-medium shadow-md"
              title="Reset chat"
            >
              <span className="text-sm sm:text-base">🔄</span>
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
