"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { TripCard } from "@/components/trip-card"
import { CreateTripDialog } from "@/components/create-trip-dialog"
import { useAuth } from "@/components/auth-provider"
import { getUserTrips, deleteTrip, getPopularCities, type TripWithStats } from "@/lib/trips"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [trips, setTrips] = useState<TripWithStats[]>([])
  const [popularCities, setPopularCities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const [userTrips, cities] = await Promise.all([getUserTrips(user.id), getPopularCities(6)])
        setTrips(userTrips)
        setPopularCities(cities)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, toast])

  const handleDeleteTrip = async (tripId: number) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    const success = await deleteTrip(tripId)

    if (success) {
      setTrips(trips.filter((t) => t.id !== tripId))
      toast({
        title: "Trip deleted",
        description: "Your trip has been removed",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      })
    }
  }

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground mt-1">Plan your next adventure or continue an existing trip</p>
          </div>
          <CreateTripDialog />
        </div>

        {/* Popular Destinations */}
        {popularCities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold">Popular Destinations</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularCities.map((city) => (
                <Card key={city.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{city.name}</h3>
                    <p className="text-xs text-muted-foreground">{city.country}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      ${city.cost_index}/day
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* My Trips */}
        <section>
          <h2 className="text-xl font-semibold mb-4">My Trips</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video" />
                  <CardContent className="pt-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-muted rounded-full">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">No trips yet</h3>
                  <p className="text-muted-foreground mt-1">Start planning your first adventure!</p>
                </div>
                <CreateTripDialog />
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
