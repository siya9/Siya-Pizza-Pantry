"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { InventoryItem } from "@/types/inventory";
import { Trash2, Edit, Copy, Download, Upload } from "lucide-react";
import { exportToCSV, exportToJSON, downloadFile, importFromJSON, importFromCSV } from "@/lib/inventory-utils";

interface BulkOperationsProps {
  selectedItems: string[];
  items: InventoryItem[];
  onBulkDelete: (ids: string[]) => void;
  onBulkEdit?: (ids: string[]) => void;
  onDuplicate?: (item: InventoryItem) => void;
  onExport?: (format: "csv" | "json") => void;
  onImport?: (items: InventoryItem[]) => void;
}

export function BulkOperations({
  selectedItems,
  items,
  onBulkDelete,
  onBulkEdit,
  onDuplicate,
  onExport,
  onImport,
}: BulkOperationsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");

  const selectedCount = selectedItems.length;
  const hasSelection = selectedCount > 0;

  const handleBulkDelete = () => {
    onBulkDelete(selectedItems);
    setIsDeleteDialogOpen(false);
  };

  const handleExport = (format: "csv" | "json") => {
    const selectedItemsData = items.filter((item) => selectedItems.includes(item._id!));
    const allItems = selectedItemsData.length > 0 ? selectedItemsData : items;

    if (format === "csv") {
      const csv = exportToCSV(allItems);
      downloadFile(csv, `inventory-export-${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    } else {
      const json = exportToJSON(allItems);
      downloadFile(json, `inventory-export-${new Date().toISOString().split("T")[0]}.json`, "application/json");
    }

    onExport?.(format);
  };

  const handleImport = () => {
    try {
      let importedItems: InventoryItem[] = [];
      
      if (importData.trim().startsWith("[")) {
        // JSON format
        importedItems = importFromJSON(importData);
      } else {
        // CSV format
        importedItems = importFromCSV(importData);
      }

      onImport?.(importedItems);
      setIsImportDialogOpen(false);
      setImportData("");
    } catch (error) {
      alert("Failed to import data: " + (error as Error).message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {hasSelection && (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
            </span>
            {onBulkEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkEdit(selectedItems)}
                disabled={selectedCount === 0}
              >
                <Edit className="mr-2 h-4 w-4" />
                Bulk Edit
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={selectedCount === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </>
        )}
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Items</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} item{selectedCount !== 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Inventory</DialogTitle>
            <DialogDescription>
              Import inventory items from CSV or JSON file. You can also paste the data directly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Upload File</label>
              <input
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFileUpload}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Or Paste Data</label>
              <textarea
                className="w-full h-48 p-3 border rounded-md font-mono text-sm"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste CSV or JSON data here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!importData.trim()}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

