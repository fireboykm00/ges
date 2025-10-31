"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { toast } from "sonner";
import { UsageAPI } from "../../../lib/api";
import { Pencil, Trash2 } from "lucide-react";

type StockItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

type Usage = {
  id: string;
  stockItemId: string;
  quantityUsed: number;
  date: string;
  purpose?: string;
};

export default function UsagePage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [history, setHistory] = useState<Usage[]>([]);
  const [stockItemId, setStockItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const { StocksAPI } = await import("../../../lib/api");
      const [stocksRes, usagesRes] = await Promise.all([
        StocksAPI.list(),
        UsageAPI.list(),
      ]);
      const stockItems = stocksRes.content || [];
      const usages = usagesRes.content || [];
      setItems(stockItems);
      setHistory(usages);
      if (stockItems.length > 0) {
        setStockItemId(stockItems[0].id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (!stockItemId) {
      toast.error("Please select a stock item");
      return;
    }
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const data = { stockItemId, quantity, date, notes };
      await UsageAPI.create(data);
      toast.success("Usage recorded");
      setQuantity(0);
      setNotes("");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to record usage");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Record Usage</h1>
      <div className="grid md:grid-cols-4 gap-3 items-end">
        <div>
          <Label>Item</Label>
          <Select value={stockItemId} onValueChange={setStockItemId}>
            <SelectTrigger>
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((it: any) => (
                <SelectItem key={it.id} value={it.id}>
                  {it.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Quantity</Label>
          <Input
            type="number"
            step="0.01"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Notes</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Sold / Kitchen use"
          />
        </div>
        <div className="md:col-span-4">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Save usage"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((u) => {
                  const item = items.find((it) => it.id === u.stockItemId);
                  return (
                    <TableRow key={u.id}>
                      <TableCell>{u.date}</TableCell>
                      <TableCell>{item?.name || u.stockItemId}</TableCell>
                      <TableCell>{u.quantityUsed || (u as any).quantity} {item?.unit || ""}</TableCell>
                      <TableCell>{u.purpose || (u as any).notes || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (!confirm("Are you sure you want to delete this usage record?")) return;
                              try {
                                await UsageAPI.remove(u.id);
                                toast.success("Usage deleted");
                                await load();
                              } catch (error: any) {
                                toast.error(error.message || "Failed to delete usage");
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {history.length === 0 && (
              <div className="text-sm text-muted-foreground py-6">
                No usage recorded yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
