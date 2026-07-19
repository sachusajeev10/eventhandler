"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { EventForm } from "@/components/EventForm"
import { createEvent } from "@/lib/events"
import { EventFormData } from "@/lib/schema"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: EventFormData) => {
    setIsLoading(true)
    try {
      await createEvent(data)
      toast.success("Event created successfully")
      router.push("/admin/events")
    } catch (error: any) {
      toast.error(error.message || "Failed to create event")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
      </div>
      
      <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
