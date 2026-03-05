/**
 * Chatbot Service - AI-powered Product Recommendations
 * Uses product knowledge base to provide intelligent responses
 */

import {
  searchProducts,
  getProductsBySeries,
  getProductsByBudget,
  getBestSellersBySeries,
  compareProducts,
  getRecommendations,
  formatPrice,
  getPriceRange,
  getAllProducts,
  getAllProductNames,
  getAllProductPrefixes,
  Product,
} from "./productKnowledgeBase";

// Chat message interface
export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

// User preferences interface
export interface UserPreferences {
  budget?: number;
  type?: "cust rental" | "cust project";
  useCase?: string;
  [key: string]: any;
}

/**
 * Call Chatbot API to generate response using Gemini
 */
export async function callGeminiAPI(userMessage: string, preferences: UserPreferences): Promise<string> {
  try {
    console.log("Calling /api/chatbot with Gemini 3 Flash Preview...");
    
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        budget: preferences.budget,
        type: preferences.type,
      }),
    });

    console.log("API Response Status:", response.status);

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error("Chatbot API Error - Status:", response.status);
      console.error("Chatbot API Error - Response:", responseText);
      return getDefaultResponse();
    }

    const data = await response.json();
    console.log("API Response received:", data.success ? "✅ Success" : "❌ Failed");

    if (data.success && data.response) {
      return data.response;
    }

    console.error("API returned error:", data.error);
    return getDefaultResponse();
  } catch (error) {
    console.error("Error calling Chatbot API:", error);
    return getDefaultResponse();
  }
}

/**
 * Main chatbot response generator
 * Uses Gemini API to generate intelligent responses
 */
export async function generateChatbotResponse(
  userMessage: string,
  preferences: UserPreferences
): Promise<string> {
  try {
    // Use Gemini API for intelligent responses
    const response = await callGeminiAPI(userMessage, preferences);
    return response || getDefaultResponse();
  } catch (error) {
    console.error("Error in generateChatbotResponse:", error);
    return getDefaultResponse();
  }
}

/**
 * Handle price inquiries
 */
function handlePriceInquiry(userMessage: string, preferences: UserPreferences): string {
  const searchResults = searchProducts(userMessage);

  if (searchResults.length === 0) {
    // Try to find product prefixes the user might be looking for
    const allPrefixes = getAllProductPrefixes();
    const messageWords = userMessage.toLowerCase().split(" ");
    
    const matchedPrefix = allPrefixes.find((prefix) =>
      messageWords.some((word) => prefix.toLowerCase().includes(word) || word.includes(prefix.toLowerCase()))
    );

    if (matchedPrefix) {
      // User mentioned a product prefix, search for it
      const fallbackResults = searchProducts(matchedPrefix);
      if (fallbackResults.length > 0) {
        let response = `💰 **Informasi Harga - ${matchedPrefix}**\n\n`;
        fallbackResults.slice(0, 5).forEach((product, index) => {
          response += `${index + 1}. **${product.model}**\n`;
          response += `   Spesifikasi: ${product.description}\n`;
          response += `   Harga: ${formatPrice(product.price)}\n\n`;
        });
        response += `ℹ️ Tips: Hubungi tim sales kami untuk penawaran khusus atau cicilan! 💼`;
        return response;
      }
    }

    // If still no results, show available product list
    return `📍 Produk yang Anda cari tidak ditemukan.

**Coba cari salah satu produk ini:**

🔴 **Laser Series:**
• HADES VI, HADES X, HADES XX, HADES XXX, HADES IP

💡 **Moving Light Series:**
• AMOS, AMOS PLUS, AMOS PRO
• ARES, ARES PLUS
• SCARLET, SCARLET PLUS, SCARLET HYBRID, IP SCARLET HYBRID

🌊 **Moving Wash Series:**
• HERA LITE, MEDUSA LITE, IP MEDUSA LITE
• MEDUSA, MEDUSA PLUS, IP MEDUSA PLUS, IP MEDUSA PRO

✨ **SFX Series:**
• SPARKY, FLAME, BUBBLE FOG MACHINE
• CO2 BARREL, CO2 SHOT, CO2 GUN
• CONFETTI GUN, CONFETTI BLASTER

Coba tanyakan: "Harga AMOS" atau "Berapa SCARLET?" 😊`;
  }

  let response = `💰 **Informasi Harga Produk**\n\n`;

  searchResults.slice(0, 5).forEach((product, index) => {
    response += `${index + 1}. **${product.model}**\n`;
    response += `   Spesifikasi: ${product.description}\n`;
    response += `   Harga: ${formatPrice(product.price)}\n\n`;
  });

  response += `ℹ️ Tips: Hubungi tim sales kami untuk mendapatkan penawaran khusus! 💼`;

  return response;
}

