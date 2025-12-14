import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  category: z.string().min(1, "Category is required").max(50, "Category is too long"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  unit: z.string().min(1, "Unit is required").max(20, "Unit is too long"),
  reorderThreshold: z.number().min(0, "Reorder threshold must be non-negative"),
  costPrice: z.number().min(0, "Cost price must be non-negative").optional(),
  location: z.string().max(100, "Location is too long").optional(),
  notes: z.string().max(500, "Notes are too long").optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const quantityAdjustmentSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  adjustment: z.number().refine((val) => val !== 0, {
    message: "Adjustment must not be zero",
  }),
  reason: z.string().min(1, "Reason is required").max(200, "Reason is too long"),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
export type QuantityAdjustmentFormData = z.infer<typeof quantityAdjustmentSchema>;

