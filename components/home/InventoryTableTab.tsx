import { useState, useMemo } from "react";
import { InventoryItem, InventoryFilters, SortField } from "@/types/inventory";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, Edit, Trash2, Package } from "lucide-react";

type InventoryTableTabProps = {
  items: InventoryItem[];
  filters: InventoryFilters;
  setFilters: (filters: InventoryFilters) => void;
  onEdit: (item: InventoryItem) => void;
  onAdjust: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
};

export function InventoryTableTab({
  items,
  filters,
  setFilters,
  onEdit,
  onAdjust,
  onDelete,
}: InventoryTableTabProps) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category)));
    return unique.sort();
  }, [items]);

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

      return filters.sortDirection === "asc"
        ? aValue > bValue ? 1 : aValue < bValue ? -1 : 0
        : aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    });

    return filtered;
  }, [items, filters]);

  const handleSort = (field: SortField) => {
    setFilters({
      ...filters,
      sortBy: field,
      sortDirection:
        filters.sortBy === field && filters.sortDirection === "asc" ? "desc" : "asc",
    });
  };

  return (
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
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value === "all" ? "" : value })
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
                  <Button variant="ghost" size="sm" onClick={() => handleSort("name")} className="h-8">
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("category")} className="h-8">
                    Category <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("quantity")} className="h-8">
                    Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
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
                  const isLowStock = item.quantity < (item.reorderThreshold || 0);
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
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/48?text=No+Image";
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
                          <Button variant="ghost" size="sm" onClick={() => onAdjust(item)}>
                            Adjust
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDelete(item._id!)}>
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
  );
}