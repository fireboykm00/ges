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
import { SuppliersAPI } from "../../../lib/api";
import { Pencil, Trash2 } from "lucide-react";

type Supplier = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
};

export default function SuppliersPage() {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<Supplier | null>(null);

  async function load() {
    try {
      const response = await SuppliersAPI.list();
      setRows(response.content || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load suppliers");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSave(form: FormData) {
    setLoading(true);
    try {
      const data = {
        name: form.get("name") as string,
        phone: form.get("phone") as string,
        email: form.get("email") as string,
        address: form.get("address") as string,
      };
      
      if (editItem) {
        await SuppliersAPI.update(editItem.id, data);
        toast.success("Supplier updated");
      } else {
        await SuppliersAPI.create(data);
        toast.success("Supplier added");
      }
      
      setOpen(false);
      setEditItem(null);
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to save supplier");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    
    try {
      await SuppliersAPI.remove(id);
      toast.success("Supplier deleted");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete supplier");
    }
  }

  function openEditDialog(item: Supplier) {
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
          <CardTitle>Suppliers</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>Add supplier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editItem ? "Edit Supplier" : "New Supplier"}</DialogTitle>
              </DialogHeader>
              <form action={onSave} className="grid gap-3">
                <div className="grid gap-1">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={editItem?.name} required />
                </div>
                <div className="grid gap-1">
                  <Label>Phone</Label>
                  <Input name="phone" defaultValue={editItem?.phone} />
                </div>
                <div className="grid gap-1">
                  <Label>Email</Label>
                  <Input name="email" type="email" defaultValue={editItem?.email} />
                </div>
                <div className="grid gap-1">
                  <Label>Address</Label>
                  <Input name="address" defaultValue={editItem?.address} />
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
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(s)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(s.id)}
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
              No suppliers yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
