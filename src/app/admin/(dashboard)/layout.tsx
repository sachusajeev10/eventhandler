import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { LogoutButton } from "@/components/LogoutButton"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-card/50 backdrop-blur-xl">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin/dashboard" className="font-bold text-lg text-primary">
              Admin Panel
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/admin/events" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors">
              <Calendar className="h-4 w-4" />
              Events
            </Link>
            <Link href="/admin/registrations" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors">
              <Users className="h-4 w-4" />
              Registrations
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
          <div className="p-4 border-t">
            <LogoutButton />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="md:hidden font-bold text-primary">Admin Panel</div>
            <div className="flex flex-1 items-center justify-end gap-4">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
