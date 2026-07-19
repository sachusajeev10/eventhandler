import { getPublishedEvents } from "@/lib/server-events"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { MotionDiv } from "@/components/MotionDiv"

export const revalidate = 60 

export default async function HomePage() {
  const events = await getPublishedEvents()

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Discover Amazing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Events</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-[600px]">
          Register for the most exciting events happening around you. Simple, fast, and beautiful.
        </p>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No events are currently available. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any, i: number) => (
            <MotionDiv 
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass-card overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={event.posterUrl || "/placeholder.jpg"}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(new Date(event.date), "MMM d, yyyy")} {event.time ? `at ${event.time}` : ''}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    {event.venue}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/register/${event.slug}`} className="w-full">
                    <Button className="w-full relative overflow-hidden group">
                      <span className="relative z-10">Register Now</span>
                      <div className="absolute inset-0 bg-primary-foreground/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </MotionDiv>
          ))}
        </div>
      )}
    </div>
  )
}
