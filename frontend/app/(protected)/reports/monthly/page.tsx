"use client";
import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { toast } from "sonner";
import { ReportsAPI } from "../../../../lib/api";

type MonthlyReport = {
  month: string;
  totalPurchases: number;
  totalExpenses: number;
  totalUsage: number;
  lowStockItems: number;
};

export default function MonthlyReportPage() {
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [data, setData] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const report = await ReportsAPI.monthly(month);
      setData(report);
    } catch (error: any) {
      toast.error(error.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [month]);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Monthly Report</h1>
      <div className="max-w-xs">
        <Label>Select Month</Label>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>
      {loading && (
        <div className="text-muted-foreground">Loading report...</div>
      )}
      {data && !loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Purchases</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              ${data.totalPurchases.toFixed(2)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              ${data.totalExpenses.toFixed(2)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Usage</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {data.totalUsage}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-amber-600">
              {data.lowStockItems}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
