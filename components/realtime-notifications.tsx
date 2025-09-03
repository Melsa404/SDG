"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Trophy, Star, Users } from "lucide-react"

interface SessionUpdate {
  type: "badge_earned" | "score_updated" | "team_joined"
  teamName: string
  data: any
  timestamp: number
}

interface RealtimeNotificationsProps {
  updates: SessionUpdate[]
  onClear: () => void
}

export function RealtimeNotifications({ updates, onClear }: RealtimeNotificationsProps) {
  const [visibleUpdates, setVisibleUpdates] = useState<SessionUpdate[]>([])

  useEffect(() => {
    if (updates.length > 0) {
      setVisibleUpdates(updates.slice(0, 3)) // Show only latest 3
    }
  }, [updates])

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "badge_earned":
        return <Star className="w-4 h-4 text-accent" />
      case "score_updated":
        return <Trophy className="w-4 h-4 text-primary" />
      case "team_joined":
        return <Users className="w-4 h-4 text-secondary" />
      default:
        return null
    }
  }

  const getUpdateMessage = (update: SessionUpdate) => {
    switch (update.type) {
      case "badge_earned":
        return `${update.teamName} earned ${update.data.badge}!`
      case "score_updated":
        const pointsGained = update.data.newScore - update.data.oldScore
        return `${update.teamName} scored ${pointsGained} points!`
      case "team_joined":
        return `${update.teamName} joined the mission!`
      default:
        return "Unknown update"
    }
  }

  const getUpdateColor = (type: string) => {
    switch (type) {
      case "badge_earned":
        return "border-accent/30 bg-accent/5"
      case "score_updated":
        return "border-primary/30 bg-primary/5"
      case "team_joined":
        return "border-secondary/30 bg-secondary/5"
      default:
        return "border-border/30"
    }
  }

  if (visibleUpdates.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-30 space-y-2 w-80">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs">
          Live Updates
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0">
          <X className="w-3 h-3" />
        </Button>
      </div>

      {visibleUpdates.map((update, index) => (
        <Card
          key={`${update.timestamp}-${index}`}
          className={`bg-card/95 backdrop-blur transition-all duration-500 animate-in slide-in-from-right ${getUpdateColor(update.type)}`}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              {getUpdateIcon(update.type)}
              <p className="text-sm font-medium flex-1">{getUpdateMessage(update)}</p>
              <span className="text-xs text-muted-foreground">
                {Math.floor((Date.now() - update.timestamp) / 1000)}s ago
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
