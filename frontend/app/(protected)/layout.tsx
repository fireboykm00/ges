"use client";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Separator } from "../../components/ui/separator";
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingCart, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  UtensilsCrossed
} from "lucide-react";
import { toast } from "sonner";

type UserRole = "ADMIN" | "MANAGER" | "STAFF";
type User = { sub?: string; name?: string; email?: string; role?: UserRole };

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      }
    }
    checkAuth();
  }, [router, pathname]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  async function handleLogout() {
    try {
      // Clear localStorage token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <Nav role={user?.role} />
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                GES Restaurant
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="grid md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block border-r bg-gray-50/50 min-h-[calc(100vh-4rem)]">
          <Nav role={user?.role} />
        </aside>
        <main className="p-6 bg-gray-50/30">{children}</main>
      </div>
    </div>
  );
}

function Nav({ role }: { role?: UserRole }) {
  const isAdmin = role === "ADMIN";
  const isManager = role === "MANAGER" || isAdmin;
  const isStaff = role === "STAFF" || isManager;

  return (
    <div className="h-full p-4">
      <nav className="grid gap-1 text-sm">
        <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/dashboard">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <span>Dashboard</span>
        </Link>
        <Separator className="my-2" />
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inventory</div>
        <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/stocks">
          <Package className="w-4 h-4 text-green-600" />
          <span>Stocks</span>
        </Link>
        <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/suppliers">
          <Truck className="w-4 h-4 text-purple-600" />
          <span>Suppliers</span>
        </Link>
        <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/purchases">
          <ShoppingCart className="w-4 h-4 text-indigo-600" />
          <span>Purchases</span>
        </Link>
        <Separator className="my-2" />
        <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Operations</div>
        <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/usage">
          <TrendingDown className="w-4 h-4 text-orange-600" />
          <span>Usage</span>
        </Link>
        {isManager && (
          <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/expenses">
            <DollarSign className="w-4 h-4 text-red-600" />
            <span>Expenses</span>
          </Link>
        )}
        {isManager && (
          <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/reports/monthly">
            <BarChart3 className="w-4 h-4 text-cyan-600" />
            <span>Reports</span>
          </Link>
        )}
        {isAdmin && (
          <>
            <Separator className="my-2" />
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Management</div>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all" href="/users">
              <Users className="w-4 h-4 text-pink-600" />
              <span>Users</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}