/**
 * Handle product advantages inquiry
 */
function handleAdvantagesInquiry(userMessage: string, preferences: UserPreferences): string {
  const searchResults = searchProducts(userMessage);

  if (searchResults.length === 0) {
    // Try product prefix matching for better results
    const allPrefixes = getAllProductPrefixes();
    const messageWords = userMessage.toLowerCase().split(" ");
    
    const matchedPrefix = allPrefixes.find((prefix) =>
      messageWords.some((word) => prefix.toLowerCase().includes(word) || word.includes(prefix.toLowerCase()))
    );

    if (matchedPrefix) {
      const fallbackResults = searchProducts(matchedPrefix);
      if (fallbackResults.length > 0) {
        return handleAdvantagesInquiry(matchedPrefix, preferences);
      }
    }

    return `Maaf, saya belum bisa menemukan produk spesifik yang Anda tanyakan.

**Coba tanyakan tentang produk ini:**

🔴 **Laser:** HADES VI, HADES X, HADES XX, HADES XXX
💡 **Moving Light:** AMOS, ARES, SCARLET (dengan variannya)
🌊 **Moving Wash:** MEDUSA, HERA (dengan variannya)
✨ **SFX:** SPARKY, CO2 GUN, CONFETTI, FLAME

Contoh: "Apa kelebihan AMOS?" atau "Keunggulan SCARLET HYBRID?" 🤔`;
  }

  const product = searchResults[0];
  let response = `📊 **Keunggulan ${product.model}**\n\n`;

  response += `**Spesifikasi:**\n${product.description}\n\n`;

  // Add advantages based on product type
  if (product.series === "Laser") {
    response += `✨ **Keunggulan Laser Series:**\n`;
    response += `• Performa laser yang powerful untuk audience besar\n`;
    response += `• Efek visual yang stunning dan modern\n`;
    response += `• Cocok untuk konser, festival, dan acara skala besar\n`;
    response += `• Presisi tinggi dengan kontrol penuh\n\n`;
  } else if (product.series === "Moving Light") {
    response += `✨ **Keunggulan Moving Light Series:**\n`;
    response += `• Beam sharp dan fokus untuk pencahayaan presisi\n`;
    response += `• BSW/LED dengan color mixing untuk kreativitas unlimited\n`;
    response += `• Cocok untuk theater, concert, dan special events\n`;
    response += `• Efisiensi energi optimal dengan hasil maksimal\n\n`;
  } else if (product.series === "Moving Wash") {
    response += `✨ **Keunggulan Moving Wash Series:**\n`;
    response += `• Coverage area luas untuk wash general lighting\n`;
    response += `• B-Eye effect untuk dynamic visual effects\n`;
    response += `• Ideal untuk venue, club, dan general stage wash\n`;
    response += `• Smooth color transitions dan smooth dimming\n\n`;
  } else if (product.series === "SFX") {
    response += `✨ **Keunggulan SFX Series:**\n`;
    response += `• Efek dramatis untuk highlight moment di event\n`;
    response += `• CO2, Confetti, Flame - lengkap untuk setiap occasion\n`;
    response += `• Aman dan mudah dioperasikan\n`;
    response += `• Menciptakan wow factor yang memorable\n\n`;
  }

  // Price comparison with series
  const seriesProducts = getProductsBySeries(product.series);
  if (seriesProducts.length > 1) {
    const priceRange = getPriceRange(product.series);
    response += `💰 **Range Harga ${product.series}:**\n`;
    response += `• Mulai dari: ${formatPrice(priceRange.min)}\n`;
    response += `• Hingga: ${formatPrice(priceRange.max)}\n`;
    response += `• Rata-rata: ${formatPrice(priceRange.avg)}\n\n`;
  }

  response += `❓ Ada pertanyaan lain yang bisa kami bantu? 😊`;

  return response;
}

