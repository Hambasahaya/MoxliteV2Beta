/**
 * Product Knowledge Base - CSV Parser & Product Data Management
 * Loads and manages product data from CSV files
 */

export interface Product {
  no: number;
  series: string;
  model: string;
  description: string;
  price: number;
  tag?: string;
}

// Product database - pre-loaded data from CSV files
const PRODUCT_DATABASE: Product[] = [
  // Laser Series
  {
    no: 45,
    series: "Laser",
    model: "MOXLITE HADES VI",
    description: "6W Laser up to 2600mw laser power",
    price: 22530000,
    tag: "laser-entry",
  },
  {
    no: 46,
    series: "Laser",
    model: "MOXLITE HADES X",
    description: "10W Laser up to 4000mw laser power",
    price: 24430000,
    tag: "laser-mid",
  },
  {
    no: 47,
    series: "Laser",
    model: "MOXLITE HADES XX",
    description: "20W Laser up to 9000mw laser power",
    price: 63110000,
    tag: "laser-pro",
  },
  {
    no: 48,
    series: "Laser",
    model: "MOXLITE HADES XXX",
    description: "30W Laser up to 12500mw laser power",
    price: 99220000,
    tag: "laser-premium",
  },
  {
    no: 49,
    series: "Laser",
    model: "MOXLITE HADES IP",
    description: "33W Laser Waterproof",
    price: 111840000,
    tag: "laser-outdoor",
  },

  // Moving Light Series
  {
    no: 1,
    series: "Moving Light",
    model: "MOXLITE AMOS",
    description: "Beam 250W Lamp Source",
    price: 7940000,
    tag: "beam-entry",
  },
  {
    no: 2,
    series: "Moving Light",
    model: "MOXLITE AMOS PLUS",
    description: "Beam 300W Lamp Source",
    price: 10010000,
    tag: "beam-mid",
  },
  {
    no: 3,
    series: "Moving Light",
    model: "MOXLITE AMOS PRO",
    description: "Beam 420W Lamp Source",
    price: 14980000,
    tag: "beam-pro",
  },
  {
    no: 4,
    series: "Moving Light",
    model: "MOXLITE ARES",
    description: "BSW 380W Lamp Source CMY + CTO",
    price: 16240000,
    tag: "bsw-mid",
  },
  {
    no: 5,
    series: "Moving Light",
    model: "MOXLITE SCARLET",
    description: "BSW 200W LED Source",
    price: 10900000,
    tag: "led-entry",
  },
  {
    no: 6,
    series: "Moving Light",
    model: "MOXLITE SCARLET PLUS",
    description: "BSW 450W LED Source CMY + CTO",
    price: 17440000,
    tag: "led-mid",
  },
  {
    no: 7,
    series: "Moving Light",
    model: "MOXLITE SCARLET HYBRID",
    description: "BSW 600W LED Source CMY + CTO + Framing",
    price: 32110000,
    tag: "led-pro",
  },
  {
    no: 8,
    series: "Moving Light",
    model: "MOXLITE IP SCARLET HYBRID",
    description: "BSW 600W LED Source Waterproof CMY + CTO + Framing",
    price: 43810000,
    tag: "led-outdoor",
  },
  {
    no: 9,
    series: "Moving Light",
    model: "MOXLITE ARES PLUS",
    description: "Advanced BSW Professional Solution",
    price: 39760000,
    tag: "bsw-pro",
  },

  // Moving Wash Series
  {
    no: 10,
    series: "Moving Wash",
    model: "MOXLITE HERA LITE",
    description: "Beam 150W LED Source",
    price: 6950000,
    tag: "wash-entry",
  },
  {
    no: 11,
    series: "Moving Wash",
    model: "MOXLITE MEDUSA LITE",
    description: "B-Eye Effect 7x40W RGBW 4in1",
    price: 6970000,
    tag: "wash-beye",
  },
  {
    no: 12,
    series: "Moving Wash",
    model: "MOXLITE IP MEDUSA LITE",
    description: "B-Eye Effect 7x40W RGBW 4in1 Waterproof",
    price: 11740000,
    tag: "wash-outdoor",
  },
  {
    no: 13,
    series: "Moving Wash",
    model: "MOXLITE MEDUSA",
    description: "B-Eye Effect 19x15W RGBW 4in1",
    price: 10070000,
    tag: "wash-mid",
  },
  {
    no: 14,
    series: "Moving Wash",
    model: "MOXLITE MEDUSA PLUS",
    description: "B-Eye Effect 19x40W RGBW 4in1",
    price: 14370000,
    tag: "wash-pro",
  },
  {
    no: 15,
    series: "Moving Wash",
    model: "MOXLITE IP MEDUSA PLUS",
    description: "B-Eye Effect 12x40W RGBW 4in1 Waterproof",
    price: 17600000,
    tag: "wash-outdoor-pro",
  },
  {
    no: 16,
    series: "Moving Wash",
    model: "MOXLITE IP MEDUSA PRO",
    description: "B-Eye Effect 7x60W RGBW 4in1 Waterproof",
    price: 15950000,
    tag: "wash-outdoor-mid",
  },

  // SFX Series
  {
    no: 50,
    series: "SFX",
    model: "MOXLITE SPARKY",
    description: "900W Spark",
    price: 10120000,
    tag: "sfx-spark",
  },
  {
    no: 51,
    series: "SFX",
    model: "MOXLITE FLAME",
    description: "Flame Effect Machine",
    price: 3200000,
    tag: "sfx-flame",
  },
  {
    no: 52,
    series: "SFX",
    model: "BUBBLE FOG MACHINE",
    description: "Fog Machine with Bubble Effect",
    price: 11900000,
    tag: "sfx-fog",
  },
  {
    no: 53,
    series: "SFX",
    model: "FOG LIQUID",
    description: "Premium Fog Liquid",
    price: 480000,
    tag: "sfx-consumable",
  },
  {
    no: 54,
    series: "SFX",
    model: "BUBBLE LIQUID",
    description: "Bubble Machine Liquid",
    price: 487000,
    tag: "sfx-consumable",
  },
  {
    no: 55,
    series: "SFX",
    model: "MOXLITE CO2 BARREL",
    description: "30W CO2 Effect",
    price: 5800000,
    tag: "sfx-co2",
  },
  {
    no: 56,
    series: "SFX",
    model: "MOXLITE CO2 SHOT",
    description: "1000W Spray CO2 up to 8m range",
    price: 5460000,
    tag: "sfx-co2-spray",
  },
  {
    no: 57,
    series: "SFX",
    model: "MOXLITE CO2 GUN",
    description: "40W Portable CO2 with RGB LEDs",
    price: 6170000,
    tag: "sfx-co2-portable",
  },
  {
    no: 58,
    series: "SFX",
    model: "MOXLITE CONFETTI GUN",
    description: "20W Portable confetti up to 10m range",
    price: 3930000,
    tag: "sfx-confetti",
  },
  {
    no: 59,
    series: "SFX",
    model: "MOXLITE CONFETTI BLASTER",
    description: "50W Confetti up to 18m range",
    price: 16230000,
    tag: "sfx-confetti-pro",
  },
];

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
  return PRODUCT_DATABASE;
}

