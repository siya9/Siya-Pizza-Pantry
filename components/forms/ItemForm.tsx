"use client";

import { useState, FormEvent } from "react";
import { InventoryItem } from "@/types/inventory";
import { inventoryItemSchema, InventoryItemFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ItemFormProps {
  item?: InventoryItem;
  onSubmit: (data: InventoryItemFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ItemForm({ item, onSubmit, onCancel, isLoading = false }: ItemFormProps) {
  const [formData, setFormData] = useState<InventoryItemFormData>({
    name: item?.name || "",
    category: item?.category || "",
    quantity: item?.quantity || 0,
    unit: item?.unit || "",
    reorderThreshold: item?.reorderThreshold || item?.minStock || 0,
    costPrice: item?.costPrice || undefined,
    location: item?.location || "",
    notes: item?.notes || "",
    image: item?.image || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof InventoryItemFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = inventoryItemSchema.parse(formData);
      await onSubmit(validatedData);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: error.message || "Failed to save item" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-destructive" : ""}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className={errors.category ? "border-destructive" : ""}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
          />
          {errors.category && (
            <p id="category-error" className="text-sm text-destructive">
              {errors.category}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            type="number"
            id="quantity"
            min="0"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || 0)}
            className={errors.quantity ? "border-destructive" : ""}
            aria-invalid={!!errors.quantity}
            aria-describedby={errors.quantity ? "quantity-error" : undefined}
          />
          {errors.quantity && (
            <p id="quantity-error" className="text-sm text-destructive">
              {errors.quantity}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">
            Unit <span className="text-destructive">*</span>
          </Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
            placeholder="e.g., lbs, oz, pieces"
            className={errors.unit ? "border-destructive" : ""}
            aria-invalid={!!errors.unit}
            aria-describedby={errors.unit ? "unit-error" : undefined}
          />
          {errors.unit && (
            <p id="unit-error" className="text-sm text-destructive">
              {errors.unit}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">
            Minimum Stock <span className="text-destructive">*</span>
          </Label>
          <Input
            type="number"
            id="minStock"
            min="0"
            step="0.01"
            value={formData.minStock}
            onChange={(e) => handleChange("minStock", parseFloat(e.target.value) || 0)}
            className={errors.minStock ? "border-destructive" : ""}
            aria-invalid={!!errors.minStock}
            aria-describedby={errors.minStock ? "minStock-error" : undefined}
          />
          {errors.minStock && (
            <p id="minStock-error" className="text-sm text-destructive">
              {errors.minStock}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          type="url"
          id="image"
          value={formData.image || ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={errors.image ? "border-destructive" : ""}
          aria-invalid={!!errors.image}
          aria-describedby={errors.image ? "image-error" : undefined}
        />
        {errors.image && (
          <p id="image-error" className="text-sm text-destructive">
            {errors.image}
          </p>
        )}
        {formData.image && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <div className="w-32 h-32 rounded-lg overflow-hidden border">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? "Saving..." : item ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
