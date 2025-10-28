import { type NextRequest, NextResponse } from "next/server"

const mockUser = {
  id: 1,
  email: "west.door@example.com",
  nickname: "WestDoor",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  is_completed: true,
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockUser,
    })
  } catch (error) {
    console.log("[v0] API connection failed, using mock data")

    return NextResponse.json({
      success: true,
      warning: "연결되면 실제 데이터가 표시됩니다",
      data: mockUser,
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { nickname } = body

    const updatedUser = {
      ...mockUser,
      nickname: nickname || mockUser.nickname,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    console.log("[v0] API connection failed, using mock data")

    return NextResponse.json({
      success: true,
      warning: "연결되면 실제 데이터가 표시됩니다",
      data: mockUser,
    })
  }
}