/**
 * Search products by keyword - improved with intelligent keyword extraction
 */
export function searchProducts(keyword: string): Product[] {
  const lowerKeyword = keyword.toLowerCase();
  
  // First try exact match in model/description/series
  let results = PRODUCT_DATABASE.filter((product) => {
    return (
      product.model.toLowerCase().includes(lowerKeyword) ||
      product.description.toLowerCase().includes(lowerKeyword) ||
      product.series.toLowerCase().includes(lowerKeyword)
    );
  });

  // If no results, extract keywords and search
  if (results.length === 0) {
    results = PRODUCT_DATABASE.filter((product) => {
      const modelParts = product.model.toLowerCase().split(" ");
      const keywordParts = lowerKeyword.split(" ");
      
      // Check if any word in product name matches any keyword
      return modelParts.some((modelPart) =>
        keywordParts.some((keywordPart) => 
          modelPart.includes(keywordPart) || keywordPart.includes(modelPart)
        )
      );
    });
  }

  return results;
}

/**
 * Get all product names for auto-suggesting
 */
export function getAllProductNames(): string[] {
  return PRODUCT_DATABASE.map((p) => p.model);
}

/**
 * Get all unique product prefixes (HADES, AMOS, SCARLET, etc) for quick search
 */
export function getAllProductPrefixes(): string[] {
  const prefixes = new Set<string>();
  PRODUCT_DATABASE.forEach((product) => {
    const parts = product.model.split(" ");
    if (parts.length >= 2) {
      prefixes.add(parts[1]); // Usually "AMOS", "ARES", "MEDUSA", etc
    }
  });
  return Array.from(prefixes);
}

