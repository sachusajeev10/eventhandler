"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { EventForm } from "@/components/EventForm"
import { getEventById, updateEvent } from "@/lib/events"
import { EventFormData } from "@/lib/schema"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EditEventPage() {
  const [initialData, setInitialData] = useState<EventFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(id)
        if (!event) {
          toast.error("Event not found")
          router.push("/admin/events")
          return
        }
        // Exclude internal fields for form
        const { id: _, createdAt, updatedAt, ...formData } = event
        setInitialData(formData as EventFormData)
      } catch (error) {
        toast.error("Failed to load event")
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id, router])

  const handleSubmit = async (data: EventFormData) => {
    setIsSaving(true)
    try {
      await updateEvent(id, data)
      toast.success("Event updated successfully")
      router.push("/admin/events")
    } catch (error: any) {
      toast.error(error.message || "Failed to update event")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
      </div>
      
      {initialData && (
        <EventForm initialData={initialData} onSubmit={handleSubmit} isLoading={isSaving} />
      )}
    </div>
  )
}
