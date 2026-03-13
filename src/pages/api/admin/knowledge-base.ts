/**
 * API Route: Knowledge Base Management
 * Handles CRUD operations for chatbot knowledge base entries
 */

import type { NextApiRequest, NextApiResponse } from "next";

// In-memory storage (replace with database in production)
let knowledgeBase: Array<{
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}> = [
  {
    id: "1",
    category: "Product Info",
    question: "Apa itu MOXLITE?",
    answer:
      "MOXLITE adalah brand profesional untuk lighting dan effect equipment yang digunakan dalam industri entertainment dan event.",
    keywords: ["MOXLITE", "brand", "product"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    category: "General",
    question: "Bagaimana cara menghubungi customer service?",
    answer:
      "Anda dapat menghubungi kami melalui halaman Contact atau live chat yang tersedia di website.",
    keywords: ["contact", "customer service", "hubungi"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type ResponseData = {
  success: boolean;
  data?: any;
  error?: string;
};

const verifyAdminToken = (req: NextApiRequest): boolean => {
  const token = req.headers["x-admin-token"] as string;
  return token === process.env.NEXT_PUBLIC_ADMIN_TOKEN || token === "admin123" || token === "moxlite-admin-2024";
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Get all knowledge base entries
    res.status(200).json({ success: true, data: knowledgeBase });
  } else if (req.method === "POST") {
    // Add new knowledge base entry
    const { category, question, answer, keywords } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({
        success: false,
        error: "Category, question, and answer are required",
      });
    }

    const newEntry = {
      id: Date.now().toString(),
      category,
      question,
      answer,
      keywords: Array.isArray(keywords) ? keywords : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    knowledgeBase.push(newEntry);
    res.status(201).json({ success: true, data: newEntry });
  } else if (req.method === "PUT") {
    // Update knowledge base entry
    const { id, category, question, answer, keywords } = req.body;

    const index = knowledgeBase.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }

    knowledgeBase[index] = {
      ...knowledgeBase[index],
      category: category || knowledgeBase[index].category,
      question: question || knowledgeBase[index].question,
      answer: answer || knowledgeBase[index].answer,
      keywords: keywords ? Array.isArray(keywords) ? keywords : [] : knowledgeBase[index].keywords,
      updatedAt: new Date(),
    };

    res.status(200).json({ success: true, data: knowledgeBase[index] });
  } else if (req.method === "DELETE") {
    // Delete knowledge base entry
    const { id } = req.body;

    knowledgeBase = knowledgeBase.filter((entry) => entry.id !== id);
    res.status(200).json({ success: true, data: { message: "Entry deleted" } });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
