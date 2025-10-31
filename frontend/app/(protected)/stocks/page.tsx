"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import { StocksAPI } from "../../../lib/api";
import { Pencil, Trash2 } from "lucide-react";

type StockItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  reorderLevel?: number;
};

export default function StocksPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editItem, setEditItem] = useState<StockItem | null>(null);

  async function load() {
    try {
      const response = await StocksAPI.list();
      setItems(response.content || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load stock items");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSave(form: FormData) {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    
    setLoading(true);
    try {
      const data = {
        name: form.get("name") as string,
        category: selectedCategory,
        quantity: Number(form.get("quantity")),
        unit: form.get("unit") as string,
        unitPrice: Number(form.get("unitPrice")),
        reorderLevel: form.get("reorderLevel")
          ? Number(form.get("reorderLevel"))
          : 0,
      };
      
      if (editItem) {
        await StocksAPI.update(editItem.id, data);
        toast.success("Stock item updated");
      } else {
        await StocksAPI.create(data);
        toast.success("Stock item added");
      }
      
      setOpen(false);
      setSelectedCategory("");
      setEditItem(null);
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to save stock item");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Are you sure you want to delete this stock item?")) return;
    
    try {
      await StocksAPI.remove(id);
      toast.success("Stock item deleted");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete stock item");
    }
  }

  function openEditDialog(item: StockItem) {
    setEditItem(item);
    setSelectedCategory(item.category);
    setOpen(true);
  }

  function openCreateDialog() {
    setEditItem(null);
    setSelectedCategory("");
    setOpen(true);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stocks</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>Add item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editItem ? "Edit Stock Item" : "New Stock Item"}</DialogTitle>
              </DialogHeader>
              <form action={onSave} className="grid gap-3">
                <div className="grid gap-1">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={editItem?.name} required />
                </div>
                <div className="grid gap-1">
                  <Label>Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INGREDIENTS">Ingredients</SelectItem>
                      <SelectItem value="BEVERAGES">Beverages</SelectItem>
                      <SelectItem value="PACKAGING">Packaging</SelectItem>
                      <SelectItem value="CLEANING">Cleaning</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Quantity</Label>
                    <Input name="quantity" type="number" step="0.01" defaultValue={editItem?.quantity} required />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input name="unit" placeholder="kg, L, pcs" defaultValue={editItem?.unit} required />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      name="unitPrice"
                      type="number"
                      step="0.01"
                      defaultValue={editItem?.unitPrice}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Reorder Level</Label>
                  <Input name="reorderLevel" type="number" step="0.01" defaultValue={editItem?.reorderLevel} />
                </div>
                <Button disabled={loading} type="submit">
                  {loading ? "Saving..." : "Save"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Reorder</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => {
                  const low =
                    it.reorderLevel != null && it.quantity <= it.reorderLevel;
                  return (
                    <TableRow
                      key={it.id}
                      className={low ? "bg-amber-50" : undefined}
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        {it.name}{" "}
                        {low && <Badge variant="secondary">Low</Badge>}
                      </TableCell>
                      <TableCell>{it.category}</TableCell>
                      <TableCell>
                        {it.quantity} {it.unit}
                      </TableCell>
                      <TableCell>${it.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>{it.reorderLevel ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(it)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(it.id)}
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
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground py-6">
                No stock items yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
