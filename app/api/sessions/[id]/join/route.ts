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

// Use global session store
declare global {
  var sessionStore: Map<string, GameSession>
}

if (!global.sessionStore) {
  global.sessionStore = new Map()
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { teamName } = await request.json()
    const sessionId = params.id.toUpperCase()

    if (!teamName?.trim()) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    const session = global.sessionStore.get(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (session.teams.length >= session.maxTeams) {
      return NextResponse.json({ error: "Session is full" }, { status: 400 })
    }

    if (session.teams.some((t) => t.name === teamName)) {
      return NextResponse.json({ error: "Team name already taken in this session" }, { status: 400 })
    }

    const newTeam: Team = {
      name: teamName,
      score: 0,
      badges: [],
      joinedAt: Date.now(),
    }

    session.teams.push(newTeam)
    global.sessionStore.set(sessionId, session)

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 })
  }
}
