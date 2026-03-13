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
  const [userTypeSelected, setUserTypeSelected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>("");
  const messageCountRef = useRef<number>(0);
  const sessionStartRef = useRef<Date>(new Date());

  // Initialize and track session
  useEffect(() => {
    if (isOpen) {
      // Session started
      sessionStartRef.current = new Date();
      sessionIdRef.current = `session-${Date.now()}`;
      messageCountRef.current = 0;

      // Track session start
      const trackSessionStart = async () => {
        try {
          // Get user location from IP
          const geoResponse = await fetch(
            "https://ipapi.co/json/",
            { method: "GET" }
          ).catch(() => null);
          
          let geoData: any = {};
          if (geoResponse) {
            geoData = await geoResponse.json();
          }

          // Send session start to analytics
          const res = await fetch("/api/admin/chatbot-analytics?action=add-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "moxlite-admin-2024",
            },
            body: JSON.stringify({
              sessionStart: new Date().toISOString(),
              country: geoData.country_name || "Unknown",
              city: geoData.city || "Unknown",
              region: geoData.region || "Unknown",
              userType: preferences.type || "unknown",
            }),
          }).catch((err) => {
            console.log("Analytics tracking (non-critical):", err);
            return null;
          });

          if (res?.ok) {
            const data = await res.json();
            if (data.data?.id) {
              sessionIdRef.current = data.data.id;
            }
          }
        } catch (error) {
          console.log("Analytics error (non-critical):", error);
        }
      };

      trackSessionStart();
    } else {
      // Session ended - send session end
      if (sessionIdRef.current) {
        const trackSessionEnd = async () => {
          try {
            await fetch("/api/admin/chatbot-analytics?action=update-session", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "moxlite-admin-2024",
              },
              body: JSON.stringify({
                sessionId: sessionIdRef.current,
                messageCount: messageCountRef.current,
                sessionEnd: new Date().toISOString(),
              }),
            }).catch((err) => {
              console.log("Analytics tracking (non-critical):", err);
            });
          } catch (error) {
            console.log("Analytics error (non-critical):", error);
          }
        };

        trackSessionEnd();
      }
    }
  }, [isOpen, preferences.type]);

  // Auto scroll ke bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-save questions to knowledge base
  const saveToKnowledgeBase = async (
    question: string,
    answer: string
  ) => {
    // Determine category based on keywords
    const lowerQuestion = question.toLowerCase();
    let category = "General";

    if (
      lowerQuestion.includes("harga") ||
      lowerQuestion.includes("biaya") ||
      lowerQuestion.includes("price")
    ) {
      category = "Pricing";
    } else if (
      lowerQuestion.includes("spesifikasi") ||
      lowerQuestion.includes("spec") ||
      lowerQuestion.includes("fitur")
    ) {
      category = "Product Specs";
    } else if (
      lowerQuestion.includes("rental") ||
      lowerQuestion.includes("sewa")
    ) {
      category = "Rental Info";
    } else if (
      lowerQuestion.includes("project") ||
      lowerQuestion.includes("projek")
    ) {
      category = "Project Services";
    } else if (
      lowerQuestion.includes("garansi") ||
      lowerQuestion.includes("warranty")
    ) {
      category = "Warranty & Support";
    } else if (
      lowerQuestion.includes("kontak") ||
      lowerQuestion.includes("hubungi")
    ) {
      category = "Contact";
    }

    // Extract keywords (simple word extraction)
    const words = question
      .toLowerCase()
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 3 && !["yang", "dari", "untuk", "dengan", "pada"].includes(word)
      )
      .slice(0, 5);

    // Call knowledge base API to save
    await fetch("/api/admin/knowledge-base", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "moxlite-admin-2024",
      },
      body: JSON.stringify({
        category,
        question: question.trim(),
        answer: answer.trim(),
        keywords: [...new Set(words)], // Remove duplicates
      }),
    }).catch((err) => {
      console.log("KB save failed:", err);
    });
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Increment message count for analytics
    messageCountRef.current += 1;

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

      // Auto-save user question to knowledge base (non-blocking)
      try {
        await saveToKnowledgeBase(inputValue, botResponse);
      } catch (error) {
        console.log("KB save error (non-critical):", error);
      }
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
      
      // Track upload usage
      if (sessionIdRef.current) {
        try {
          await fetch("/api/admin/chatbot-analytics?action=update-session", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "moxlite-admin-2024",
            },
            body: JSON.stringify({
              sessionId: sessionIdRef.current,
              usedUpload: true,
            }),
          }).catch((err) => {
            console.log("Analytics tracking (non-critical):", err);
          });
        } catch (error) {
          console.log("Analytics error (non-critical):", error);
        }
      }
      
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
          const apiBaseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_FE_BASE_URL || 'http://localhost:3000';
          const chatbotUrl = `${apiBaseUrl}/api/chatbot`;
          const response = await fetch(chatbotUrl, {
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

  const handleExportPDF = async () => {
    generateQuotationPDF({
      messages,
      preferences,
      recommendations: [],
    });
    
    // Track export usage
    if (sessionIdRef.current) {
      try {
        await fetch("/api/admin/chatbot-analytics?action=update-session", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "moxlite-admin-2024",
          },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            usedExport: true,
          }),
        }).catch((err) => {
          console.log("Analytics tracking (non-critical):", err);
        });
      } catch (error) {
        console.log("Analytics error (non-critical):", error);
      }
    }
  };

  // Handle user type selection
  const handleUserTypeSelection = (type: "cust rental" | "cust project") => {
    setPreferences((prev) => ({ ...prev, type }));
    setUserTypeSelected(true);
    setMessages([getGreetingMessage()]);
  };

  const handleResetChat = () => {
    setUserTypeSelected(false);
    setMessages([getGreetingMessage()]);
    setPreferences({});
  };

  if (!isOpen) return null;

  // User Type Selection Screen
  if (!userTypeSelected) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center md:justify-end p-2 sm:p-4 md:p-6">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Selection Box */}
        <div className="relative w-full h-auto sm:h-auto md:w-[440px] bg-white rounded-2xl shadow-2xl flex flex-col z-[110] overflow-hidden max-h-[95vh] p-6 sm:p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl transition"
          >
            ✕
          </button>

          {/* Header */}
          <div className="text-center mb-8 mt-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Moxlite Assistant</h2>
            <p className="text-gray-600 mb-2">Selamat datang! 👋</p>
            <p className="text-sm text-gray-500">Pilih jenis layanan Anda untuk mendapatkan rekomendasi yang tepat</p>
          </div>

          {/* Selection Buttons */}
          <div className="space-y-3 mb-6">
            {/* Rental Option */}
            <button
              onClick={() => handleUserTypeSelection("cust rental")}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#667eea] hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition group flex items-start gap-4"
            >
              <div className="text-3xl">🏪</div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800 group-hover:text-[#667eea] transition text-lg mb-1">
                  Rental Lampu
                </h3>
                <p className="text-sm text-gray-600">
                  Sewa peralatan lighting untuk event atau acara Anda
                </p>
              </div>
              <div className="text-xl group-hover:text-[#667eea] transition">→</div>
            </button>

            {/* Project Option */}
            <button
              onClick={() => handleUserTypeSelection("cust project")}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#764ba2] hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition group flex items-start gap-4"
            >
              <div className="text-3xl">🎬</div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-800 group-hover:text-[#764ba2] transition text-lg mb-1">
                  Project Khusus
                </h3>
                <p className="text-sm text-gray-600">
                  Konsultasi dan solusi custom untuk project instalasi tetap
                </p>
              </div>
              <div className="text-xl group-hover:text-[#764ba2] transition">→</div>
            </button>
          </div>

          {/* Footer Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 text-sm text-gray-600 border border-purple-100">
            <p className="font-semibold text-gray-700 mb-1">💡 Tips</p>
            <p>Pemilihan ini membantu kami memberikan rekomendasi produk dan harga yang paling sesuai dengan kebutuhan Anda.</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center md:justify-end p-2 sm:p-4 md:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Chat Box - Responsive Design */}
      <div className="relative w-full h-[calc(100vh-1rem)] sm:h-[680px] md:w-[440px] md:h-[720px] bg-white rounded-2xl shadow-2xl flex flex-col z-[110] overflow-hidden max-h-[95vh]">
        {/* Gradient Background Header - Purple Theme */}
        <div className="relative bg-gradient-to-r from-[#667eea] via-[#667eea] to-[#764ba2] text-white p-3 sm:p-5 rounded-t-2xl flex justify-between items-start flex-shrink-0">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Moxlite Assistant</h3>
                <p className="text-xs sm:text-sm text-purple-100">
                  {preferences.type === "cust rental" ? "🏪 Rental Mode" : "🎬 Project Mode"}
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-2 items-center flex-shrink-0">
            <button
              onClick={handleResetChat}
              className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition text-sm sm:text-base"
              title="Ubah jenis layanan"
            >
              🔄
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition flex-shrink-0"
            >
              ✕
            </button>
          </div>
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
                      ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-br-none shadow-md"
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
                  <div className="w-2 h-2 bg-[#667eea] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#667eea] rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                  <div className="w-2 h-2 bg-[#667eea] rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
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
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent disabled:bg-gray-100 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5568d3] hover:to-[#653a8a] text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition disabled:opacity-50 font-medium text-sm flex-shrink-0"
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
              className="text-[10px] sm:text-xs bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:from-[#5568d3] hover:to-[#653a8a] text-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 sm:gap-1 font-medium shadow-md"
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