/**
 * Handle comparison inquiry
 */
function handleComparisonInquiry(userMessage: string, preferences: UserPreferences): string {
  let searchResults = searchProducts(userMessage);

  // If search doesn't find enough products, try extracting product names manually
  if (searchResults.length < 2) {
    // Get all product prefixes and search for them in the message
    const allPrefixes = getAllProductPrefixes();
    const lowerMessage = userMessage.toLowerCase();
    
    const foundProducts: Product[] = [];
    allPrefixes.forEach((prefix) => {
      if (lowerMessage.includes(prefix.toLowerCase())) {
        const results = searchProducts(prefix);
        if (results.length > 0) {
          foundProducts.push(results[0]); // Get first result for each prefix
        }
      }
    });

    if (foundProducts.length >= 2) {
      return generateComparisonResponse(foundProducts, "");
    }

    // Try to get best sellers for comparison by series
    const series = ["Laser", "Moving Light", "Moving Wash", "SFX"].find((s) =>
      userMessage.toLowerCase().includes(s.toLowerCase())
    );

    if (series) {
      const bestSellers = getBestSellersBySeries(series, 3);
      return generateComparisonResponse(bestSellers, series);
    }

    return `Untuk membandingkan produk, silakan sebutkan nama produk yang ingin dibandingkan.

Misalnya:
• "Bandingkan AMOS vs ARES"
• "Beda AMOS dan SCARLET apa?"
• "Mana yang bagus ARES atau SCARLET?"
• "MEDUSA mana yang lebih bagus?"

Apa yang ingin Anda bandingkan? 🤔`;
  }

  return generateComparisonResponse(searchResults.slice(0, 3), "");
}

/**
 * Generate detailed comparison response
 */
function generateComparisonResponse(products: Product[], category: string): string {
  if (products.length === 0) return "Produk tidak ditemukan.";

  let response = `📊 **Perbandingan ${category || "Produk"} Moxlite**\n\n`;

  // Create comparison table
  response += `| Model | Spesifikasi | Harga |\n`;
  response += `|-------|-----------|-------|\n`;

  products.forEach((product) => {
    response += `| ${product.model} | ${product.description} | ${formatPrice(product.price)} |\n`;
  });

  response += `\n💡 **Analisis:**\n`;

  // Price analysis
  const prices = products.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const bestValue = products.find((p) => p.price === minPrice);
  const premium = products.find((p) => p.price === maxPrice);

  response += `\n💰 **Harga:**\n`;
  response += `• Paling ekonomis: ${bestValue?.model} (${formatPrice(minPrice)})\n`;
  response += `• Paling premium: ${premium?.model} (${formatPrice(maxPrice)})\n`;
  response += `• Selisih harga: ${formatPrice(maxPrice - minPrice)}\n`;

  // Add feature-based recommendation
  response += `\n🎯 **Analisis Fitur:**\n`;
  products.forEach((product) => {
    const hasLED = product.description.toLowerCase().includes("led");
    const hasLamp = product.description.toLowerCase().includes("lamp");
    const hasWaterproof = product.description.toLowerCase().includes("waterproof");
    const hasCMY = product.description.toLowerCase().includes("cmy");
    const hasFraming = product.description.toLowerCase().includes("framing");
    
    let features = [];
    if (hasLED) features.push("💡 LED");
    if (hasLamp) features.push("🔦 Lamp");
    if (hasCMY) features.push("🎨 CMY Color");
    if (hasFraming) features.push("🖼️ Framing");
    if (hasWaterproof) features.push("💧 Waterproof");
    
    response += `• ${product.model}: ${features.length > 0 ? features.join(" | ") : "Fitur standar"}\n`;
  });

  response += `\n📈 **Rekomendasi Berdasarkan Kebutuhan:**\n`;
  if (bestValue) {
    response += `💰 **Budget terbatas?** → ${bestValue.model} (${formatPrice(bestValue.price)})\n`;
  }
  if (products.length > 1) {
    const midOption = products[Math.floor(products.length / 2)];
    response += `⚖️ **Keseimbangan Harga-Performa?** → ${midOption.model} (${formatPrice(midOption.price)})\n`;
  }
  if (premium) {
    response += `👑 **Performa Terbaik?** → ${premium.model} (${formatPrice(premium.price)})\n`;
  }

  response += `\n💡 **Kesimpulan:** Pilih berdasarkan kebutuhan Anda - apakah prioritas budget, fitur lengkap, atau performa maksimal?\n`;
  response += `❓ Tanyakan lebih detail tentang produk mana yang cocok untuk kebutuhan Anda! 😊`;

  return response;
}

