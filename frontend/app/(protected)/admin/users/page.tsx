"use client";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";

export default function AdminUsersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");

  async function createUser() {
    const r = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, role })});
    if (r.ok) { setName(""); setEmail(""); setPassword(""); }
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="grid md:grid-cols-4 gap-3 items-end max-w-3xl">
        <div className="grid gap-1"><Label>Name</Label><Input value={name} onChange={(e)=>setName(e.target.value)} /></div>
        <div className="grid gap-1"><Label>Email</Label><Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
        <div className="grid gap-1"><Label>Password</Label><Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
        <div className="grid gap-1">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="STAFF">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="md:col-span-4" onClick={createUser}>Create user</Button>
      </div>
      <p className="text-muted-foreground">Listing/editing users can be added when backend endpoints are available.</p>
    </div>
  );
}