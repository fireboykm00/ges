"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Package, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import * as apiClient from "../../../lib/apiClient";
import Link from "next/link";
import { Button } from "../../../components/ui/button";

type DashboardStats = {
  totalStockValue: number;
  lowStockCount: number;
  monthlyExpenses: number;
  monthlyPurchases: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStockValue: 0,
    lowStockCount: 0,
    monthlyExpenses: 0,
    monthlyPurchases: 0,
  });
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const [stocksRes, expensesRes, purchasesRes] = await Promise.all([
        apiClient.get<any>(`/api/stocks?size=1000`),
        apiClient.get<any>(`/api/expenses?size=1000`),
        apiClient.get<any>(`/api/purchases?size=1000`),
      ]);

      const stocks = stocksRes.content || [];
      const expenses = expensesRes.content || [];
      const purchases = purchasesRes.content || [];

      // Calculate total stock value
      const totalStockValue = stocks.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unitPrice,
        0
      );

      // Count low stock items
      const lowStockCount = stocks.filter(
        (item: any) => item.reorderLevel && item.quantity <= item.reorderLevel
      ).length;

      // Calculate current month's expenses
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyExpenses = expenses
        .filter((e: any) => e.date?.startsWith(currentMonth))
        .reduce((sum: number, e: any) => sum + e.amount, 0);

      // Calculate current month's purchases
      const monthlyPurchases = purchases
        .filter((p: any) => p.date?.startsWith(currentMonth))
        .reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0);

      setStats({
        totalStockValue,
        lowStockCount,
        monthlyExpenses,
        monthlyPurchases,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/reports/monthly">
          <Button variant="outline">View Reports</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Stock Value
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalStockValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current inventory value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {stats.lowStockCount}
                </div>
                <p className="text-xs text-muted-foreground">Need reordering</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Expenses
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.monthlyExpenses.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Purchases
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.monthlyPurchases.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link href="/stocks">
                  <Button variant="outline" className="w-full justify-start">
                    View Stocks
                  </Button>
                </Link>
                <Link href="/usage">
                  <Button variant="outline" className="w-full justify-start">
                    Record Usage
                  </Button>
                </Link>
                <Link href="/expenses">
                  <Button variant="outline" className="w-full justify-start">
                    Add Expense
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
