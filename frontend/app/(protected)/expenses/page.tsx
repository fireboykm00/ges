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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { toast } from "sonner";
import { ExpensesAPI } from "../../../lib/api";
import { Pencil, Trash2 } from "lucide-react";

type Expense = {
  id: string;
  category: string;
  description?: string;
  amount: number;
  date: string;
};

export default function ExpensesPage() {
  const [rows, setRows] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [defaultDate] = useState(new Date().toISOString().slice(0, 10));
  const [editItem, setEditItem] = useState<Expense | null>(null);

  async function load() {
    try {
      const response = await ExpensesAPI.list();
      setRows(response.content || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load expenses");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSave(form: FormData) {
    setLoading(true);
    try {
      const data = {
        category: form.get("category") as string,
        description: form.get("description") as string,
        amount: Number(form.get("amount")),
        date: form.get("date") as string,
      };
      
      if (editItem) {
        await ExpensesAPI.update(editItem.id, data);
        toast.success("Expense updated");
      } else {
        await ExpensesAPI.create(data);
        toast.success("Expense added");
      }
      
      setOpen(false);
      setEditItem(null);
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to save expense");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      await ExpensesAPI.remove(id);
      toast.success("Expense deleted");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete expense");
    }
  }

  function openEditDialog(item: Expense) {
    setEditItem(item);
    setOpen(true);
  }

  function openCreateDialog() {
    setEditItem(null);
    setOpen(true);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expenses</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>Add expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editItem ? "Edit Expense" : "New Expense"}</DialogTitle>
              </DialogHeader>
              <form action={onSave} className="grid gap-3">
                <div className="grid gap-1">
                  <Label>Category</Label>
                  <Input name="category" defaultValue={editItem?.category} required />
                </div>
                <div className="grid gap-1">
                  <Label>Description</Label>
                  <Input name="description" defaultValue={editItem?.description} />
                </div>
                <div className="grid gap-1">
                  <Label>Amount</Label>
                  <Input name="amount" type="number" step="0.01" defaultValue={editItem?.amount} required />
                </div>
                <div className="grid gap-1">
                  <Label>Date</Label>
                  <Input name="date" type="date" defaultValue={editItem?.date || defaultDate} required />
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
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.date}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell>{e.description || "-"}</TableCell>
                    <TableCell>${e.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(e)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(e.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {rows.length === 0 && (
            <div className="text-sm text-muted-foreground py-6">
              No expenses yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
