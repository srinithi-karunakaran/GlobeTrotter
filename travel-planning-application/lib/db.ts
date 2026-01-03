import "server-only"

import type { Database } from "sql.js"

let db: Database | null = null
let sqlPromise: Promise<any> | null = null

async function initSql() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const initSqlJs = (await import("sql.js")).default
      return await initSqlJs({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.10.2/dist/${file}`,
      })
    })()
  }
  return sqlPromise
}

export async function getDatabase(): Promise<Database> {
  if (db) return db

  const SQL = await initSql()

  // Try to load existing database from localStorage
  const savedDb = typeof window !== "undefined" ? localStorage.getItem("globaltrotters_db") : null

  if (savedDb) {
    try {
      const uint8Array = new Uint8Array(JSON.parse(savedDb))
      db = new SQL.Database(uint8Array)
    } catch (error) {
      console.error("[v0] Failed to load saved database:", error)
      db = new SQL.Database()
    }
  } else {
    db = new SQL.Database()
  }

  return db
}

export async function saveDatabase() {
  if (!db) return

  const data = db.export()
  const buffer = Array.from(data)

  if (typeof window !== "undefined") {
    localStorage.setItem("globaltrotters_db", JSON.stringify(buffer))
  }
}

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const database = await getDatabase()

  try {
    const results = database.exec(query, params)

    if (results.length === 0) return []

    const { columns, values } = results[0]
    return values.map((row) => {
      const obj: any = {}
      columns.forEach((col, idx) => {
        obj[col] = row[idx]
      })
      return obj as T
    })
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

export async function executeNonQuery(query: string, params: any[] = []): Promise<void> {
  const database = await getDatabase()

  try {
    database.run(query, params)
    await saveDatabase()
  } catch (error) {
    console.error("[v0] Database execution error:", error)
    throw error
  }
}
