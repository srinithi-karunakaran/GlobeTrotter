"use client"

import type { TripWithStats } from "@/lib/trips"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, DollarSign, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface TripCardProps {
  trip: TripWithStats
  onDelete?: (id: number) => void
}

export function TripCard({ trip, onDelete }: TripCardProps) {
  const duration = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-muted relative">
        {trip.cover_photo ? (
          <img src={trip.cover_photo || "/placeholder.svg"} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        {trip.is_public === 1 && (
          <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
            <Eye className="h-3 w-3 mr-1" />
            Public
          </Badge>
        )}
      </div>

      <CardContent className="pt-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{trip.name}</h3>
          {trip.description && <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>}
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>
              {trip.city_count || 0} {trip.city_count === 1 ? "city" : "cities"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <DollarSign className="h-4 w-4 text-accent" />
          <span className="font-medium">${trip.total_cost?.toFixed(2) || "0.00"}</span>
          <span className="text-muted-foreground">• {duration} days</span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Link href={`/trip/${trip.id}`} className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>
        <Link href={`/trip/${trip.id}/edit`} className="flex-1">
          <Button className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={() => onDelete(trip.id)} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
