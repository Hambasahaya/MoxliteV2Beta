/**
 * Knowledge Base Utilities
 * Helper functions untuk manage knowledge base di admin panel
 */

export interface KBEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Format knowledge base entry untuk digunakan chatbot
 */
export function formatKBEntryForChatbot(entry: KBEntry): string {
  return `Q: ${entry.question}\nA: ${entry.answer}\nCategory: ${entry.category}`;
}

/**
 * Validate knowledge base entry
 */
export function validateKBEntry(
  entry: Partial<KBEntry>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!entry.category?.trim()) errors.push("Category is required");
  if (!entry.question?.trim()) errors.push("Question is required");
  if (!entry.answer?.trim()) errors.push("Answer is required");

  if (entry.question && entry.question.length < 5)
    errors.push("Question must be at least 5 characters");

  if (entry.answer && entry.answer.length < 10)
    errors.push("Answer must be at least 10 characters");

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Search knowledge base entries
 */
export function searchKBEntries(
  entries: KBEntry[],
  query: string
): KBEntry[] {
  const lowerQuery = query.toLowerCase();
  return entries.filter(
    (entry) =>
      entry.question.toLowerCase().includes(lowerQuery) ||
      entry.answer.toLowerCase().includes(lowerQuery) ||
      entry.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Export knowledge base as JSON
 */
export function exportKBAsJSON(entries: KBEntry[]): string {
  return JSON.stringify(entries, null, 2);
}

/**
 * Export knowledge base as CSV
 */
export function exportKBAsCSV(entries: KBEntry[]): string {
  const headers = ["ID", "Category", "Question", "Answer", "Keywords"];
  const rows = entries.map((e) => [
    e.id,
    `"${e.category}"`,
    `"${e.question}"`,
    `"${e.answer}"`,
    `"${e.keywords.join("; ")}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Get KB entries statistics
 */
export function getKBStatistics(entries: KBEntry[]) {
  const categories = new Map<string, number>();
  let totalKeywords = 0;

  entries.forEach((entry) => {
    categories.set(
      entry.category,
      (categories.get(entry.category) || 0) + 1
    );
    totalKeywords += entry.keywords.length;
  });

  return {
    totalEntries: entries.length,
    categories: Object.fromEntries(categories),
    averageKeywordsPerEntry:
      entries.length > 0 ? (totalKeywords / entries.length).toFixed(2) : 0,
    lastUpdated: entries.length > 0 
      ? entries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].updatedAt
      : null,
  };
}
