// Daftar produk yang tersedia
const PRODUCTS = [
  "studio basic",
  "studio basic plus",
  "holystrom",
  "berlin",
  "parled",
  "optic",
  "amos",
  "ares",
];

// Interface untuk chat message
export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

// Interface untuk user preferences
export interface UserPreferences {
  budget?: number;
  type?: "cust rental" | "cust project";
  [key: string]: any;
}

/**
 * Generate dummy response berdasarkan budget dan tipe user
 */
export function generateChatbotResponse(
  userMessage: string,
  preferences: UserPreferences
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Response untuk budget inquiry
  if (
    lowerMessage.includes("budget") ||
    lowerMessage.includes("harga") ||
    /\d+/.test(userMessage)
  ) {
    const budgetMatch = userMessage.match(/\d+/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[0]);
      return generateBudgetBasedResponse(budget, preferences.type);
    }
  }

  // Response untuk tanyakan tipe customer
  if (
    lowerMessage.includes("rental") ||
    lowerMessage.includes("sewa") ||
    lowerMessage.includes("cust rental")
  ) {
    return generateTypeBasedResponse("cust rental", preferences.budget);
  }

  if (
    lowerMessage.includes("project") ||
    lowerMessage.includes("pembelian") ||
    lowerMessage.includes("beli") ||
    lowerMessage.includes("membeli") ||
    lowerMessage.includes("cust project")
  ) {
    return generateTypeBasedResponse("cust project", preferences.budget);
  }

  // Response default
  return getDefaultResponse();
}

/**
 * Generate response berdasarkan budget
 */
function generateBudgetBasedResponse(
  budget: number,
  type?: string
): string {
  let typeText = "kebutuhan";
  if (type === "cust rental") {
    typeText = "sewa/rental";
  } else if (type === "cust project") {
    typeText = "project";
  }

  if (budget < 1000000) {
    return `Untuk budget Rp ${budget.toLocaleString("id-ID")} Juta dengan ${typeText}:

💡 Rekomendasi Produk:

✓ Studio Basic
✓ Studio Basic Plus

Produk ini sangat cocok untuk kebutuhan dasar dengan harga terjangkau dan performa handal. Sempurna untuk pemula! 🎯`;
  } else if (budget < 5000000) {
    return `Untuk budget Rp ${budget.toLocaleString("id-ID")} Juta dengan ${typeText}:

💡 Rekomendasi Produk:

✓ Berlin
✓ Parled

Produk ini menawarkan fitur lengkap dengan kualitas premium dan harga yang kompetitif. Great choice! ⭐`;
  } else if (budget < 10000000) {
    return `Untuk budget Rp ${budget.toLocaleString("id-ID")} Juta dengan ${typeText}:

💡 Rekomendasi Produk:

✓ Optic
✓ Amos

Produk ini adalah pilihan terbaik untuk profesional dengan teknologi terkini dan performa maksimal. Excellent! 🚀`;
  } else {
    return `Untuk budget Rp ${budget.toLocaleString("id-ID")} Juta dengan ${typeText}:

💡 Rekomendasi Produk:

✓ Ares
✓ Holystrom

Produk flagship kami dengan teknologi paling canggih, sempurna untuk kebutuhan enterprise dan project berskala besar. Premium quality! 👑`;
  }
}

/**
 * Generate response berdasarkan tipe customer (cust rental / cust project)
 */
function generateTypeBasedResponse(type: string, budget?: number): string {
  let typeLabel = "";
  if (type === "cust rental") {
    typeLabel = "Sewa/Rental (Membeli & Kami Rentalkan)";
  } else if (type === "cust project") {
    typeLabel = "Project (Kebutuhan Project Anda)";
  }

  if (budget) {
    return generateBudgetBasedResponse(budget, type);
  }

  return `Terima kasih! Anda memilih ${typeLabel}.

🔹 Kami menyediakan berbagai pilihan lighting dari harga terjangkau hingga premium.

Berapa budget yang Anda siapkan?
Silakan inputkan nominal angka (dalam juta Rupiah) agar kami bisa merekomendasikan produk yang paling sesuai. ✨`;
}

/**
 * Response default
 */
function getDefaultResponse(): string {
  return `Halo! 👋 Selamat datang di Moxlite Lighting Recommendation System.

Saya siap membantu Anda menemukan lampu yang sempurna untuk kebutuhan Anda!

Untuk memulai, silakan ceritakan:

1️⃣  Customer Rental
    Membeli dari kami & kami rentalkan untuk Anda

2️⃣  Customer Project
    Membeli untuk kebutuhan project Anda

3️⃣  Budget yang Anda siapkan?
    Inputkan angka dalam juta Rupiah

Jangan ragu untuk bertanya! 😊`;
}

/**
 * Greeting message untuk chat awal
 */
export function getGreetingMessage(): ChatMessage {
  return {
    id: "greeting-" + Date.now(),
    type: "bot",
    content: getDefaultResponse(),
    timestamp: new Date(),
  };
}
