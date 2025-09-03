"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Rocket, LogOut, UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Team {
  id: string
  name: string
  score: number
  badges: string[]
  joined_at: string
  user_id: string
}

interface GameSession {
  id: string
  name: string
  created_at: string
  max_teams: number
  created_by: string
  teams: Team[]
}

interface SessionManagerProps {
  onSessionJoined: (sessionId: string, teamName: string) => void
}

export function SessionManager({ onSessionJoined }: SessionManagerProps) {
  const [mode, setMode] = useState<"menu" | "create" | "join" | "host-login">("menu")
  const [sessionName, setSessionName] = useState("")
  const [teamName, setTeamName] = useState("")
  const [joinSessionId, setJoinSessionId] = useState("")
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true) // Track initial auth check loading
  const [actionLoading, setActionLoading] = useState(false) // Track action loading separately
  const [error, setError] = useState<string | null>(null)
  const [isHost, setIsHost] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        setIsHost(true)
        await loadSessions()
      }
      setLoading(false) // Always finish loading regardless of auth status
    }
    checkAuth()
  }, [])

  const loadSessions = async () => {
    const { data: sessions, error } = await supabase
      .from("game_sessions")
      .select(`
        *,
        teams (*)
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Error loading sessions:", error)
      return
    }

    setSessions(sessions || [])
  }

  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createSession = async () => {
    if (!sessionName.trim() || !teamName.trim() || !user) {
      setError("You must be logged in as a host to create sessions")
      return
    }

    setActionLoading(true) // Use actionLoading instead of loading
    setError(null)

    try {
      const sessionId = generateSessionId()

      const { error: sessionError } = await supabase.from("game_sessions").insert({
        id: sessionId,
        name: sessionName,
        created_by: user.id,
        max_teams: 8,
      })

      if (sessionError) throw sessionError

      const { error: teamError } = await supabase.from("teams").insert({
        session_id: sessionId,
        name: teamName,
        user_id: user.id,
        score: 0,
        badges: [],
      })

      if (teamError) throw teamError

      await loadSessions()
      onSessionJoined(sessionId, teamName)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setActionLoading(false) // Use actionLoading instead of loading
    }
  }

  const joinSession = async () => {
    if (!joinSessionId.trim() || !teamName.trim()) return

    setActionLoading(true) // Use actionLoading instead of loading
    setError(null)

    try {
      const sessionId = joinSessionId.toUpperCase()

      const { data: session, error: sessionError } = await supabase
        .from("game_sessions")
        .select(`
          *,
          teams (*)
        `)
        .eq("id", sessionId)
        .single()

      if (sessionError || !session) {
        throw new Error("Session not found!")
      }

      if (session.teams.length >= session.max_teams) {
        throw new Error("Session is full!")
      }

      if (session.teams.some((t: Team) => t.name === teamName)) {
        throw new Error("Team name already taken in this session!")
      }

      const { error: teamError } = await supabase.from("teams").insert({
        session_id: sessionId,
        name: teamName,
        user_id: user?.id || null,
        score: 0,
        badges: [],
      })

      if (teamError) throw teamError

      if (user) await loadSessions()
      onSessionJoined(sessionId, teamName)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setActionLoading(false) // Use actionLoading instead of loading
    }
  }

  const copySessionId = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId)
    setCopiedSessionId(sessionId)
    setTimeout(() => setCopiedSessionId(null), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleHostLogin = () => {
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (mode === "host-login") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/90 backdrop-blur border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Host Login Required
            </CardTitle>
            <CardDescription>Only hosts need to login to create sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              To create a new mission session, you need to login as a host. Teams can join using just the session code.
            </p>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setMode("menu")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleHostLogin} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                Login as Host
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "create") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/90 backdrop-blur border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Create Mission Session
            </CardTitle>
            <CardDescription>Start a new multiplayer mission for your teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">Mission Name</label>
              <Input
                placeholder="e.g., Earth Defense Mission Alpha"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Your Team Name</label>
              <Input
                placeholder="e.g., Galaxy Guardians"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setMode("menu")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={createSession}
                disabled={!sessionName.trim() || !teamName.trim() || actionLoading} // Use actionLoading
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                {actionLoading ? "Creating..." : "Create & Start"} {/* Use actionLoading */}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "join") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/90 backdrop-blur border-secondary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Join Mission Session
            </CardTitle>
            <CardDescription>Enter the session code to join an existing mission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">Session Code</label>
              <Input
                placeholder="e.g., ABC123"
                value={joinSessionId}
                onChange={(e) => setJoinSessionId(e.target.value.toUpperCase())}
                className="mt-1 font-mono text-center text-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Your Team Name</label>
              <Input
                placeholder="e.g., Space Rangers"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setMode("menu")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={joinSession}
                disabled={!joinSessionId.trim() || !teamName.trim() || actionLoading} // Use actionLoading
                className="flex-1 bg-gradient-to-r from-secondary to-accent"
              >
                {actionLoading ? "Joining..." : "Join Mission"} {/* Use actionLoading */}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div></div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Multiplayer Mission Control
            </h1>
            {user && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hosts can create mission sessions, teams can join with just a session code!
          </p>
          {user ? (
            <p className="text-sm text-muted-foreground">Welcome, Host: {user.email}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Join as a team or login as a host to create sessions</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="bg-card/90 backdrop-blur border-primary/30 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => (user ? setMode("create") : setMode("host-login"))}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-primary text-xl">Create New Mission</CardTitle>
              <CardDescription>
                {user ? "Start a new multiplayer session and invite other teams" : "Login as host to create sessions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/80"
                onClick={() => (user ? setMode("create") : setMode("host-login"))}
              >
                {user ? "Create Mission Session" : "Login to Create"}
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-card/90 backdrop-blur border-secondary/30 hover:border-secondary/50 transition-colors cursor-pointer"
            onClick={() => setMode("join")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-secondary text-xl">Join Mission as Team</CardTitle>
              <CardDescription>Enter a session code to join - no login required!</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-secondary to-secondary/80"
                onClick={() => setMode("join")}
              >
                Join with Session Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {user && sessions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-foreground">Your Recent Sessions</h2>
            <div className="grid gap-4 max-w-2xl mx-auto">
              {sessions.map((session) => (
                <Card key={session.id} className="bg-card/90 backdrop-blur border-accent/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{session.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {session.teams?.length || 0}/{session.max_teams} teams
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Created {new Date(session.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{session.id}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copySessionId(session.id)}
                          className="p-1 h-8 w-8"
                        >
                          {copiedSessionId === session.id ? (
                            <Check className="w-4 h-4 text-accent" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
