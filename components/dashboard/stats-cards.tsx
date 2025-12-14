"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";
import { Package, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  items: InventoryItem[];
}

export function StatsCards({ items }: StatsCardsProps) {
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.quantity < (item.reorderThreshold || item.minStock || 0)).length;
  const inStockItems = items.filter(item => item.quantity >= (item.reorderThreshold || item.minStock || 0)).length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const categories = new Set(items.map(item => item.category)).size;

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      description: `${categories} categories`,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Low Stock",
      value: lowStockItems,
      description: "Need restocking",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "In Stock",
      value: inStockItems,
      description: "Available items",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Quantity",
      value: totalQuantity.toFixed(0),
      description: "All items combined",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

