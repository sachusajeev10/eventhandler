import { getEventBySlug } from "@/lib/server-events"
import { notFound } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, UsersIcon, Trophy } from "lucide-react"
import { RegistrationForm } from "@/components/RegistrationForm"

// Revalidate every minute
export const revalidate = 60

type Props = {
  params: Promise<{ eventSlug: string }>
}

export default async function EventRegistrationPage({ params }: Props) {
  const { eventSlug } = await params
  const event = await getEventBySlug(eventSlug)

  if (!event) {
    notFound()
  }

  // Calculate if registration is open based on deadline
  const isRegistrationOpen = new Date() <= new Date(event.registrationDeadline)
  
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-card rounded-3xl overflow-hidden border shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SIDE: Poster and Details (7 columns) */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-border">
            {/* Banner/Poster Image */}
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] w-full bg-muted">
              <Image
                src={event.posterUrl || "/placeholder.jpg"}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent lg:hidden" />
            </div>
            
            <div className="p-6 md:p-10 space-y-8 flex-1 flex flex-col bg-background/50">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">{event.name}</h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground font-medium">
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span>{format(new Date(event.date), "PPP")} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                    <MapPinIcon className="h-4 w-4 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                    <UsersIcon className="h-4 w-4 text-primary" />
                    <span>Max {event.maxParticipants} Participants</span>
                  </div>
                </div>
              </div>

              {event.winnerPrize && (
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Trophy className="w-24 h-24 text-amber-500" />
                  </div>
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500">
                      <Trophy className="w-6 h-6" /> Winner Prize Pool
                    </h3>
                    <p className="whitespace-pre-wrap text-foreground/90 font-medium text-lg">{event.winnerPrize}</p>
                  </div>
                </div>
              )}

              <div className="prose prose-neutral dark:prose-invert max-w-none prose-lg">
                <p className="whitespace-pre-wrap leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Registration Form (5 columns) */}
          <div className="lg:col-span-5 p-6 md:p-10 bg-muted/10 relative">
            <div className="sticky top-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Register Now</h2>
                <p className="text-muted-foreground">Secure your spot for {event.name}</p>
              </div>
              
              {!isRegistrationOpen ? (
                <div className="p-6 border border-destructive/50 bg-destructive/10 text-destructive rounded-xl text-center shadow-inner">
                  <div className="text-xl font-bold mb-2">Registration Closed</div>
                  <p>The deadline to register was {format(new Date(event.registrationDeadline), "PPP")}.</p>
                </div>
              ) : (
                <RegistrationForm event={event} />
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
