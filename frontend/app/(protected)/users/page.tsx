"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { toast } from "sonner";
import * as apiClient from "../../../lib/apiClient";
import { Pencil, Trash2, UserPlus } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  active: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  async function load() {
    try {
      const res = await apiClient.get<any>(`/api/users`);
      setUsers(res.content || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate() {
    if (!editUser) return;
    setLoading(true);
    try {
      await apiClient.put(`/api/users/${editUser.id}`, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        active: editUser.active,
      });
      toast.success("User updated");
      setEditOpen(false);
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient.del(`/api/users/${id}`);
      toast.success("User deleted");
      await load();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button onClick={() => (window.location.href = "/register")}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.active ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={editOpen && editUser?.id === user.id} onOpenChange={setEditOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditUser(user)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input
                                  value={editUser?.name || ""}
                                  onChange={(e) =>
                                    setEditUser(
                                      editUser
                                        ? { ...editUser, name: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={editUser?.email || ""}
                                  onChange={(e) =>
                                    setEditUser(
                                      editUser
                                        ? { ...editUser, email: e.target.value }
                                        : null
                                    )
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Role</Label>
                                <Select
                                  value={editUser?.role || ""}
                                  onValueChange={(value: any) =>
                                    setEditUser(
                                      editUser ? { ...editUser, role: value } : null
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                    <SelectItem value="STAFF">Staff</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="active"
                                  checked={editUser?.active || false}
                                  onChange={(e) =>
                                    setEditUser(
                                      editUser
                                        ? { ...editUser, active: e.target.checked }
                                        : null
                                    )
                                  }
                                  className="rounded"
                                />
                                <Label htmlFor="active">Active</Label>
                              </div>
                              <Button onClick={handleUpdate} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users.length === 0 && (
              <div className="text-sm text-muted-foreground py-6 text-center">
                No users found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
