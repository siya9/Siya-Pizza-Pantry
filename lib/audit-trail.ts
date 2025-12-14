import { QuantityAdjustment } from "@/types/inventory";

const AUDIT_STORAGE_KEY = "pizza-pantry-audit-trail";

export interface AuditLogEntry {
  _id: string;
  itemId: string;
  itemName: string;
  action: "created" | "updated" | "deleted" | "quantity_adjusted";
  previousQuantity?: number;
  newQuantity?: number;
  adjustment?: number;
  reason?: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: string;
}

export function logAuditEntry(entry: Omit<AuditLogEntry, "_id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  const auditLog: AuditLogEntry[] = getAuditLog();
  const newEntry: AuditLogEntry = {
    ...entry,
    _id: Date.now().toString(),
    timestamp: new Date(),
  };

  auditLog.unshift(newEntry); // Add to beginning
  // Keep only last 1000 entries
  if (auditLog.length > 1000) {
    auditLog.splice(1000);
  }

  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditLog));
}

export function getAuditLog(): AuditLogEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch {
    return [];
  }
}

export function getAuditLogForItem(itemId: string): AuditLogEntry[] {
  return getAuditLog().filter((entry) => entry.itemId === itemId);
}

export function clearAuditLog(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUDIT_STORAGE_KEY);
}

