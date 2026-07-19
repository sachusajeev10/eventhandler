"use client"
import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Download, ExternalLink } from "lucide-react"
import { format } from "date-fns"

export default function RegistrationsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all events for the dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events")
        const snapshot = await getDocs(query(eventsRef, orderBy("createdAt", "desc")))
        const eventsList = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }))
        setEvents(eventsList)
        if (eventsList.length > 0) {
          setSelectedEvent(eventsList[0].id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to load events", error)
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Fetch registrations for the selected event
  useEffect(() => {
    if (!selectedEvent) return
    
    const fetchRegistrations = async () => {
      setLoading(true)
      try {
        const q = query(
          collection(db, "registrations"), 
          where("eventId", "==", selectedEvent)
        )
        const snapshot = await getDocs(q)
        
        // Sort manually because compound index might not exist
        const regs = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime())
        
        setRegistrations(regs)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRegistrations()
  }, [selectedEvent])

  const handleExportCSV = () => {
    if (registrations.length === 0) return

    // Collect all possible keys from submittedFields
    const customFieldKeys = new Set<string>()
    registrations.forEach(reg => {
      if (reg.submittedFields) {
        Object.keys(reg.submittedFields).forEach(key => customFieldKeys.add(key))
      }
    })
    const customFieldsArray = Array.from(customFieldKeys)

    // Build headers
    const headers = [
      "Name", 
      "Email", 
      "Phone", 
      "Registration Time", 
      "Payment Screenshot URL", 
      ...customFieldsArray
    ]

    // Build rows
    const rows = registrations.map(reg => {
      const baseData = [
        `"${reg.name || ''}"`,
        `"${reg.email || ''}"`,
        `"${reg.phone || ''}"`,
        `"${reg.submissionTime ? format(new Date(reg.submissionTime), "PPp") : ''}"`,
        `"${reg.paymentScreenshotUrl || ''}"`
      ]

      const customData = customFieldsArray.map(key => {
        let val = reg.submittedFields?.[key] || ""
        if (Array.isArray(val)) val = val.join(", ")
        return `"${val.replace(/"/g, '""')}"` // escape quotes
      })

      return [...baseData, ...customData].join(",")
    })

    const csvContent = [headers.join(","), ...rows].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `registrations_${selectedEvent}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {events.length > 0 && (
            <Select value={selectedEvent} onValueChange={(val) => setSelectedEvent(val || "")}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button onClick={handleExportCSV} disabled={registrations.length === 0} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="glass-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Registration Time</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Custom Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">Loading registrations...</p>
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No events found.
                </TableCell>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No registrations found for this event.
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-medium text-base">{reg.name || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm">{reg.email || "N/A"}</span>
                      <span className="text-sm text-muted-foreground">{reg.phone || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reg.submissionTime ? format(new Date(reg.submissionTime), "PPp") : "N/A"}
                  </TableCell>
                  <TableCell>
                    {reg.paymentScreenshotUrl ? (
                      <a href={reg.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                        View Receipt <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No payment</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-xs text-muted-foreground">
                      {reg.submittedFields && Object.keys(reg.submittedFields).length > 0 
                        ? JSON.stringify(reg.submittedFields) 
                        : "No custom fields"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
