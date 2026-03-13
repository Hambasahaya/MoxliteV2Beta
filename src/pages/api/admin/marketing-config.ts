/**
 * API Route: Marketing Configuration
 * Handles CRUD operations for recommendation rules and marketing settings
 */

import type { NextApiRequest, NextApiResponse } from "next";

export interface BudgetRange {
  id: string;
  minBudget: number;
  maxBudget: number;
  name: string;
  description: string;
}

export interface ProductRecommendation {
  id: string;
  budgetRangeId: string;
  userType: "rental" | "project";
  productNo: number;
  productName: string;
  reason: string;
  priority: number; // 1 = highest priority (shown first)
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketingTip {
  id: string;
  userType: "rental" | "project";
  title: string;
  content: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
let budgetRanges: BudgetRange[] = [
  {
    id: "budget-1",
    minBudget: 0,
    maxBudget: 10000000,
    name: "Entry Level",
    description: "Cocok untuk pemula atau event skala kecil",
  },
  {
    id: "budget-2",
    minBudget: 10000000,
    maxBudget: 30000000,
    name: "Mid Range",
    description: "Untuk event medium atau upgrade dari entry",
  },
  {
    id: "budget-3",
    minBudget: 30000000,
    maxBudget: 100000000,
    name: "Professional",
    description: "Untuk event besar atau venue profesional",
  },
  {
    id: "budget-4",
    minBudget: 100000000,
    maxBudget: Infinity,
    name: "Premium",
    description: "Setup profesional dengan equipment terbaik",
  },
];

let productRecommendations: ProductRecommendation[] = [
  {
    id: "rec-1",
    budgetRangeId: "budget-1",
    userType: "rental",
    productNo: 1,
    productName: "MOXLITE AMOS",
    reason: "Entry level beam light, cocok untuk starting rental bisnis",
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "rec-2",
    budgetRangeId: "budget-2",
    userType: "project",
    productNo: 45,
    productName: "MOXLITE HADES VI",
    reason: "Laser 6W untuk effect di project kecil-medium",
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let marketingTips: MarketingTip[] = [
  {
    id: "tip-1",
    userType: "rental",
    title: "Mulai Bisnis Rental Lampu",
    content:
      "Dengan MOXLITE, Anda bisa mulai bisnis rental dengan ROI cepat. Masalah yang sering dihadapi: harga equipment mahal. Solusi kami: produk berkualitas dengan harga kompetitif.",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "tip-2",
    userType: "project",
    title: "Setup Profesional untuk Project",
    content:
      "Setiap project membutuhkan setup yang berbeda. MOXLITE punya range produk lengkap dari entry hingga premium untuk memenuhi semua kebutuhan project Anda.",
    active: true,
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

  const { action } = req.query;

  // Budget Ranges endpoints
  if (action === "budget-ranges") {
    if (req.method === "GET") {
      return res.status(200).json({ success: true, data: budgetRanges });
    } else if (req.method === "POST") {
      const { minBudget, maxBudget, name, description } = req.body;

      if (!name || minBudget === undefined || maxBudget === undefined) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: name, minBudget, maxBudget",
        });
      }

      const newRange: BudgetRange = {
        id: `budget-${Date.now()}`,
        minBudget,
        maxBudget,
        name,
        description:
          description ||
          `Budget range dari Rp ${minBudget} - Rp ${maxBudget}`,
      };

      budgetRanges.push(newRange);
      return res.status(201).json({ success: true, data: newRange });
    } else if (req.method === "PUT") {
      const { id, minBudget, maxBudget, name, description } = req.body;

      const index = budgetRanges.findIndex((r) => r.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Budget range not found",
        });
      }

      budgetRanges[index] = {
        ...budgetRanges[index],
        minBudget: minBudget !== undefined ? minBudget : budgetRanges[index].minBudget,
        maxBudget: maxBudget !== undefined ? maxBudget : budgetRanges[index].maxBudget,
        name: name || budgetRanges[index].name,
        description:
          description !== undefined ? description : budgetRanges[index].description,
      };

      return res.status(200).json({ success: true, data: budgetRanges[index] });
    } else if (req.method === "DELETE") {
      const { id } = req.body;

      budgetRanges = budgetRanges.filter((r) => r.id !== id);
      return res.status(200).json({ success: true, data: { deleted: id } });
    }
  }

  // Product Recommendations endpoints
  if (action === "recommendations") {
    if (req.method === "GET") {
      return res
        .status(200)
        .json({ success: true, data: productRecommendations });
    } else if (req.method === "POST") {
      const {
        budgetRangeId,
        userType,
        productNo,
        productName,
        reason,
        priority,
      } = req.body;

      if (!budgetRangeId || !userType || !productNo || !productName) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      const newRec: ProductRecommendation = {
        id: `rec-${Date.now()}`,
        budgetRangeId,
        userType,
        productNo,
        productName,
        reason: reason || "",
        priority: priority || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productRecommendations.push(newRec);
      return res.status(201).json({ success: true, data: newRec });
    } else if (req.method === "PUT") {
      const {
        id,
        budgetRangeId,
        userType,
        productNo,
        productName,
        reason,
        priority,
      } = req.body;

      const index = productRecommendations.findIndex((r) => r.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Recommendation not found",
        });
      }

      productRecommendations[index] = {
        ...productRecommendations[index],
        budgetRangeId: budgetRangeId || productRecommendations[index].budgetRangeId,
        userType: userType || productRecommendations[index].userType,
        productNo: productNo !== undefined ? productNo : productRecommendations[index].productNo,
        productName: productName || productRecommendations[index].productName,
        reason: reason !== undefined ? reason : productRecommendations[index].reason,
        priority: priority !== undefined ? priority : productRecommendations[index].priority,
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        data: productRecommendations[index],
      });
    } else if (req.method === "DELETE") {
      const { id } = req.body;

      productRecommendations = productRecommendations.filter(
        (r) => r.id !== id
      );
      return res.status(200).json({ success: true, data: { deleted: id } });
    }
  }

  // Marketing Tips endpoints
  if (action === "marketing-tips") {
    if (req.method === "GET") {
      return res.status(200).json({ success: true, data: marketingTips });
    } else if (req.method === "POST") {
      const { userType, title, content, active } = req.body;

      if (!userType || !title || !content) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: userType, title, content",
        });
      }

      const newTip: MarketingTip = {
        id: `tip-${Date.now()}`,
        userType,
        title,
        content,
        active: active !== undefined ? active : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      marketingTips.push(newTip);
      return res.status(201).json({ success: true, data: newTip });
    } else if (req.method === "PUT") {
      const { id, userType, title, content, active } = req.body;

      const index = marketingTips.findIndex((t) => t.id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          error: "Marketing tip not found",
        });
      }

      marketingTips[index] = {
        ...marketingTips[index],
        userType: userType || marketingTips[index].userType,
        title: title || marketingTips[index].title,
        content: content || marketingTips[index].content,
        active: active !== undefined ? active : marketingTips[index].active,
        updatedAt: new Date(),
      };

      return res.status(200).json({ success: true, data: marketingTips[index] });
    } else if (req.method === "DELETE") {
      const { id } = req.body;

      marketingTips = marketingTips.filter((t) => t.id !== id);
      return res.status(200).json({ success: true, data: { deleted: id } });
    }
  }

  return res.status(400).json({
    success: false,
    error: "Invalid action parameter",
  });
}
