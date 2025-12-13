"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/types/inventory";
import { AlertTriangle } from "lucide-react";

interface LowStockAlertsProps {
  items: InventoryItem[];
}

export function LowStockAlerts({ items }: LowStockAlertsProps) {
  const lowStockItems = items
    .filter(item => item.quantity < item.minStock)
    .sort((a, b) => (a.quantity / a.minStock) - (b.quantity / b.minStock))
    .slice(0, 5);

  if (lowStockItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-500" />
            Low Stock Alerts
          </CardTitle>
          <CardDescription>All items are well stocked</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No items need restocking at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>{lowStockItems.length} items need immediate attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => {
            const percentage = (item.quantity / item.minStock) * 100;
            return (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{item.name}</p>
                    <Badge variant="destructive" className="text-xs">
                      {item.quantity} / {item.minStock} {item.unit}
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

