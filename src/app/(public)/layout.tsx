import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-primary">EventMaster</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/admin/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Admin Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 sm:px-6 lg:px-8">
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            Built for modern event management.
          </p>
        </div>
      </footer>
    </div>
  )
}
