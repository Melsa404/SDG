"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TeamPanel } from "@/components/team-panel"
import { RealtimeNotifications } from "@/components/realtime-notifications"
import { SessionExitDialog } from "@/components/session-exit-dialog"
import { LogOut } from "lucide-react"
import { useRealtimeSession } from "@/hooks/use-realtime-session"

interface GalaxyMapProps {
  onPlanetSelect: (planet: string) => void
  onShowLeaderboard: () => void
  onExitSession?: () => void
  playerName: string
  badges: string[]
  score: number
  sessionId?: string | null
  sessionName?: string
}

export function GalaxyMap({
  onPlanetSelect,
  onShowLeaderboard,
  onExitSession,
  playerName,
  badges,
  score,
  sessionId,
  sessionName,
}: GalaxyMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)

  const { recentUpdates, clearRecentUpdates } = useRealtimeSession(sessionId || null, playerName)

  const handleExitSession = () => {
    setShowExitDialog(false)
    onExitSession?.()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background relative overflow-hidden">
      {sessionId && (
        <>
          <TeamPanel sessionId={sessionId} currentTeamName={playerName} />
          <RealtimeNotifications updates={recentUpdates} onClear={clearRecentUpdates} />
        </>
      )}

      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SDG Galaxy Map
          </h1>
          <p className="text-muted-foreground">{sessionId ? `Team: ${playerName}` : `Guardian: ${playerName}`}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-accent">{score}</p>
          </div>
          <div className="flex gap-1">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
          <Button onClick={onShowLeaderboard} variant="outline">
            Leaderboard
          </Button>
          {sessionId && onExitSession && (
            <Button
              onClick={() => setShowExitDialog(true)}
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Galaxy Center */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-8">
        <div className="relative w-full max-w-6xl aspect-square">
          {/* Central Galaxy Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-rotate-slow opacity-60 blur-sm"></div>

          {/* Planet Verde */}
          <div
            className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onMouseEnter={() => setHoveredPlanet("verde")}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => onPlanetSelect("verde")}
          >
            <div
              className={`relative transition-all duration-300 ${hoveredPlanet === "verde" ? "scale-110" : "scale-100"}`}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-float animate-pulse-glow shadow-lg shadow-green-500/30"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-transparent rounded-full"></div>
              {hoveredPlanet === "verde" && (
                <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-card/90 backdrop-blur border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-400 text-lg">🌍 Planet Verde</CardTitle>
                    <CardDescription>The Fevered World</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">Climate Action Challenge</p>
                    <p className="text-xs text-muted-foreground">Use NASA temperature data to cool the burning lands</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Planet Aqua */}
          <div
            className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onMouseEnter={() => setHoveredPlanet("aqua")}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => onPlanetSelect("aqua")}
          >
            <div
              className={`relative transition-all duration-300 ${hoveredPlanet === "aqua" ? "scale-110" : "scale-100"}`}
            >
              <div
                className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full animate-float animate-pulse-glow shadow-lg shadow-blue-500/30"
                style={{ animationDelay: "2s" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full"></div>
              {hoveredPlanet === "aqua" && (
                <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-card/90 backdrop-blur border-blue-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-400 text-lg">💧 Planet Aqua</CardTitle>
                    <CardDescription>The Thirsty World</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">Clean Water Mission</p>
                    <p className="text-xs text-muted-foreground">Restore water balance using NASA rainfall maps</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Planet Flora */}
          <div
            className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 cursor-pointer"
            onMouseEnter={() => setHoveredPlanet("flora")}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => onPlanetSelect("flora")}
          >
            <div
              className={`relative transition-all duration-300 ${hoveredPlanet === "flora" ? "scale-110" : "scale-100"}`}
            >
              <div
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full animate-float animate-pulse-glow shadow-lg shadow-emerald-500/30"
                style={{ animationDelay: "4s" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 to-transparent rounded-full"></div>
              {hoveredPlanet === "flora" && (
                <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-card/90 backdrop-blur border-emerald-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-emerald-400 text-lg">🌿 Planet Flora</CardTitle>
                    <CardDescription>The Barren World</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">Life on Land Mission</p>
                    <p className="text-xs text-muted-foreground">Restore ecosystems using NASA vegetation data</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Planet Oceanus */}
          <div
            className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 cursor-pointer"
            onMouseEnter={() => setHoveredPlanet("oceanus")}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => onPlanetSelect("oceanus")}
          >
            <div
              className={`relative transition-all duration-300 ${hoveredPlanet === "oceanus" ? "scale-110" : "scale-100"}`}
            >
              <div
                className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-float animate-pulse-glow shadow-lg shadow-cyan-500/30"
                style={{ animationDelay: "6s" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full"></div>
              {hoveredPlanet === "oceanus" && (
                <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-card/90 backdrop-blur border-cyan-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-cyan-400 text-lg">🌊 Planet Oceanus</CardTitle>
                    <CardDescription>The Warming Seas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">Life Below Water Mission</p>
                    <p className="text-xs text-muted-foreground">Protect marine life using NASA ocean data</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="relative z-10 text-center p-6">
        <p className="text-muted-foreground">
          {sessionId
            ? "Click on a planet to begin your team mission. Compete with other teams using real NASA data!"
            : "Click on a planet to begin your mission. Use real NASA data to solve challenges and earn Guardian badges!"}
        </p>
      </div>

      <SessionExitDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onExitSession={handleExitSession}
        sessionName={sessionName || "Unknown Session"}
        teamName={playerName}
        currentScore={score}
        currentBadges={badges.length}
      />
    </div>
  )
}
