import "server-only"

import bcrypt from "bcryptjs"
import { executeQuery, executeNonQuery } from "./db"

export interface User {
  id: number
  email: string
  name: string
  profile_photo: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export async function registerUser(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    // Check if user already exists
    const existingUsers = await executeQuery<User>("SELECT * FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return { success: false, error: "User already exists" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert new user
    await executeNonQuery("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)", [
      email,
      passwordHash,
      name,
    ])

    // Retrieve the created user
    const users = await executeQuery<User>(
      "SELECT id, email, name, profile_photo, created_at, updated_at FROM users WHERE email = ?",
      [email],
    )

    if (users.length === 0) {
      return { success: false, error: "Failed to create user" }
    }

    return { success: true, user: users[0] }
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return { success: false, error: "Registration failed" }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // Find user by email
    const users = await executeQuery<User & { password_hash: string }>("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { success: false, error: "Login failed" }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null

  const userJson = sessionStorage.getItem("current_user")
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch {
    return null
  }
}

export async function setCurrentUser(user: User | null): Promise<void> {
  if (typeof window === "undefined") return

  if (user) {
    sessionStorage.setItem("current_user", JSON.stringify(user))
  } else {
    sessionStorage.removeItem("current_user")
  }
}

export async function logoutUser(): Promise<void> {
  await setCurrentUser(null)
}
