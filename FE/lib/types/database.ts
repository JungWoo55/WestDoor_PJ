// Database types matching ERD Cloud schema
export interface User {
  id: number
  email: string
  password: string
  nickname: string
  created_at: string
  updated_at: string
  is_completed: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  warning?: string
  message?: string
}

// Request types
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export interface UpdateProfileRequest {
  nickname?: string
}

export interface RefreshToken {
  id: number
  token: string
  user_id: number
  updated_at: string | null
}