/**
 * Handle product search
 */
function handleProductSearch(userMessage: string, preferences: UserPreferences): string {
  const searchResults = searchProducts(userMessage);

  if (searchResults.length === 0) {
    // Try product prefix matching
    const allPrefixes = getAllProductPrefixes();
    const messageWords = userMessage.toLowerCase().split(" ");
    
    const matchedPrefix = allPrefixes.find((prefix) =>
      messageWords.some((word) => prefix.toLowerCase().includes(word) || word.includes(prefix.toLowerCase()))
    );

    if (matchedPrefix) {
      const fallbackResults = searchProducts(matchedPrefix);
      if (fallbackResults.length > 0) {
        return handleProductSearch(matchedPrefix, preferences);
      }
    }

    return `❌ Produk tidak ditemukan.

**Coba cari dari kategori berikut:**

🔴 **Laser Series:**
• HADES VI, HADES X, HADES XX, HADES XXX, HADES IP
• "Cari laser" atau "Produk laser apa"

💡 **Moving Light Series:**
• AMOS, AMOS PLUS, AMOS PRO
• ARES, ARES PLUS
• SCARLET, SCARLET PLUS, SCARLET HYBRID
• "Cari AMOS" atau "Produk moving light"

🌊 **Moving Wash Series:**
• HERA LITE, MEDUSA LITE, MEDUSA, MEDUSA PLUS
• "Cari MEDUSA" atau "Moving wash apa"

✨ **SFX Series:**
• SPARKY, FLAME, BUBBLE FOG, CO2, CONFETTI
• "Cari SFX" atau "Produk special effect"

Kategori apa yang Anda cari? 🔍`;
  }

  let response = `✅ **Hasil Pencarian Produk**\n\n`;
  response += `Ditemukan ${searchResults.length} produk:\n\n`;

  searchResults.slice(0, 5).forEach((product, index) => {
    response += `${index + 1}. **${product.model}**\n`;
    response += `   📍 ${product.series}\n`;
    response += `   📝 ${product.description}\n`;
    response += `   💰 ${formatPrice(product.price)}\n\n`;
  });

  if (searchResults.length > 5) {
    response += `... dan ${searchResults.length - 5} produk lainnya\n\n`;
  }

  response += `🎯 Ingin tahu lebih detail tentang produk tertentu? Tanyakan keunggulan, harga, atau bandingkan dengan produk lain! 😊`;

  return response;
}

/**
 * Handle use case recommendations
 */
function handleUseCaseInquiry(userMessage: string, preferences: UserPreferences): string {
  const recommendations = getRecommendations(userMessage);

  if (recommendations.length === 0) {
    return `Saya ingin membantu merekomendasikan produk yang tepat untuk kebutuhan Anda.

Silakan sebutkan jenis event atau kebutuhan Anda:
• Concert / Konser
• Club / Bar
• Wedding / Pernikahan
• Event / Acara umum
• Outdoor / Panggung Outdoor
• Pemula / Beginner

Apa kebutuhan Anda? 🎯`;
  }

  let response = `🎯 **Rekomendasi Produk untuk Kebutuhan Anda**\n\n`;

  recommendations.slice(0, 4).forEach((product, index) => {
    response += `${index + 1}. **${product.model}**\n`;
    response += `   Spesifikasi: ${product.description}\n`;
    response += `   Harga: ${formatPrice(product.price)}\n\n`;
  });

  response += `💡 **Mengapa produk ini cocok:**\n`;
  response += `• Performa terbukti untuk kebutuhan spesifik Anda\n`;
  response += `• ROI optimal dengan fitur yang relevan\n`;
  response += `• Dukungan service purna jual terbaik dari kami\n\n`;

  response += `📞 Hubungi tim sales kami untuk konsultasi lebih detail dan penawaran khusus! 🚀`;

  return response;
}

