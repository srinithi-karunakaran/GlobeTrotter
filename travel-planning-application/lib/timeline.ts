import { executeQuery } from "./db"

export interface TimelineEvent {
  id: number
  type: "arrival" | "departure" | "activity"
  date: string
  time?: string
  title: string
  description?: string
  city?: string
  cost?: number
  category?: string
}

export async function getTripTimeline(tripId: number): Promise<TimelineEvent[]> {
  try {
    // Get all stops
    const stops = await executeQuery<{
      id: number
      city_name: string
      city_country: string
      arrival_date: string
      departure_date: string
    }>(
      `
      SELECT 
        ts.id,
        c.name as city_name,
        c.country as city_country,
        ts.arrival_date,
        ts.departure_date
      FROM trip_stops ts
      JOIN cities c ON ts.city_id = c.id
      WHERE ts.trip_id = ?
      ORDER BY ts.stop_order ASC
    `,
      [tripId],
    )

    // Get all activities
    const activities = await executeQuery<{
      id: number
      scheduled_date: string
      scheduled_time: string
      activity_name: string
      activity_description: string
      activity_category: string
      estimated_cost: number
      actual_cost: number
      city_name: string
    }>(
      `
      SELECT 
        ta.id,
        ta.scheduled_date,
        ta.scheduled_time,
        a.name as activity_name,
        a.description as activity_description,
        a.category as activity_category,
        a.estimated_cost,
        ta.actual_cost,
        c.name as city_name
      FROM trip_activities ta
      JOIN activities a ON ta.activity_id = a.id
      JOIN trip_stops ts ON ta.trip_stop_id = ts.id
      JOIN cities c ON ts.city_id = c.id
      WHERE ts.trip_id = ?
      ORDER BY ta.scheduled_date ASC, ta.scheduled_time ASC
    `,
      [tripId],
    )

    const events: TimelineEvent[] = []

    // Add arrival and departure events
    for (const stop of stops) {
      events.push({
        id: stop.id * 1000,
        type: "arrival",
        date: stop.arrival_date,
        title: `Arrive in ${stop.city_name}`,
        description: stop.city_country,
        city: stop.city_name,
      })

      events.push({
        id: stop.id * 1000 + 1,
        type: "departure",
        date: stop.departure_date,
        title: `Depart from ${stop.city_name}`,
        description: stop.city_country,
        city: stop.city_name,
      })
    }

    // Add activity events
    for (const activity of activities) {
      if (activity.scheduled_date) {
        events.push({
          id: activity.id,
          type: "activity",
          date: activity.scheduled_date,
          time: activity.scheduled_time || undefined,
          title: activity.activity_name,
          description: activity.activity_description,
          city: activity.city_name,
          cost: activity.actual_cost || activity.estimated_cost,
          category: activity.activity_category,
        })
      }
    }

    // Sort by date and time
    events.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare

      const timeA = a.time || "00:00"
      const timeB = b.time || "00:00"
      return timeA.localeCompare(timeB)
    })

    return events
  } catch (error) {
    console.error("[v0] Error fetching timeline:", error)
    return []
  }
}
