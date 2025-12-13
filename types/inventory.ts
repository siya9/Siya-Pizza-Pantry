export interface InventoryItem {
  _id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  location?: string;
  notes?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuantityAdjustment {
  _id?: string;
  itemId: string;
  itemName: string;
  previousQuantity: number;
  newQuantity: number;
  adjustment: number;
  reason: string;
  userId: string;
  userName?: string;
  createdAt?: Date;
}

export interface InventoryHistory {
  _id?: string;
  itemId: string;
  itemName: string;
  action: "created" | "updated" | "deleted" | "quantity_adjusted" | "bulk_operation";
  previousValue?: any;
  newValue?: any;
  details?: string;
  timestamp: Date;
}

export type SortField = "name" | "category" | "quantity" | "updatedAt";
export type SortDirection = "asc" | "desc";

export interface InventoryFilters {
  search: string;
  category: string;
  status?: "all" | "in_stock" | "low_stock" | "out_of_stock";
  location?: string;
  sortBy: SortField;
  sortDirection: SortDirection;
}
