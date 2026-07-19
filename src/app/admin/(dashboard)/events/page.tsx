"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getEvents, updateEvent, createEvent } from "@/lib/events"
import { deleteEventAction } from "@/actions/events"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Copy, Eye, EyeOff, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (error) {
      toast.error("Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteEventAction(deleteId)
      toast.success("Event and all its registrations deleted successfully")
      fetchEvents()
    } catch (error) {
      toast.error("Failed to delete event")
    } finally {
      setDeleteId(null)
    }
  }

  const handleTogglePublish = async (event: any) => {
    try {
      await updateEvent(event.id, { isPublished: !event.isPublished })
      toast.success(event.isPublished ? "Event unpublished" : "Event published")
      fetchEvents()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleDuplicate = async (event: any) => {
    try {
      const { id, createdAt, updatedAt, ...eventData } = event
      const duplicateData = {
        ...eventData,
        name: `${event.name} (Copy)`,
        slug: `${event.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        isPublished: false,
      }
      await createEvent(duplicateData)
      toast.success("Event duplicated")
      fetchEvents()
    } catch (error) {
      toast.error("Failed to duplicate event")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <Link href="/admin/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="glass-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Registrations</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No events found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">
                    {event.name}
                    <div className="text-xs text-muted-foreground">{event.slug}</div>
                  </TableCell>
                  <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {/* Placeholder for registration count */}
                    -- / {event.maxParticipants}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${event.isPublished ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {event.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(event)} title={event.isPublished ? "Unpublish" : "Publish"}>
                      {event.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(event)} title="Duplicate">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(event.id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the event
              and all associated registrations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
