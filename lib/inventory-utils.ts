import { InventoryItem } from "@/types/inventory";

/**
 * Export inventory data to CSV format
 */
export function exportToCSV(items: InventoryItem[]): string {
  const headers = ["Name", "Category", "Quantity", "Unit", "Reorder Threshold", "Location", "Status"];
  const rows = items.map((item) => {
    const status = item.quantity < item.reorderThreshold ? "Low Stock" : "In Stock";
    return [
      item.name,
      item.category,
      item.quantity.toString(),
      item.unit,
      item.reorderThreshold.toString(),
      item.location || "",
      status,
    ];
  });

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  return csvContent;
}

/**
 * Export inventory data to JSON format
 */
export function exportToJSON(items: InventoryItem[]): string {
  return JSON.stringify(items, null, 2);
}

/**
 * Import inventory data from JSON
 */
export function importFromJSON(jsonString: string): InventoryItem[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      }));
    }
    throw new Error("Invalid JSON format");
  } catch (error) {
    throw new Error("Failed to parse JSON: " + (error as Error).message);
  }
}

/**
 * Import inventory data from CSV
 */
export function importFromCSV(csvString: string): InventoryItem[] {
  const lines = csvString.split("\n").filter((line) => line.trim());
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row");
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const items: InventoryItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    if (values.length !== headers.length) continue;

    const item: Partial<InventoryItem> = {
      _id: Date.now().toString() + i,
      name: values[headers.indexOf("name")] || "",
      category: values[headers.indexOf("category")] || "",
      quantity: parseFloat(values[headers.indexOf("quantity")] || "0"),
      unit: values[headers.indexOf("unit")] || "",
      reorderThreshold: parseFloat(values[headers.indexOf("reorder threshold")] || "0"),
      location: values[headers.indexOf("location")] || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (item.name) {
      items.push(item as InventoryItem);
    }
  }

  return items;
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

