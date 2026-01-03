"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { ShareTripDialog } from "@/components/share-trip-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { getTripById, type Trip } from "@/lib/trips"
import { getTripStops, type TripStop } from "@/lib/itinerary"
import { getTripBudgetBreakdown, getDailyBudget, type BudgetBreakdown } from "@/lib/budget"
import { getTripTimeline, type TimelineEvent } from "@/lib/timeline"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, DollarSign, MapPin, Edit, PieChart, Clock, Activity } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts"

export default function ViewTripPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const tripId = Number.parseInt(params.id as string)

  const [trip, setTrip] = useState<Trip | null>(null)
  const [stops, setStops] = useState<TripStop[]>([])
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null)
  const [dailyBudget, setDailyBudget] = useState<any[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const loadTripData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const [tripData, stopsData, budgetData, dailyData, timelineData] = await Promise.all([
        getTripById(tripId),
        getTripStops(tripId),
        getTripBudgetBreakdown(tripId),
        getDailyBudget(tripId),
        getTripTimeline(tripId),
      ])

      setTrip(tripData)
      setStops(stopsData)
      setBudget(budgetData)
      setDailyBudget(dailyData)
      setTimeline(timelineData)
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
    loadTripData()
  }, [user, tripId, toast])

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

  const duration = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  const budgetChartData = budget
    ? [
        { name: "Activities", value: budget.activities, color: "hsl(var(--chart-1))" },
        { name: "Transport", value: budget.transport, color: "hsl(var(--chart-2))" },
        { name: "Accommodation", value: budget.accommodation, color: "hsl(var(--chart-3))" },
        { name: "Meals", value: budget.meals, color: "hsl(var(--chart-4))" },
        { name: "Other", value: budget.other, color: "hsl(var(--chart-5))" },
      ].filter((item) => item.value > 0)
    : []

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="bg-transparent">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-balance">{trip.name}</h1>
            {trip.description && <p className="text-muted-foreground mt-1">{trip.description}</p>}
          </div>
          <Link href={`/trip/${tripId}/edit`}>
            <Button variant="outline" className="bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <ShareTripDialog tripId={tripId} isPublic={trip.is_public === 1} onUpdate={loadTripData} />
        </div>

        {/* Trip Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-xl font-semibold">{duration} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cities</p>
                  <p className="text-xl font-semibold">{stops.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Activities</p>
                  <p className="text-xl font-semibold">{timeline.filter((e) => e.type === "activity").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-xl font-semibold">${budget?.total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="budget">
              <PieChart className="h-4 w-4 mr-2" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="itinerary">
              <MapPin className="h-4 w-4 mr-2" />
              Itinerary
            </TabsTrigger>
          </TabsList>

          {/* Timeline View */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trip Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No timeline events yet</p>
                ) : (
                  <div className="space-y-4">
                    {timeline.map((event, index) => (
                      <div key={`${event.type}-${event.id}`} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              event.type === "arrival"
                                ? "bg-primary/10 text-primary"
                                : event.type === "departure"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {event.type === "activity" ? (
                              <Activity className="h-5 w-5" />
                            ) : (
                              <MapPin className="h-5 w-5" />
                            )}
                          </div>
                          {index < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                        </div>

                        <div className="flex-1 pb-8">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{event.title}</h3>
                                {event.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {event.category}
                                  </Badge>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <span>{formatDate(event.date)}</span>
                                {event.time && <span>{event.time}</span>}
                                {event.city && (
                                  <>
                                    <span>•</span>
                                    <span>{event.city}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            {event.cost !== undefined && (
                              <div className="text-right">
                                <p className="font-semibold text-accent">${event.cost.toFixed(2)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget View */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {budgetChartData.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No budget data yet</p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                          <Pie
                            data={budgetChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {budgetChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>

                      <div className="space-y-2 mt-4">
                        {budgetChartData.map((item) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span>{item.name}</span>
                            </div>
                            <span className="font-medium">${item.value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailyBudget.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No daily budget data yet</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dailyBudget}>
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Budget</p>
                    <p className="text-3xl font-bold text-accent">${budget?.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Average per Day</p>
                    <p className="text-3xl font-bold">${((budget?.total || 0) / duration).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Itinerary View */}
          <TabsContent value="itinerary" className="space-y-4">
            {stops.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <p className="text-muted-foreground">No cities in itinerary</p>
                  <Link href={`/trip/${tripId}/edit`} className="mt-4 inline-block">
                    <Button>Add Cities</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              stops.map((stop, index) => (
                <Card key={stop.id}>
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle>
                          {stop.city_name}, {stop.city_country}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(stop.arrival_date)} - {formatDate(stop.departure_date)} •{" "}
                          {Math.ceil(
                            (new Date(stop.departure_date).getTime() - new Date(stop.arrival_date).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          days
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
