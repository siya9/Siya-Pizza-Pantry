"use client";

import { useState, FormEvent } from "react";
import { InventoryItem } from "@/types/inventory";
import { quantityAdjustmentSchema, QuantityAdjustmentFormData } from "@/lib/validations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface AdjustQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
  onAdjust: any;
  isLoading?: boolean;
}

export function AdjustQuantityModal({
  isOpen,
  onClose,
  item,
  onAdjust,
  isLoading = false,
}: AdjustQuantityModalProps) {
  const [adjustment, setAdjustment] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const adjustmentValue = parseFloat(adjustment);
      const validatedData = quantityAdjustmentSchema.parse({
        itemId: item._id!,
        adjustment: adjustmentValue,
        reason,
      });

      await onAdjust(validatedData);
      setAdjustment("");
      setReason("");
      onClose();
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
        setErrors({ submit: error.message || "Failed to adjust quantity" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const newQuantity = item.quantity + (parseFloat(adjustment) || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adjust Quantity - {item.name}</DialogTitle>
          <DialogDescription>Update the quantity for this inventory item</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Current Quantity</p>
                  <p className="text-lg font-semibold">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">New Quantity</p>
                  <p
                    className={`text-lg font-semibold ${
                      newQuantity < (item.reorderThreshold || 0)
                        ? "text-destructive"
                        : ""
                    }`}
                  >
                    {newQuantity.toFixed(2)} {item.unit}
                  </p>
                </div>
              </div>
              {newQuantity < (item.reorderThreshold || 0) && (
                <p className="mt-2 text-sm text-destructive">
                  ⚠️ Warning: New quantity will be below reorder threshold ({(item.reorderThreshold || 0)} {item.unit})
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="adjustment">
              Adjustment <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                type="number"
                id="adjustment"
                step="0.01"
                value={adjustment}
                onChange={(e) => {
                  setAdjustment(e.target.value);
                  if (errors.adjustment) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.adjustment;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Enter positive or negative number"
                className={errors.adjustment ? "border-destructive" : ""}
                aria-invalid={!!errors.adjustment}
                aria-describedby={errors.adjustment ? "adjustment-error" : undefined}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                {item.unit}
              </span>
            </div>
            {errors.adjustment && (
              <p id="adjustment-error" className="text-sm text-destructive">
                {errors.adjustment}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Use positive numbers to add, negative to subtract
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (errors.reason) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.reason;
                    return newErrors;
                  });
                }
              }}
              placeholder="Enter reason for adjustment..."
              className={errors.reason ? "border-destructive" : ""}
              aria-invalid={!!errors.reason}
              aria-describedby={errors.reason ? "reason-error" : undefined}
            />
            {errors.reason && (
              <p id="reason-error" className="text-sm text-destructive">
                {errors.reason}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting || isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Adjusting..." : "Adjust Quantity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
