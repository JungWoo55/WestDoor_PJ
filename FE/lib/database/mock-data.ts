import type {
  User,
  RefreshToken,
} from "@/lib/types/database"


export const mockUsers: User[] = [
  {
    id: 1,
    email: "eco.kim@example.com",
    password: "password123",
    nickname: "김환경",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_completed: true,
  },
  {
    id: 2,
    email: "green.lee@example.com",
    password: "password123",
    nickname: "이지구",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    is_completed: true,
  },
]
export const mockRefreshTokens: RefreshToken[] = [
  { id: 1, token: "mock_refresh_token_1", user_id: 1, updated_at: "2024-01-01T00:00:00Z" },
]