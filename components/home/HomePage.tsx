"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ItemForm } from "@/components/forms/ItemForm";
import { AdjustQuantityModal } from "@/components/inventory/AdjustQuantityModal";
import { InventoryOverviewTab } from "./InventoryOverviewTab";
import { InventoryTableTab } from "./InventoryTableTab";
import { InventoryItem, InventoryFilters } from "@/types/inventory";
import { InventoryItemFormData, QuantityAdjustmentFormData } from "@/lib/validations";
import { dummyInventoryData } from "@/lib/dummy-data";
import { Plus, BarChart3, Table2 } from "lucide-react";

const STORAGE_KEY = "pizza-pantry-inventory";

export default function HomePage() {
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

    // Load & save from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.length > 0) {
                    setItems(parsed);
                    return;
                }
            } catch (e) {
                console.error("Error loading inventory:", e);
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
        };
        setItems((prev) => [...prev, newItem]);
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
        setIsEditModalOpen(false);
        setSelectedItem(null);
    };

    const handleDeleteItem = (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        setItems((prev) => prev.filter((item) => item._id !== id));
    };

    const handleAdjustQuantity = (data: QuantityAdjustmentFormData) => {
        if (!selectedItem?._id) return;
        const newQuantity = Math.max(0, selectedItem.quantity + data.adjustment);
        setItems((prev) =>
            prev.map((item) =>
                item._id === selectedItem._id
                    ? { ...item, quantity: newQuantity, updatedAt: new Date() }
                    : item
            )
        );
        setIsAdjustModalOpen(false);
        setSelectedItem(null);
    };

    const openEditModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const openAdjustModal = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsAdjustModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pizza Pantry Dashboard</h1>
                        <p className="text-muted-foreground">Overview and management of your inventory</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="table" className="flex items-center gap-2">
                            <Table2 className="h-4 w-4" />
                            Inventory Table
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <InventoryOverviewTab items={items} />
                    </TabsContent>

                    <TabsContent value="table">
                        <InventoryTableTab
                            items={items}
                            filters={filters}
                            setFilters={setFilters}
                            onEdit={openEditModal}
                            onAdjust={openAdjustModal}
                            onDelete={handleDeleteItem}
                        />
                    </TabsContent>
                </Tabs>

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