"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Medal, Award, Users, Globe, Copy, Check } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface Player {
  name: string
  score: number
  badges: string[]
}

interface LeaderboardProps {
  onBack: () => void
  currentPlayer: Player
  sessionId?: string | null
}

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function Leaderboard({ onBack, currentPlayer, sessionId }: LeaderboardProps) {
  const [sessionTeams, setSessionTeams] = useState<Player[]>([])
  const [sessionName, setSessionName] = useState<string>("")
  const [copiedSessionId, setCopiedSessionId] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionId) {
      loadSessionDataFromSupabase()
    }
  }, [sessionId])

  const loadSessionDataFromSupabase = async () => {
    if (!sessionId) return

    setLoading(true)
    try {
      // Fetch session data
      const { data: sessionData, error: sessionError } = await supabase
        .from("game_sessions")
        .select("name")
        .eq("id", sessionId)
        .single()

      if (sessionError) {
        console.error("Error fetching session:", sessionError)
        return
      }

      if (sessionData) {
        setSessionName(sessionData.name)
      }

      // Fetch teams data for this session
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("name, score, badges")
        .eq("session_id", sessionId)
        .order("score", { ascending: false })

      if (teamsError) {
        console.error("Error fetching teams:", teamsError)
        return
      }

      if (teamsData) {
        const formattedTeams = teamsData.map((team) => ({
          name: team.name,
          score: team.score || 0,
          badges: team.badges || [],
        }))
        setSessionTeams(formattedTeams)
      }
    } catch (error) {
      console.error("Error loading session data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId)
      setCopiedSessionId(true)
      setTimeout(() => setCopiedSessionId(false), 2000)
    }
  }

  const allPlayers = sessionId
    ? [...sessionTeams].sort((a, b) => b.score - a.score)
    : [currentPlayer].sort((a, b) => b.score - a.score) // Removed mock data for single player mode

  const currentPlayerRank = allPlayers.findIndex((p) => p.name === currentPlayer.name) + 1

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Galaxy
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2 justify-center">
            {sessionId ? <Users className="w-8 h-8" /> : <Globe className="w-8 h-8" />}
            {sessionId ? "Mission Leaderboard" : "Galaxy Leaderboard"}
          </h1>
          <p className="text-muted-foreground">
            {sessionId ? `${sessionName} - Session ${sessionId}` : "Top Guardians of the SDG Galaxy"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Your Rank</p>
          <p className="text-2xl font-bold text-accent">#{currentPlayerRank}</p>
        </div>
      </div>

      {sessionId && (
        <div className="max-w-4xl mx-auto mb-6">
          <Card className="bg-card/90 backdrop-blur border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 rounded-full p-3">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{sessionName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {allPlayers.length} teams competing • Session Code:
                      <code className="ml-1 bg-muted px-2 py-1 rounded font-mono text-xs">{sessionId}</code>
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={copySessionId} className="flex items-center gap-2">
                  {copiedSessionId ? (
                    <>
                      <Check className="w-4 h-4 text-accent" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Share Code
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto space-y-4">
        {allPlayers.slice(0, 10).map((player, index) => {
          const rank = index + 1
          const isCurrentPlayer = player.name === currentPlayer.name

          return (
            <Card
              key={player.name}
              className={`bg-card/90 backdrop-blur transition-all duration-300 ${
                isCurrentPlayer ? "border-accent/50 bg-accent/5 animate-pulse-glow" : "border-border/30"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getRankIcon(rank)}
                    <div>
                      <h3 className={`font-bold text-lg ${isCurrentPlayer ? "text-accent" : "text-foreground"}`}>
                        {player.name}
                        {isCurrentPlayer && <span className="ml-2 text-sm text-accent">(Your Team)</span>}
                      </h3>
                      <div className="flex gap-1 mt-1">
                        {player.badges.map((badge, badgeIndex) => (
                          <Badge key={badgeIndex} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{player.score}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats Summary */}
      <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-3 gap-4">
        <Card className="bg-card/90 backdrop-blur border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary text-lg">{sessionId ? "Total Teams" : "Total Guardians"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{allPlayers.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur border-secondary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-secondary text-lg">Badges Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {allPlayers.reduce((total, player) => total + player.badges.length, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90 backdrop-blur border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-accent text-lg">{sessionId ? "Team Progress" : "Your Progress"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round((currentPlayer.badges.length / 5) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Planets Completed</p>
          </CardContent>
        </Card>
      </div>

      {sessionId && (
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <Button onClick={loadSessionDataFromSupabase} variant="outline" className="bg-transparent" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Leaderboard"}
          </Button>
        </div>
      )}
    </div>
  )
}