/**
 * Handle budget-based recommendation
 */
function handleBudgetBasedRecommendation(budget: number, preferences: UserPreferences): string {
  const products = getProductsByBudget(0, budget);

  if (products.length === 0) {
    return `Maaf, budget Rp ${(budget / 1000000).toLocaleString("id-ID")} juta belum mencukupi untuk produk kami yang termurah.

Produk kami dimulai dari Rp ${formatPrice(getAllProducts().reduce((min, p) => Math.min(min, p.price), Infinity))}.

Silakan tingkatkan budget atau hubungi tim sales kami untuk opsi cicilan/leasing! 💼`;
  }

  let response = `✨ **Rekomendasi Produk untuk Budget Rp ${(budget / 1000000).toLocaleString("id-ID")} Juta**\n\n`;

  // Categorize by value
  const bestValue = products.sort((a, b) => b.price - a.price)[0]; // Best specs per budget
  const mostAffordable = products.sort((a, b) => a.price - b.price)[0]; // Cheapest

  response += `🏆 **Pilihan Terbaik (Best Value):**\n`;
  response += `• ${bestValue.model}\n`;
  response += `• Spesifikasi: ${bestValue.description}\n`;
  response += `• Harga: ${formatPrice(bestValue.price)}\n\n`;

  response += `💰 **Pilihan Ekonomis:**\n`;
  response += `• ${mostAffordable.model}\n`;
  response += `• Spesifikasi: ${mostAffordable.description}\n`;
  response += `• Harga: ${formatPrice(mostAffordable.price)}\n\n`;

  // Show series breakdown
  const allSeries = new Set(products.map((p) => p.series));
  response += `📊 **Kategori Tersedia:**\n`;
  Array.from(allSeries).forEach((series) => {
    const count = products.filter((p) => p.series === series).length;
    response += `• ${series} (${count} pilihan)\n`;
  });

  response += `\n💡 **Tips Memilih:**\n`;
  response += `${preferences.type === "cust rental" ? `• Mode Rental: Pilih produk yang populer untuk ROI tinggi\n` : `• Mode Project: Pilih sesuai kebutuhan spesifik event Anda\n`}`;
  response += `• Hubungi sales untuk konsultasi gratis dan penawaran spesial! 🎯\n`;
  response += `• Ada opsi cicilan dan leasing untuk kemudahan Anda 📞`;

  return response;
}

/**
 * Greeting message
 */
export function getGreetingMessage(): ChatMessage {
  return {
    id: "greeting-" + Date.now(),
    type: "bot",
    content: getDefaultResponse(),
    timestamp: new Date(),
  };
}

/**
 * Default response
 */
function getDefaultResponse(): string {
  return `👋 **Selamat Datang di Moxlite AI Assistant!**

Saya siap membantu Anda menemukan solusi lighting yang sempurna.

**Apa yang bisa saya bantu?**

🎯 **Tanyakan tentang:**
• 💰 **Harga** - "Berapa harga AMOS?" atau "Produk di bawah 15 juta?"
• 🌟 **Keunggulan produk** - "Apa kelebihan SCARLET HYBRID?"
• 📊 **Perbandingan** - "Bandingkan AMOS vs ARES"
• 🔍 **Produk spesifik** - "Cari produk Laser" atau "Apa itu MEDUSA?"
• 🎪 **Rekomendasi** - "Produk untuk concert" atau "Untuk wedding apa?"

📋 **Atau mulai dengan:**
1️⃣ Pilih tipe: **Rental/Sewa** atau **Project/Pembelian**
2️⃣ Sebutkan budget dalam juta rupiah
3️⃣ Biarkan kami rekomendasikan solusi terbaik!

**Kategori Produk Kami:**
🔴 Laser - Performanya tinggi untuk skala besar
💡 Moving Light - Beam & Wash profesional
🌊 Moving Wash - Coverage luas & efek dinamis
✨ SFX - Special effects untuk wow moment

Mari mulai! Apa yang bisa kami rekomendasikan untuk Anda hari ini? 🚀`;
}
