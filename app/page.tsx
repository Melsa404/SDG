"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GalaxyMap } from "@/components/galaxy-map"
import { PlanetVerde } from "@/components/planet-verde"
import { PlanetAqua } from "@/components/planet-aqua"
import { PlanetFlora } from "@/components/planet-flora"
import { PlanetOceanus } from "@/components/planet-oceanus"
import { Leaderboard } from "@/components/leaderboard"
import { SessionManager } from "@/components/session-manager"
import { useRealtimeSession } from "@/hooks/use-realtime-session"
import { createClient } from "@/lib/supabase/client"

type GameState =
  | "session"
  | "intro"
  | "galaxy"
  | "planet-verde"
  | "planet-aqua"
  | "planet-flora"
  | "planet-oceanus"
  | "leaderboard"

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("session")
  const [playerName, setPlayerName] = useState("")
  const [badges, setBadges] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [teamName, setTeamName] = useState("")
  const [sessionName, setSessionName] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const { updateTeamData } = useRealtimeSession(sessionId, teamName)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user) // Set user if authenticated, null if guest
      setLoading(false) // Always finish loading regardless of auth status
    }
    checkAuth()
  }, [supabase])

  const handleSessionJoined = async (newSessionId: string, newTeamName: string) => {
    setSessionId(newSessionId)
    setTeamName(newTeamName)
    setPlayerName(newTeamName)

    const { data: session } = await supabase.from("game_sessions").select("name").eq("id", newSessionId).single()

    if (session) {
      setSessionName(session.name)
    }

    setGameState("intro")
  }

  const handleExitSession = () => {
    setSessionId(null)
    setTeamName("")
    setSessionName("")
    setGameState("session")
  }

  const handleStartGame = () => {
    setGameState("galaxy")
  }

  const handlePlanetSelect = (planet: string) => {
    if (planet === "verde") {
      setGameState("planet-verde")
    } else if (planet === "aqua") {
      setGameState("planet-aqua")
    } else if (planet === "flora") {
      setGameState("planet-flora")
    } else if (planet === "oceanus") {
      setGameState("planet-oceanus")
    }
  }

  const handleBackToGalaxy = () => {
    setGameState("galaxy")
  }

  const handleBadgeEarned = (badge: string, points: number) => {
    const newBadges = [...badges, badge]
    const newScore = score + points

    setBadges(newBadges)
    setScore(newScore)

    if (sessionId) {
      updateTeamData(teamName, newScore, newBadges)
    }
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

  if (gameState === "session") {
    return <SessionManager onSessionJoined={handleSessionJoined} />
  }

  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl animate-pulse-glow"></div>
            <h1 className="relative text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-float">
              Space Data Guardians
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome to the Galaxy, {teamName}! The planets are in danger and only your team can save them using real
            NASA data. Work together, unlock badges, and become Guardians of the Galaxy!
          </p>

          <div className="bg-card/50 backdrop-blur border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-primary mb-2">Mission Session</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Mission:</span>{" "}
                <span className="font-medium">{sessionName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Session Code:</span>{" "}
                <code className="bg-muted px-2 py-1 rounded font-mono">{sessionId}</code>
              </p>
              <p>
                <span className="text-muted-foreground">Team Name:</span>{" "}
                <span className="text-accent font-medium">{teamName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Role:</span>{" "}
                <span className="text-secondary font-medium">{user ? "Host" : "Team Member"}</span>
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">🌍 Planet Verde</CardTitle>
                <CardDescription>Climate Action Challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Help cool down the fevered world using NASA temperature data</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-secondary/20">
              <CardHeader>
                <CardTitle className="text-secondary">💧 Planet Aqua</CardTitle>
                <CardDescription>Clean Water Mission</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Restore water balance using NASA rainfall and soil moisture maps</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">🌱 Planet Flora</CardTitle>
                <CardDescription>Green Thumb Challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Protect and restore the planet's flora using NASA vegetation data</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">🌊 Planet Oceanus</CardTitle>
                <CardDescription>Life Below Water Mission</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Protect marine ecosystems using NASA ocean monitoring data</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleStartGame}
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 animate-pulse-glow"
            >
              Start Mission
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "galaxy") {
    return (
      <GalaxyMap
        onPlanetSelect={handlePlanetSelect}
        onShowLeaderboard={() => setGameState("leaderboard")}
        onExitSession={sessionId ? handleExitSession : undefined}
        playerName={playerName}
        badges={badges}
        score={score}
        sessionId={sessionId}
        sessionName={sessionName}
      />
    )
  }

  if (gameState === "planet-verde") {
    return <PlanetVerde onBack={handleBackToGalaxy} onBadgeEarned={handleBadgeEarned} playerName={playerName} />
  }

  if (gameState === "planet-aqua") {
    return <PlanetAqua onBack={handleBackToGalaxy} onBadgeEarned={handleBadgeEarned} playerName={playerName} />
  }

  if (gameState === "planet-flora") {
    return <PlanetFlora onBack={handleBackToGalaxy} onBadgeEarned={handleBadgeEarned} playerName={playerName} />
  }

  if (gameState === "planet-oceanus") {
    return <PlanetOceanus onBack={handleBackToGalaxy} onBadgeEarned={handleBadgeEarned} playerName={playerName} />
  }

  if (gameState === "leaderboard") {
    return (
      <Leaderboard
        onBack={handleBackToGalaxy}
        currentPlayer={{ name: playerName, score, badges }}
        sessionId={sessionId}
      />
    )
  }

  return null
}
