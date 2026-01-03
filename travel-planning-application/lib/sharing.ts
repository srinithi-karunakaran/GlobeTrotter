import { executeQuery } from "./db"

export interface PublicTrip {
  id: number
  name: string
  description: string | null
  start_date: string
  end_date: string
  user_name: string
  city_count: number
  created_at: string
}

export async function getPublicTrips(limit = 20): Promise<PublicTrip[]> {
  try {
    const query = `
      SELECT 
        t.id,
        t.name,
        t.description,
        t.start_date,
        t.end_date,
        u.name as user_name,
        COUNT(DISTINCT ts.id) as city_count,
        t.created_at
      FROM trips t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN trip_stops ts ON t.id = ts.trip_id
      WHERE t.is_public = 1
      GROUP BY t.id
      ORDER BY t.created_at DESC
      LIMIT ?
    `
    return await executeQuery<PublicTrip>(query, [limit])
  } catch (error) {
    console.error("[v0] Error fetching public trips:", error)
    return []
  }
}

export function generateShareUrl(tripId: number): string {
  if (typeof window === "undefined") return ""
  return `${window.location.origin}/shared/${tripId}`
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)

  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false)
}
