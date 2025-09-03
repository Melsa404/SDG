"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Copy, Check, Wifi, WifiOff, ChevronDown, ChevronUp } from "lucide-react"
import { useRealtimeSession } from "@/hooks/use-realtime-session"

interface TeamPanelProps {
  sessionId: string
  currentTeamName: string
  onRefresh?: () => void
}

export function TeamPanel({ sessionId, currentTeamName, onRefresh }: TeamPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedSessionId, setCopiedSessionId] = useState(false)

  const { teams, isConnected, refreshSession } = useRealtimeSession(sessionId, currentTeamName)

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId)
    setCopiedSessionId(true)
    setTimeout(() => setCopiedSessionId(false), 2000)
  }

  const currentTeam = teams.find((team) => team.name === currentTeamName)
  const currentRank = teams.findIndex((team) => team.name === currentTeamName) + 1

  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="secondary"
          size="sm"
          className="bg-card/95 backdrop-blur border border-primary/30 hover:bg-card/80 flex items-center gap-2 px-3 py-2"
        >
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{teams.length} Teams</span>
          {currentTeam && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              #{currentRank}
            </Badge>
          )}
          {isConnected ? <Wifi className="w-3 h-3 text-accent" /> : <WifiOff className="w-3 h-3 text-destructive" />}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="bg-card/95 backdrop-blur border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Mission Teams
              {isConnected ? (
                <Wifi className="w-4 h-4 text-accent" />
              ) : (
                <WifiOff className="w-4 h-4 text-destructive" />
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-xs flex items-center gap-1"
            >
              <ChevronUp className="w-3 h-3" />
              Collapse
            </Button>
          </div>

          {/* Session Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Session:</span>
              <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{sessionId}</code>
              <Button size="sm" variant="ghost" onClick={copySessionId} className="p-1 h-6 w-6">
                {copiedSessionId ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Current Team Status */}
          {currentTeam && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-accent">Your Team</h4>
                <Badge variant="secondary" className="text-xs">
                  Rank #{currentRank}
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Team:</span>
                  <span className="font-medium">{currentTeam.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-bold text-primary">{currentTeam.score}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Badges:</span>
                  <span className="font-medium">{currentTeam.badges.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Team List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>All Teams ({teams.length})</span>
              <Button variant="ghost" size="sm" onClick={refreshSession} className="text-xs h-6 px-2">
                Refresh
              </Button>
            </div>

            {teams.map((team, index) => {
              const isCurrentTeam = team.name === currentTeamName
              const rank = index + 1

              return (
                <div
                  key={team.id}
                  className={`p-2 rounded-lg border text-sm transition-all duration-300 ${
                    isCurrentTeam ? "bg-accent/10 border-accent/30" : "bg-muted/30 border-border/30 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono w-6">#{rank}</span>
                      <span className={`font-medium ${isCurrentTeam ? "text-accent" : "text-foreground"}`}>
                        {team.name}
                        {isCurrentTeam && <span className="text-xs ml-1">(You)</span>}
                      </span>
                    </div>
                    <span className="font-bold text-primary">{team.score}</span>
                  </div>

                  {team.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {team.badges.slice(0, 3).map((badge, badgeIndex) => (
                        <Badge key={badgeIndex} variant="outline" className="text-xs px-1 py-0">
                          {badge.split(" ")[0]} {/* Show just the emoji */}
                        </Badge>
                      ))}
                      {team.badges.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{team.badges.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-muted/30 rounded p-2">
              <div className="font-bold text-primary">{teams.length}</div>
              <div className="text-muted-foreground">Teams</div>
            </div>
            <div className="bg-muted/30 rounded p-2">
              <div className="font-bold text-secondary">
                {teams.reduce((total, team) => total + team.badges.length, 0)}
              </div>
              <div className="text-muted-foreground">Badges</div>
            </div>
            <div className="bg-muted/30 rounded p-2">
              <div className="font-bold text-accent">{teams.reduce((total, team) => total + team.score, 0)}</div>
              <div className="text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="text-center">
            <Badge variant={isConnected ? "secondary" : "destructive"} className="text-xs">
              {isConnected ? "🟢 Real-time Sync Active" : "🔴 Connection Lost"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
