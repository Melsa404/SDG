import { type NextRequest, NextResponse } from "next/server"

interface Team {
  name: string
  score: number
  badges: string[]
  joinedAt: number
}

interface GameSession {
  id: string
  name: string
  teams: Team[]
  createdAt: number
  maxTeams: number
}

// Import the same sessions map (in production, use database)
declare global {
  var sessionStore: Map<string, GameSession>
}

if (!global.sessionStore) {
  global.sessionStore = new Map()
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id.toUpperCase()
    const session = global.sessionStore.get(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}
