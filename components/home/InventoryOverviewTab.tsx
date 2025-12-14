import { StatsCards } from "@/components/dashboard/stats-cards";
import { InventoryChart } from "@/components/dashboard/inventory-chart";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { InventoryItem } from "@/types/inventory";

type InventoryOverviewTabProps = {
  items: InventoryItem[];
};

export function InventoryOverviewTab({ items }: InventoryOverviewTabProps) {
  return (
    <div className="space-y-6">
      <StatsCards items={items} />
      <InventoryChart items={items} />
      <LowStockAlerts items={items} />
    </div>
  );
}