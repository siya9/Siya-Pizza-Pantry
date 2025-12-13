"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { InventoryItem, InventoryFilters, SortField } from "@/types/inventory";
import { InventoryItemFormData, QuantityAdjustmentFormData } from "@/lib/validations";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { InventoryChart } from "@/components/dashboard/inventory-chart";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { ItemForm } from "@/components/forms/ItemForm";
import { AdjustQuantityModal } from "@/components/inventory/AdjustQuantityModal";
import { dummyInventoryData } from "@/lib/dummy-data";
import { Plus, Search, Filter, ArrowUpDown, Edit, Trash2, Package, BarChart3, Table2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "pizza-pantry-inventory";

export default function Home() {
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

  // Load items from localStorage or use dummy data
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

  // Save items to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));
    return uniqueCategories.sort();
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.location?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy];
      let bValue: any = b[filters.sortBy];

      if (filters.sortBy === "quantity" || filters.sortBy === "updatedAt") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      if (filters.sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [items, filters]);

  const handleSort = (field: SortField) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDirection:
        prev.sortBy === field && prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddItem = async (data: InventoryItemFormData) => {
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

  const handleEditItem = async (data: InventoryItemFormData) => {
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

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleAdjustQuantity = async (data: QuantityAdjustmentFormData) => {
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

          {/* Overview Tab - Stats and Charts */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <StatsCards items={items} />

            {/* Charts */}
            <InventoryChart items={items} />

            {/* Low Stock Alerts */}
            <LowStockAlerts items={items} />
          </TabsContent>

          {/* Table Tab */}
          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Items</CardTitle>
                    <CardDescription>View and manage all inventory items</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, search: e.target.value }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value: string) =>
                      setFilters((prev) => ({ ...prev, category: value === "all" ? "" : value }))
                    }
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        search: "",
                        category: "",
                        sortBy: "name",
                        sortDirection: "asc",
                      })
                    }
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Image</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("name")}
                            className="h-8"
                          >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("category")}
                            className="h-8"
                          >
                            Category
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("quantity")}
                            className="h-8"
                          >
                            Quantity
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Package className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">No items found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAndSortedItems.map((item) => {
                          const isLowStock = item.quantity < item.minStock;
                          return (
                            <TableRow key={item._id}>
                              <TableCell>
                                {item.image ? (
                                  <div className="w-12 h-12 rounded-md overflow-hidden border">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=No+Image";
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-md bg-muted border flex items-center justify-center">
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>
                                <span className={isLowStock ? "font-semibold text-destructive" : ""}>
                                  {item.quantity} {item.unit}
                                </span>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {item.location || "-"}
                              </TableCell>
                              <TableCell>
                                {isLowStock ? (
                                  <Badge variant="destructive">Low Stock</Badge>
                                ) : (
                                  <Badge variant="success">In Stock</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setIsAdjustModalOpen(true);
                                    }}
                                  >
                                    Adjust
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setIsEditModalOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteItem(item._id!)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>Add a new item to your inventory</DialogDescription>
            </DialogHeader>
            <ItemForm
              onSubmit={handleAddItem}
              onCancel={() => setIsAddModalOpen(false)}
            />
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
