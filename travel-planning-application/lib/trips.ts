import { executeQuery, executeNonQuery } from "./db"

export interface Trip {
  id: number
  user_id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  cover_photo: string | null
  is_public: number
  created_at: string
  updated_at: string
}

export interface TripWithStats extends Trip {
  city_count?: number
  total_cost?: number
}

export async function getUserTrips(userId: number): Promise<TripWithStats[]> {
  try {
    const query = `
      SELECT 
        t.*,
        COUNT(DISTINCT ts.id) as city_count,
        COALESCE(SUM(ta.actual_cost), 0) + COALESCE(SUM(te.amount), 0) as total_cost
      FROM trips t
      LEFT JOIN trip_stops ts ON t.id = ts.trip_id
      LEFT JOIN trip_activities ta ON ts.id = ta.trip_stop_id
      LEFT JOIN trip_expenses te ON t.id = te.trip_id
      WHERE t.user_id = ?
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `
    return await executeQuery<TripWithStats>(query, [userId])
  } catch (error) {
    console.error("[v0] Error fetching user trips:", error)
    return []
  }
}

export async function createTrip(
  userId: number,
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  coverPhoto?: string,
): Promise<Trip | null> {
  try {
    await executeNonQuery(
      "INSERT INTO trips (user_id, name, description, start_date, end_date, cover_photo) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, name, description, startDate, endDate, coverPhoto || null],
    )

    const trips = await executeQuery<Trip>("SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", [
      userId,
    ])

    return trips.length > 0 ? trips[0] : null
  } catch (error) {
    console.error("[v0] Error creating trip:", error)
    return null
  }
}

export async function getTripById(tripId: number): Promise<Trip | null> {
  try {
    const trips = await executeQuery<Trip>("SELECT * FROM trips WHERE id = ?", [tripId])
    return trips.length > 0 ? trips[0] : null
  } catch (error) {
    console.error("[v0] Error fetching trip:", error)
    return null
  }
}

export async function updateTrip(
  tripId: number,
  updates: Partial<Omit<Trip, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<boolean> {
  try {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = Object.values(updates)

    await executeNonQuery(`UPDATE trips SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [
      ...values,
      tripId,
    ])

    return true
  } catch (error) {
    console.error("[v0] Error updating trip:", error)
    return false
  }
}

export async function deleteTrip(tripId: number): Promise<boolean> {
  try {
    await executeNonQuery("DELETE FROM trips WHERE id = ?", [tripId])
    return true
  } catch (error) {
    console.error("[v0] Error deleting trip:", error)
    return false
  }
}

export async function getPopularCities(limit = 6) {
  try {
    return await executeQuery<{
      id: number
      name: string
      country: string
      cost_index: number
      popularity: number
      image_url: string | null
      description: string | null
    }>("SELECT * FROM cities ORDER BY popularity DESC LIMIT ?", [limit])
  } catch (error) {
    console.error("[v0] Error fetching popular cities:", error)
    return []
  }
}
