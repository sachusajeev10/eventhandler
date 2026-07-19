"use client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function LogoutButton() {
  const { logout } = useAuth()
  
  return (
    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary" onClick={logout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}
