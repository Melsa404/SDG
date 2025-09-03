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

// In-memory storage for sessions (replace with database in production)
const sessions = new Map<string, GameSession>()

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const { sessionName, teamName } = await request.json()

    if (!sessionName?.trim() || !teamName?.trim()) {
      return NextResponse.json({ error: "Session name and team name are required" }, { status: 400 })
    }

    const sessionId = generateSessionId()
    const newSession: GameSession = {
      id: sessionId,
      name: sessionName,
      teams: [
        {
          name: teamName,
          score: 0,
          badges: [],
          joinedAt: Date.now(),
        },
      ],
      createdAt: Date.now(),
      maxTeams: 8,
    }

    sessions.set(sessionId, newSession)

    return NextResponse.json({
      success: true,
      session: newSession,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return recent sessions (last 10)
    const recentSessions = Array.from(sessions.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      sessions: recentSessions,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
