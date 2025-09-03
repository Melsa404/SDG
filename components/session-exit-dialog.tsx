"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react"

interface SessionExitDialogProps {
  isOpen: boolean
  onClose: () => void
  onExitSession: () => void
  sessionName: string
  teamName: string
  currentScore: number
  currentBadges: number
}

export function SessionExitDialog({
  isOpen,
  onClose,
  onExitSession,
  sessionName,
  teamName,
  currentScore,
  currentBadges,
}: SessionExitDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur border-destructive/30">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-destructive">Exit Mission Session?</CardTitle>
          <CardDescription>Are you sure you want to leave the multiplayer session?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Session:</span>
              <span className="font-medium">{sessionName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Team:</span>
              <span className="font-medium">{teamName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-bold text-primary">{currentScore}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Badges:</span>
              <span className="font-bold text-accent">{currentBadges}</span>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium">Warning:</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your progress will be saved, but you'll return to single-player mode. You can rejoin this session later
              using the session code.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Stay in Session
            </Button>
            <Button onClick={onExitSession} variant="destructive" className="flex-1">
              Exit Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
