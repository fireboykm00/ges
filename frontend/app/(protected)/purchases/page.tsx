"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { toast } from "sonner";
import { PurchasesAPI, SuppliersAPI } from "../../../lib/api";
import { Trash2 } from "lucide-react";

type Purchase = {
  id: string;
  date: string;
  supplierId?: string;
  totalAmount: number;
  items: any[];
};

type Supplier = {
  id: string;
  name: string;
};

export default function PurchasesPage() {
  const [rows, setRows] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  async function load() {
    try {
      const [purchasesRes, suppliersRes] = await Promise.all([
        PurchasesAPI.list(),
        SuppliersAPI.list(),
      ]);
      setRows(purchasesRes.content || []);
      setSuppliers(suppliersRes.content || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load purchases");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Are you sure you want to delete this purchase? This will NOT revert stock changes.")) return;
    
    try {
      await PurchasesAPI.remove(id);
      toast.success("Purchase deleted");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete purchase");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Purchases</CardTitle>
          <Link href="/purchases/new">
            <Button>New Purchase</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => {
                  const supplier = suppliers.find((s) => s.id === p.supplierId);
                  return (
                    <TableRow key={p.id}>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{supplier?.name || p.supplierId || "N/A"}</TableCell>
                      <TableCell>${p.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {rows.length === 0 && (
            <div className="text-sm text-muted-foreground py-6">
              No purchases yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
