import { jsPDF } from "jspdf";
import { ChatMessage, UserPreferences } from "./chatbotService";

interface QuotationData {
  messages: ChatMessage[];
  preferences: UserPreferences;
  recommendations: string[];
}

/**
 * Generate PDF Quotation dari chat recommendations
 */
export function generateQuotationPDF(data: QuotationData): void {
  const doc = new jsPDF();

  // Set font
  doc.setFont("helvetica");

  // Header
  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210);
  doc.text("MOXLITE LIGHTING", 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Sistem Rekomendasi Lampu Profesional", 20, 28);

  // Title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("QUOTATION PURCHASING", 20, 45);

  // Date
  const currentDate = new Date().toLocaleDateString("id-ID");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Tanggal: ${currentDate}`, 20, 55);

  let yPosition = 70;

  // Budget & Type Info
  doc.setFontSize(11);
  doc.setTextColor(25, 118, 210);
  doc.text("INFORMASI CUSTOMER", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  if (data.preferences.budget) {
    doc.text(
      `Budget: Rp ${(data.preferences.budget || 0).toLocaleString("id-ID")}`,
      20,
      yPosition
    );
    yPosition += 7;
  }

  if (data.preferences.type) {
    let typeLabel = "";
    if (data.preferences.type === "cust rental") {
      typeLabel = "Customer Rental (Membeli & Kami Rentalkan)";
    } else if (data.preferences.type === "cust project") {
      typeLabel = "Customer Project (Untuk Kebutuhan Project)";
    }
    doc.text(`Tipe Customer: ${typeLabel}`, 20, yPosition);
    yPosition += 10;
  }

  // Recommendations Section
  doc.setFontSize(11);
  doc.setTextColor(25, 118, 210);
  doc.text("REKOMENDASI PRODUK KAMI", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // Extract recommendations dari last bot message
  const lastBotMessage = data.messages
    .reverse()
    .find((msg) => msg.type === "bot");

  if (lastBotMessage) {
    const splitText = doc.splitTextToSize(lastBotMessage.content, 170);
    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * 5 + 10;
  }

  // Chat History
  doc.setFontSize(11);
  doc.setTextColor(25, 118, 210);
  doc.text("HISTORI KONSULTASI", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const chatHistory = data.messages.slice(1); // Skip greeting
  for (const msg of chatHistory) {
    const prefix = msg.type === "user" ? "Anda: " : "Moxlite: ";
    const splitText = doc.splitTextToSize(prefix + msg.content, 170);

    if (msg.type === "user") {
      doc.setTextColor(25, 118, 210);
    } else {
      doc.setTextColor(100, 100, 100);
    }

    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * 4 + 3;

    // Check if need new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("www.moxlite.com | info@moxlite.com", 20, doc.internal.pageSize.height - 15);

  // Generate filename dengan timestamp
  const fileName = `Moxlite-Quotation-${Date.now()}.pdf`;

  // Download PDF
  doc.save(fileName);
}