/**
 * Get products by series
 */
export function getProductsBySeries(series: string): Product[] {
  const lowerSeries = series.toLowerCase();
  return PRODUCT_DATABASE.filter(
    (product) => product.series.toLowerCase() === lowerSeries
  );
}

/**
 * Get products within price range
 */
export function getProductsByBudget(
  minBudget: number,
  maxBudget: number
): Product[] {
  return PRODUCT_DATABASE.filter(
    (product) => product.price >= minBudget && product.price <= maxBudget
  );
}

/**
 * Get best sellers in a category (most affordable to premium)
 */
export function getBestSellersBySeries(series: string, limit: number = 3) {
  const products = getProductsBySeries(series);
  return products.sort((a, b) => a.price - b.price).slice(0, limit);
}

/**
 * Get product comparisons
 */
export function compareProducts(
  productIds: number[]
): { comparison: Product[]; differences: string[] } {
  const comparison = PRODUCT_DATABASE.filter((p) => productIds.includes(p.no));
  const differences: string[] = [];

  if (comparison.length > 1) {
    const prices = comparison.map((p) => p.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    differences.push(
      `💰 Harga: Mulai dari Rp ${minPrice.toLocaleString("id-ID")} hingga Rp ${maxPrice.toLocaleString("id-ID")}`
    );
    differences.push(`📊 Perbedaan harga: Rp ${(maxPrice - minPrice).toLocaleString("id-ID")}`);
  }

  return { comparison, differences };
}

/**
 * Get product recommendations based on use case
 */
export function getRecommendations(useCase: string): Product[] {
  const lowerUseCase = useCase.toLowerCase();
  let tags: string[] = [];

  // Determine tags based on use case
  if (lowerUseCase.includes("outdoor") || lowerUseCase.includes("luar")) {
    tags = ["outdoor", "laser-outdoor", "led-outdoor", "wash-outdoor"];
  } else if (lowerUseCase.includes("concert") || lowerUseCase.includes("konser")) {
    tags = ["beam-pro", "bsw-pro", "laser-pro"];
  } else if (lowerUseCase.includes("club") || lowerUseCase.includes("klub")) {
    tags = ["led-mid", "wash-mid", "sfx-co2"];
  } else if (lowerUseCase.includes("wedding") || lowerUseCase.includes("pernikahan")) {
    tags = ["wash-entry", "led-entry", "sfx-flame"];
  } else if (lowerUseCase.includes("event") || lowerUseCase.includes("acara")) {
    tags = ["beam-mid", "wash-mid", "sfx-spark"];
  } else if (lowerUseCase.includes("pemula") || lowerUseCase.includes("beginner")) {
    tags = ["entry"];
  }

  if (tags.length === 0) {
    return PRODUCT_DATABASE.slice(0, 5);
  }

  return PRODUCT_DATABASE.filter((p) => tags.some((tag) => p.tag?.includes(tag)));
}

/**
 * Format price in Rupiah
 */
export function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

/**
 * Get price range for a series
 */
export function getPriceRange(
  series: string
): { min: number; max: number; avg: number } {
  const products = getProductsBySeries(series);
  if (products.length === 0) {
    return { min: 0, max: 0, avg: 0 };
  }

  const prices = products.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  return { min, max, avg };
}
