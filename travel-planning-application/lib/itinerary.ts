import { executeQuery, executeNonQuery } from "./db"

export interface City {
  id: number
  name: string
  country: string
  cost_index: number
  popularity: number
  image_url: string | null
  description: string | null
  created_at: string
}

export interface TripStop {
  id: number
  trip_id: number
  city_id: number
  arrival_date: string
  departure_date: string
  stop_order: number
  notes: string | null
  created_at: string
  city_name?: string
  city_country?: string
}

export interface Activity {
  id: number
  city_id: number
  name: string
  description: string | null
  category: string | null
  estimated_cost: number
  duration_hours: number | null
  image_url: string | null
  created_at: string
}

export interface TripActivity {
  id: number
  trip_stop_id: number
  activity_id: number
  scheduled_date: string | null
  scheduled_time: string | null
  actual_cost: number | null
  notes: string | null
  created_at: string
  activity_name?: string
  activity_description?: string
  activity_category?: string
  estimated_cost?: number
  duration_hours?: number
}

export async function searchCities(query: string): Promise<City[]> {
  try {
    return await executeQuery<City>(
      "SELECT * FROM cities WHERE name LIKE ? OR country LIKE ? ORDER BY popularity DESC LIMIT 20",
      [`%${query}%`, `%${query}%`],
    )
  } catch (error) {
    console.error("[v0] Error searching cities:", error)
    return []
  }
}

export async function getAllCities(): Promise<City[]> {
  try {
    return await executeQuery<City>("SELECT * FROM cities ORDER BY popularity DESC")
  } catch (error) {
    console.error("[v0] Error fetching cities:", error)
    return []
  }
}

export async function getCityById(cityId: number): Promise<City | null> {
  try {
    const cities = await executeQuery<City>("SELECT * FROM cities WHERE id = ?", [cityId])
    return cities.length > 0 ? cities[0] : null
  } catch (error) {
    console.error("[v0] Error fetching city:", error)
    return null
  }
}

export async function getTripStops(tripId: number): Promise<TripStop[]> {
  try {
    const query = `
      SELECT 
        ts.*,
        c.name as city_name,
        c.country as city_country
      FROM trip_stops ts
      JOIN cities c ON ts.city_id = c.id
      WHERE ts.trip_id = ?
      ORDER BY ts.stop_order ASC
    `
    return await executeQuery<TripStop>(query, [tripId])
  } catch (error) {
    console.error("[v0] Error fetching trip stops:", error)
    return []
  }
}

export async function addTripStop(
  tripId: number,
  cityId: number,
  arrivalDate: string,
  departureDate: string,
  notes?: string,
): Promise<TripStop | null> {
  try {
    // Get the next stop order
    const maxOrderResult = await executeQuery<{ max_order: number }>(
      "SELECT COALESCE(MAX(stop_order), 0) as max_order FROM trip_stops WHERE trip_id = ?",
      [tripId],
    )
    const nextOrder = (maxOrderResult[0]?.max_order || 0) + 1

    await executeNonQuery(
      "INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, stop_order, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [tripId, cityId, arrivalDate, departureDate, nextOrder, notes || null],
    )

    const stops = await executeQuery<TripStop>(
      "SELECT * FROM trip_stops WHERE trip_id = ? ORDER BY created_at DESC LIMIT 1",
      [tripId],
    )

    return stops.length > 0 ? stops[0] : null
  } catch (error) {
    console.error("[v0] Error adding trip stop:", error)
    return null
  }
}

export async function deleteTripStop(stopId: number): Promise<boolean> {
  try {
    await executeNonQuery("DELETE FROM trip_stops WHERE id = ?", [stopId])
    return true
  } catch (error) {
    console.error("[v0] Error deleting trip stop:", error)
    return false
  }
}

export async function getActivitiesByCity(cityId: number): Promise<Activity[]> {
  try {
    return await executeQuery<Activity>("SELECT * FROM activities WHERE city_id = ? ORDER BY estimated_cost ASC", [
      cityId,
    ])
  } catch (error) {
    console.error("[v0] Error fetching activities:", error)
    return []
  }
}

export async function getTripActivities(tripStopId: number): Promise<TripActivity[]> {
  try {
    const query = `
      SELECT 
        ta.*,
        a.name as activity_name,
        a.description as activity_description,
        a.category as activity_category,
        a.estimated_cost,
        a.duration_hours
      FROM trip_activities ta
      JOIN activities a ON ta.activity_id = a.id
      WHERE ta.trip_stop_id = ?
      ORDER BY ta.scheduled_date ASC, ta.scheduled_time ASC
    `
    return await executeQuery<TripActivity>(query, [tripStopId])
  } catch (error) {
    console.error("[v0] Error fetching trip activities:", error)
    return []
  }
}

export async function addTripActivity(
  tripStopId: number,
  activityId: number,
  scheduledDate?: string,
  scheduledTime?: string,
  actualCost?: number,
): Promise<TripActivity | null> {
  try {
    await executeNonQuery(
      "INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, actual_cost) VALUES (?, ?, ?, ?, ?)",
      [tripStopId, activityId, scheduledDate || null, scheduledTime || null, actualCost || null],
    )

    const activities = await executeQuery<TripActivity>(
      "SELECT * FROM trip_activities WHERE trip_stop_id = ? ORDER BY created_at DESC LIMIT 1",
      [tripStopId],
    )

    return activities.length > 0 ? activities[0] : null
  } catch (error) {
    console.error("[v0] Error adding trip activity:", error)
    return null
  }
}

export async function deleteTripActivity(activityId: number): Promise<boolean> {
  try {
    await executeNonQuery("DELETE FROM trip_activities WHERE id = ?", [activityId])
    return true
  } catch (error) {
    console.error("[v0] Error deleting trip activity:", error)
    return false
  }
}

export async function updateTripActivity(
  activityId: number,
  updates: Partial<Omit<TripActivity, "id" | "trip_stop_id" | "activity_id" | "created_at">>,
): Promise<boolean> {
  try {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    await executeNonQuery(`UPDATE trip_activities SET ${fields} WHERE id = ?`, [...values, activityId])

    return true
  } catch (error) {
    console.error("[v0] Error updating trip activity:", error)
    return false
  }
}
