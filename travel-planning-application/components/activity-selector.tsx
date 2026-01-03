"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, DollarSign } from "lucide-react"
import { getActivitiesByCity, addTripActivity, type Activity } from "@/lib/itinerary"
import { useToast } from "@/hooks/use-toast"

interface ActivitySelectorProps {
  cityId: number
  tripStopId: number
  onActivityAdded: () => void
}

export function ActivitySelector({ cityId, tripStopId, onActivityAdded }: ActivitySelectorProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addingId, setAddingId] = useState<number | null>(null)

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true)
      const data = await getActivitiesByCity(cityId)
      setActivities(data)
      setIsLoading(false)
    }

    if (open) {
      loadActivities()
    }
  }, [cityId, open])

  const handleAddActivity = async (activityId: number) => {
    setAddingId(activityId)

    try {
      const result = await addTripActivity(tripStopId, activityId)

      if (result) {
        toast({
          title: "Activity added!",
          description: "The activity has been added to your itinerary",
        })
        onActivityAdded()
      } else {
        toast({
          title: "Error",
          description: "Failed to add activity",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setAddingId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Activities</SheetTitle>
          <SheetDescription>Choose activities to add to this stop</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No activities available for this city</p>
          ) : (
            activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-medium line-clamp-1">{activity.name}</h3>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{activity.description}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {activity.category && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.category}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          <span>${activity.estimated_cost.toFixed(2)}</span>
                        </div>
                        {activity.duration_hours && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{activity.duration_hours}h</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAddActivity(activity.id)}
                      disabled={addingId === activity.id}
                    >
                      {addingId === activity.id ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
