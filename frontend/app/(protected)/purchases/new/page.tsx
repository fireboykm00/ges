"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { toast } from "sonner";
import { PurchasesAPI, StocksAPI, SuppliersAPI } from "../../../../lib/api";

export default function NewPurchasePage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [lines, setLines] = useState<{stockItemId:string; quantity:number; price:number}[]>([]);
  const [supplierId, setSupplierId] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const total = useMemo(()=> lines.reduce((s,l)=> s + (l.quantity*l.price), 0), [lines]);

  useEffect(()=>{
    (async()=>{
      try {
        const [suppliersRes, stocksRes] = await Promise.all([
          SuppliersAPI.list(),
          StocksAPI.list(),
        ]);
        setSuppliers(suppliersRes.content || []);
        setItems(stocksRes.content || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoadingData(false);
      }
    })();
  },[]);

  function addLine() { setLines([...lines, { stockItemId: items[0]?.id || "", quantity: 1, price: 0 }]); }
  function updateLine(i:number, patch: Partial<{stockItemId:string; quantity:number; price:number}>) {
    setLines(lines.map((l,idx)=> idx===i? { ...l, ...patch }: l));
  }
  function removeLine(i:number) { setLines(lines.filter((_,idx)=> idx!==i)); }

  async function onSubmit() {
    if (!supplierId) {
      toast.error("Please select a supplier");
      return;
    }
    if (lines.length === 0) {
      toast.error("Please add at least one item");
      return;
    }
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].stockItemId) {
        toast.error(`Please select an item for line ${i + 1}`);
        return;
      }
      if (lines[i].quantity <= 0) {
        toast.error(`Quantity must be greater than 0 for line ${i + 1}`);
        return;
      }
      if (lines[i].price < 0) {
        toast.error(`Price cannot be negative for line ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      const body = { supplierId, date, items: lines };
      await PurchasesAPI.create(body);
      toast.success("Purchase created successfully");
      router.push("/purchases");
    } catch (error: any) {
      toast.error(error.message || "Failed to create purchase");
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="grid gap-6">
        <h1 className="text-2xl font-semibold">New Purchase</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">New Purchase</h1>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid gap-1">
            <Label>Supplier</Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
              <SelectContent>
                {suppliers.map((s:any)=> <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          {lines.map((l, i)=> (
            <div key={i} className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end">
              <div>
                <Label>Item</Label>
                <Select value={l.stockItemId} onValueChange={(v)=>updateLine(i,{stockItemId:v})}>
                  <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                  <SelectContent>
                    {items.map((it:any)=> <SelectItem key={it.id} value={it.id}>{it.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Qty</Label><Input type="number" step="0.01" value={l.quantity} onChange={(e)=>updateLine(i,{quantity:Number(e.target.value)})} /></div>
              <div><Label>Price</Label><Input type="number" step="0.01" value={l.price} onChange={(e)=>updateLine(i,{price:Number(e.target.value)})} /></div>
              <Button type="button" variant="outline" onClick={()=>removeLine(i)}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addLine}>Add line</Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-xl font-semibold">${total.toFixed(2)}</div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSubmit} disabled={loading || lines.length === 0}>
            {loading ? "Submitting..." : "Submit Purchase"}
          </Button>
        </div>
      </div>
    </div>
  );
}