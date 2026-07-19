"use client"
import { useEffect, useState } from "react"
import { collection, getCountFromServer } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users } from "lucide-react"

export default function DashboardPage() {
  const [eventCount, setEventCount] = useState(0)
  const [regCount, setRegCount] = useState(0)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const eventsSnap = await getCountFromServer(collection(db, "events"))
        setEventCount(eventsSnap.data().count)
        
        const regsSnap = await getCountFromServer(collection(db, "registrations"))
        setRegCount(regsSnap.data().count)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCounts()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
