import Link from "next/link";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Badge className="hidden sm:inline-flex" variant="secondary">GES</Badge>
            <span className="font-semibold tracking-tight">Restaurant Management</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost">Login</Button></Link>
            <Link href="/register"><Button>Get started</Button></Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="uppercase tracking-wider">New</Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Run your restaurant with clarity and control
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Real-time stock, purchases, usage, expenses and reports — all in one place. Secure, fast, and easy to use.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login"><Button size="lg">Launch dashboard</Button></Link>
                <Link href="/docs"><Button variant="outline" size="lg">View docs</Button></Link>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <div>JWT-secured API</div>
                <Separator orientation="vertical" className="h-4" />
                <div>Role-based access</div>
                <Separator orientation="vertical" className="h-4" />
                <div>MySQL + JPA</div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Low stock alerts</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Stay ahead with thresholds and quick restock insights.
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Purchases & usage</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Accurate increment/decrement of inventory with history.
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Expenses tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Categorize spend and monitor monthly totals.
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Reports</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Monthly summaries with KPIs at a glance.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Secondary section */}
        <section>
          <div className="mx-auto max-w-6xl px-4 py-14 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Secure by default</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                JWT authentication, role-based routes, and sensible CORS defaults.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fast and reliable</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Built with Spring Boot 3 + MySQL; paginated APIs ready for scale.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Beautiful UI</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Powered by shadcn/ui and Tailwind CSS for a clean experience.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} GES</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
