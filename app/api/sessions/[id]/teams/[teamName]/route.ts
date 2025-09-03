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

export async function PUT(request: NextRequest, { params }: { params: { id: string; teamName: string } }) {
  try {
    const { score, badges } = await request.json()
    const sessionId = params.id.toUpperCase()
    const teamName = decodeURIComponent(params.teamName)

    const session = global.sessionStore.get(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const teamIndex = session.teams.findIndex((t) => t.name === teamName)
    if (teamIndex === -1) {
      return NextResponse.json({ error: "Team not found in session" }, { status: 404 })
    }

    // Update team data
    if (typeof score === "number") {
      session.teams[teamIndex].score = score
    }
    if (Array.isArray(badges)) {
      session.teams[teamIndex].badges = badges
    }

    global.sessionStore.set(sessionId, session)

    return NextResponse.json({
      success: true,
      team: session.teams[teamIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update team data" }, { status: 500 })
  }
}
