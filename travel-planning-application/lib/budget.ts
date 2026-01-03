import { executeQuery, executeNonQuery } from "./db"

export interface BudgetBreakdown {
  total: number
  activities: number
  transport: number
  accommodation: number
  meals: number
  other: number
}

export interface ExpenseByCategory {
  category: string
  amount: number
}

export interface DailyBudget {
  date: string
  amount: number
  activities_count: number
}

export async function getTripBudgetBreakdown(tripId: number): Promise<BudgetBreakdown> {
  try {
    // Get activities cost
    const activitiesResult = await executeQuery<{ total: number }>(
      `
      SELECT COALESCE(SUM(COALESCE(ta.actual_cost, a.estimated_cost)), 0) as total
      FROM trip_activities ta
      JOIN activities a ON ta.activity_id = a.id
      JOIN trip_stops ts ON ta.trip_stop_id = ts.id
      WHERE ts.trip_id = ?
    `,
      [tripId],
    )

    // Get expenses by category
    const expensesResult = await executeQuery<{ category: string; total: number }>(
      `
      SELECT category, COALESCE(SUM(amount), 0) as total
      FROM trip_expenses
      WHERE trip_id = ?
      GROUP BY category
    `,
      [tripId],
    )

    const activitiesTotal = activitiesResult[0]?.total || 0
    const expensesByCategory = expensesResult.reduce(
      (acc, row) => {
        acc[row.category.toLowerCase()] = row.total
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: activitiesTotal + Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0),
      activities: activitiesTotal,
      transport: expensesByCategory.transport || 0,
      accommodation: expensesByCategory.accommodation || 0,
      meals: expensesByCategory.meals || 0,
      other: expensesByCategory.other || 0,
    }
  } catch (error) {
    console.error("[v0] Error calculating budget:", error)
    return {
      total: 0,
      activities: 0,
      transport: 0,
      accommodation: 0,
      meals: 0,
      other: 0,
    }
  }
}

export async function getDailyBudget(tripId: number): Promise<DailyBudget[]> {
  try {
    const result = await executeQuery<DailyBudget>(
      `
      SELECT 
        ta.scheduled_date as date,
        COALESCE(SUM(COALESCE(ta.actual_cost, a.estimated_cost)), 0) as amount,
        COUNT(ta.id) as activities_count
      FROM trip_activities ta
      JOIN activities a ON ta.activity_id = a.id
      JOIN trip_stops ts ON ta.trip_stop_id = ts.id
      WHERE ts.trip_id = ? AND ta.scheduled_date IS NOT NULL
      GROUP BY ta.scheduled_date
      ORDER BY ta.scheduled_date ASC
    `,
      [tripId],
    )

    return result
  } catch (error) {
    console.error("[v0] Error getting daily budget:", error)
    return []
  }
}

export async function addTripExpense(
  tripId: number,
  category: string,
  description: string,
  amount: number,
  expenseDate: string,
  tripStopId?: number,
): Promise<boolean> {
  try {
    await executeNonQuery(
      "INSERT INTO trip_expenses (trip_id, trip_stop_id, category, description, amount, expense_date) VALUES (?, ?, ?, ?, ?, ?)",
      [tripId, tripStopId || null, category, description, amount, expenseDate],
    )
    return true
  } catch (error) {
    console.error("[v0] Error adding expense:", error)
    return false
  }
}

export async function getTripExpenses(tripId: number) {
  try {
    return await executeQuery<{
      id: number
      category: string
      description: string
      amount: number
      expense_date: string
    }>(
      "SELECT id, category, description, amount, expense_date FROM trip_expenses WHERE trip_id = ? ORDER BY expense_date DESC",
      [tripId],
    )
  } catch (error) {
    console.error("[v0] Error fetching expenses:", error)
    return []
  }
}
