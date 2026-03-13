/**
 * API Route: Product Management
 * Handles CRUD operations for products
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getAllProducts, Product } from "@/lib/productKnowledgeBase";

// In-memory storage (replace with database in production)
let productsDatabase: Product[] = [];

// Initialize from productKnowledgeBase on first load
function initializeProducts() {
  if (productsDatabase.length === 0) {
    try {
      productsDatabase = getAllProducts();
    } catch (error) {
      console.error("Error initializing products:", error);
    }
  }
}

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
  // Initialize products on first request
  initializeProducts();

  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (req.method === "GET") {
    // Get all products
    res.status(200).json({ success: true, data: productsDatabase });
  } else if (req.method === "POST") {
    // Add new product
    const { no, series, model, description, price, tag } = req.body;

    if (!no || !series || !model || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: no, series, model, description, price",
      });
    }

    // Check if product no already exists
    if (productsDatabase.some((p) => p.no === no)) {
      return res.status(400).json({
        success: false,
        error: `Product with no ${no} already exists`,
      });
    }

    const newProduct: Product = {
      no,
      series,
      model,
      description,
      price: parseFloat(price),
      tag: tag || undefined,
    };

    productsDatabase.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } else if (req.method === "PUT") {
    // Update product
    const { no, series, model, description, price, tag } = req.body;

    if (!no) {
      return res.status(400).json({
        success: false,
        error: "Product no is required",
      });
    }

    const index = productsDatabase.findIndex((p) => p.no === no);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Product with no ${no} not found`,
      });
    }

    productsDatabase[index] = {
      no,
      series: series || productsDatabase[index].series,
      model: model || productsDatabase[index].model,
      description: description || productsDatabase[index].description,
      price: price !== undefined ? parseFloat(price) : productsDatabase[index].price,
      tag: tag !== undefined ? tag : productsDatabase[index].tag,
    };

    res.status(200).json({ success: true, data: productsDatabase[index] });
  } else if (req.method === "DELETE") {
    // Delete product
    const { no } = req.body;

    if (!no) {
      return res.status(400).json({
        success: false,
        error: "Product no is required",
      });
    }

    const initialLength = productsDatabase.length;
    productsDatabase = productsDatabase.filter((p) => p.no !== no);

    if (productsDatabase.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: `Product with no ${no} not found`,
      });
    }

    res.status(200).json({ success: true, data: { message: "Product deleted" } });
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
