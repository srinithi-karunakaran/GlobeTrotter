"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AddStopDialog } from "@/components/add-stop-dialog"
import { ActivitySelector } from "@/components/activity-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { getTripById, type Trip } from "@/lib/trips"
import {
  getTripStops,
  getTripActivities,
  deleteTripStop,
  deleteTripActivity,
  type TripStop,
  type TripActivity,
} from "@/lib/itinerary"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, Calendar, Trash2, Plus, DollarSign } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function EditTripPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const tripId = Number.parseInt(params.id as string)

  const [trip, setTrip] = useState<Trip | null>(null)
  const [stops, setStops] = useState<TripStop[]>([])
  const [stopsActivities, setStopsActivities] = useState<Record<number, TripActivity[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const loadTripData = async () => {
    setIsLoading(true)
    try {
      const [tripData, stopsData] = await Promise.all([getTripById(tripId), getTripStops(tripId)])

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
      toast({
        title: "Error",
        description: "Failed to load trip data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadTripData()
    }
  }, [user, tripId, toast])

  const handleDeleteStop = async (stopId: number) => {
    if (!confirm("Remove this city from your trip?")) return

    const success = await deleteTripStop(stopId)
    if (success) {
      toast({
        title: "Stop removed",
        description: "The city has been removed from your trip",
      })
      loadTripData()
    } else {
      toast({
        title: "Error",
        description: "Failed to remove stop",
        variant: "destructive",
      })
    }
  }

  const handleDeleteActivity = async (activityId: number) => {
    if (!confirm("Remove this activity from your trip?")) return

    const success = await deleteTripActivity(activityId)
    if (success) {
      toast({
        title: "Activity removed",
        description: "The activity has been removed",
      })
      loadTripData()
    } else {
      toast({
        title: "Error",
        description: "Failed to remove activity",
        variant: "destructive",
      })
    }
  }

  if (authLoading || !user || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Trip not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="bg-transparent">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-balance">{trip.name}</h1>
            <p className="text-muted-foreground mt-1">
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </p>
          </div>
          <AddStopDialog tripId={tripId} onStopAdded={loadTripData}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stop
            </Button>
          </AddStopDialog>
        </div>

        {stops.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-muted rounded-full">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">No stops yet</h3>
                <p className="text-muted-foreground mt-1">Start building your itinerary by adding cities</p>
              </div>
              <AddStopDialog tripId={tripId} onStopAdded={loadTripData} />
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {stops.map((stop, index) => (
              <Card key={stop.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex items-start justify-between">
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
                        {stop.notes && <p className="text-sm text-muted-foreground mt-2">{stop.notes}</p>}
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => handleDeleteStop(stop.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-muted-foreground">ACTIVITIES</h3>
                      <ActivitySelector cityId={stop.city_id} tripStopId={stop.id} onActivityAdded={loadTripData} />
                    </div>

                    {stopsActivities[stop.id]?.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No activities added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {stopsActivities[stop.id]?.map((activity) => (
                          <div key={activity.id} className="flex items-start justify-between p-3 rounded-lg border">
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
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {activity.activity_description}
                                </p>
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

                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => handleDeleteActivity(activity.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
