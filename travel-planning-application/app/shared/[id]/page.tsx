"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTripById, type Trip } from "@/lib/trips"
import { getTripStops, getTripActivities, type TripStop, type TripActivity } from "@/lib/itinerary"
import { Calendar, MapPin, DollarSign, Plane } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function SharedTripPage() {
  const params = useParams()
  const tripId = Number.parseInt(params.id as string)

  const [trip, setTrip] = useState<Trip | null>(null)
  const [stops, setStops] = useState<TripStop[]>([])
  const [stopsActivities, setStopsActivities] = useState<Record<number, TripActivity[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTripData = async () => {
      setIsLoading(true)
      try {
        const [tripData, stopsData] = await Promise.all([getTripById(tripId), getTripStops(tripId)])

        // Check if trip is public
        if (tripData && tripData.is_public !== 1) {
          setTrip(null)
          setIsLoading(false)
          return
        }

        setTrip(tripData)
        setStops(stopsData)

        // Load activities for each stop
        const activitiesMap: Record<number, TripActivity[]> = {}
        for (const stop of stopsData) {
          const activities = await getTripActivities(stop.id)
          activitiesMap[stop.id] = activities
        }
        setStopsActivities(activitiesMap)
      } catch (error) {
        console.error("[v0] Error loading shared trip:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTripData()
  }, [tripId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading trip...</p>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">GlobalTrotters</span>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Trip Not Available</h1>
          <p className="text-muted-foreground mb-6">This trip is private or does not exist</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const duration = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">GlobalTrotters</span>
          </Link>
          <Link href="/signup">
            <Button>Create Your Own Trip</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Badge className="mb-3">Shared Trip</Badge>
          <h1 className="text-4xl font-bold text-balance mb-2">{trip.name}</h1>
          {trip.description && <p className="text-lg text-muted-foreground">{trip.description}</p>}

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{stops.length} cities</span>
            </div>
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>{duration} days</span>
            </div>
          </div>
        </div>

        {stops.length === 0 ? (
          <Card className="p-12">
            <p className="text-center text-muted-foreground">No itinerary details available</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {stops.map((stop, index) => (
              <Card key={stop.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {stop.city_name}, {stop.city_country}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(stop.arrival_date)} - {formatDate(stop.departure_date)}
                        </span>
                        <span>
                          •{" "}
                          {Math.ceil(
                            (new Date(stop.departure_date).getTime() - new Date(stop.arrival_date).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  {stopsActivities[stop.id]?.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No activities planned</p>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-muted-foreground">ACTIVITIES</h3>
                      <div className="space-y-2">
                        {stopsActivities[stop.id]?.map((activity) => (
                          <div key={activity.id} className="p-3 rounded-lg border">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-2">
                                  <h4 className="font-medium">{activity.activity_name}</h4>
                                  {activity.activity_category && (
                                    <Badge variant="secondary" className="text-xs">
                                      {activity.activity_category}
                                    </Badge>
                                  )}
                                </div>
                                {activity.activity_description && (
                                  <p className="text-sm text-muted-foreground mt-1">{activity.activity_description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  {activity.estimated_cost && (
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      <span>${activity.estimated_cost.toFixed(2)}</span>
                                    </div>
                                  )}
                                  {activity.duration_hours && <span>{activity.duration_hours}h</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Create Your Own Trip</h3>
            <p className="text-muted-foreground mb-4">Start planning your perfect adventure with GlobalTrotters</p>
            <Link href="/signup">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2026 GlobalTrotters. Built with v0.</p>
        </div>
      </footer>
    </div>
  )
}
