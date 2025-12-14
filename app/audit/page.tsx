"use client";

import { useState, useEffect, useMemo } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAuditLog, AuditLogEntry } from "@/lib/audit-trail";
import { Search, History, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AuditLogPage() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");

  useEffect(() => {
    const log = getAuditLog();
    setAuditLog(log);
  }, []);

  const filteredLog = useMemo(() => {
    let filtered = [...auditLog];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.itemName.toLowerCase().includes(searchLower) ||
          entry.userName.toLowerCase().includes(searchLower) ||
          entry.reason?.toLowerCase().includes(searchLower)
      );
    }

    if (filterAction !== "all") {
      filtered = filtered.filter((entry) => entry.action === filterAction);
    }

    return filtered;
  }, [auditLog, searchTerm, filterAction]);

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "created":
        return "default";
      case "updated":
        return "default";
      case "deleted":
        return "destructive";
      case "quantity_adjusted":
        return "default";
      default:
        return "default";
    }
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
              <p className="text-muted-foreground">Track all inventory changes and activities</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>View all inventory changes and adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by item, user, or reason..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                    <SelectItem value="quantity_adjusted">Quantity Adjusted</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterAction("all");
                  }}
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
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLog.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <History className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No audit log entries found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLog.map((entry) => (
                        <TableRow key={entry._id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">{entry.itemName}</TableCell>
                          <TableCell>
                            <Badge variant={getActionBadgeVariant(entry.action)}>
                              {formatAction(entry.action)}
                            </Badge>
                          </TableCell>
                          <TableCell>{entry.userName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {entry.action === "quantity_adjusted" && (
                              <div>
                                <p>
                                  {entry.previousQuantity} → {entry.newQuantity} (
                                  {entry.adjustment && entry.adjustment > 0 ? "+" : ""}
                                  {entry.adjustment} {entry.adjustment && entry.adjustment > 0 ? "added" : "removed"})
                                </p>
                                {entry.reason && (
                                  <p className="text-xs mt-1 italic">Reason: {entry.reason}</p>
                                )}
                              </div>
                            )}
                            {entry.action === "created" && <p>Item created</p>}
                            {entry.action === "updated" && <p>Item updated</p>}
                            {entry.action === "deleted" && <p>Item deleted</p>}
                            {entry.details && <p className="text-xs mt-1">{entry.details}</p>}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

