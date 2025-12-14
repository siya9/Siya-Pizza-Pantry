"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { logAuditEntry } from "@/lib/audit-trail";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ItemForm } from "@/components/forms/ItemForm";
import { AdjustQuantityModal } from "./AdjustQuantityModal";
import { InventoryTable } from "./InventoryTable";
import { InventoryItem, InventoryFilters } from "@/types/inventory";
import { InventoryItemFormData, QuantityAdjustmentFormData } from "@/lib/validations";
import { dummyInventoryData } from "@/lib/dummy-data";
import { Plus } from "lucide-react";

const STORAGE_KEY = "pizza-pantry-inventory";

export default function InventoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: "",
    category: "",
    sortBy: "name",
    sortDirection: "asc",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setItems(parsed);
          return;
        }
      } catch (error) {
        console.error("Error loading inventory:", error);
      }
    }
    setItems(dummyInventoryData);
  }, []);

  useEffect(() => {
    if (items.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const handleAddItem = (data: InventoryItemFormData) => {
    const newItem: InventoryItem = {
      _id: Date.now().toString(),
      ...data,
      image: data.image || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.id,
    };
    setItems((prev) => [...prev, newItem]);

    if (user) {
      logAuditEntry({
        itemId: newItem._id!,
        itemName: newItem.name,
        action: "created",
        userId: user.id,
        userName: user.name,
        details: `Created item: ${newItem.name}`,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleEditItem = (data: InventoryItemFormData) => {
    if (!selectedItem?._id) return;

    setItems((prev) =>
      prev.map((item) =>
        item._id === selectedItem._id
          ? { ...item, ...data, image: data.image || undefined, updatedAt: new Date() }
          : item
      )
    );

    if (user) {
      logAuditEntry({
        itemId: selectedItem._id,
        itemName: data.name,
        action: "updated",
        userId: user.id,
        userName: user.name,
        details: `Updated item: ${data.name}`,
      });
    }

    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const itemToDelete = items.find((i) => i._id === id);
    if (!itemToDelete) return;

    setItems((prev) => prev.filter((item) => item._id !== id));

    if (user) {
      logAuditEntry({
        itemId: id,
        itemName: itemToDelete.name,
        action: "deleted",
        userId: user.id,
        userName: user.name,
        details: `Deleted item: ${itemToDelete.name}`,
      });
    }
  };

  const handleAdjustQuantity = (data: QuantityAdjustmentFormData) => {
    if (!selectedItem?._id) return;
    const previousQuantity = selectedItem.quantity;
    const newQuantity = Math.max(0, selectedItem.quantity + data.adjustment);

    setItems((prev) =>
      prev.map((item) =>
        item._id === selectedItem._id
          ? { ...item, quantity: newQuantity, updatedAt: new Date() }
          : item
      )
    );

    if (user) {
      logAuditEntry({
        itemId: selectedItem._id,
        itemName: selectedItem.name,
        action: "quantity_adjusted",
        previousQuantity,
        newQuantity,
        adjustment: data.adjustment,
        reason: data.reason,
        userId: user.id,
        userName: user.name,
      });
    }

    setIsAdjustModalOpen(false);
    setSelectedItem(null);
  };

  const openEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const openAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
            <p className="text-muted-foreground">Manage your pizza pantry inventory</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Table */}
        <InventoryTable
          items={items}
          filters={filters}
          setFilters={setFilters}
          onEdit={openEdit}
          onAdjust={openAdjust}
          onDelete={handleDeleteItem}
        />

        {/* Modals */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>Add a new item to your inventory</DialogDescription>
            </DialogHeader>
            <ItemForm onSubmit={handleAddItem} onCancel={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>Update item information</DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <ItemForm
                item={selectedItem}
                onSubmit={handleEditItem}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {selectedItem && (
          <AdjustQuantityModal
            isOpen={isAdjustModalOpen}
            onClose={() => {
              setIsAdjustModalOpen(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onAdjust={handleAdjustQuantity}
          />
        )}
      </div>
    </DashboardLayout>
  );
}