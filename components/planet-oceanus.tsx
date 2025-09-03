"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface PlanetOceanusProps {
  onBack: () => void
  onBadgeEarned: (badge: string, points: number) => void
  playerName: string
}

const questions = [
  {
    id: 1,
    question:
      "Why are the ocean’s edges near continents often brighter green than the open ocean on this map?",
    link: "https://svs.gsfc.nasa.gov/31053/?utm_source=chatgpt.com#media_group_321980",
    options: ["Shallow water causes glare", "Rivers bring nutrients that boost plankton growth ", "Ships cause algae to glow", "Coral reefs reflect green light"],
    correct: 1,
    explanation:
      "Nutrients from rivers and ocean currents fuel plankton blooms, essential for marine food webs.",
  },
  {
    id: 2,
    question:
      " The green areas on the NASA map show lots of phytoplankton. Why is this important?",
    options: [
      "Plankton make the ocean look pretty",
      "Plankton feed fish and produce oxygen",
      "Plankton eat plastic",
      "Plankton make the water shallow",
    ],
    correct: 1,
    explanation:"Phytoplankton = base of the food chain + oxygen for Earth.",
  },
  {
    id: 3,
    question:
      "Where is the Ocean Struggling Most? The red areas on NASA’s ocean temperature map show warming seas. What happens when oceans warm too much?",
    options: [
      "More icebergs form",
      "Fish and corals get stressed",
      "More rain falls",
      "Oceans turn green",
    ],
    correct: 1,
    explanation:
      "Ocean warming = bleaching, fish migration, ecosystem shifts.",
  },
  {
    id: 4,
    question:
      "Scientists use chlorophyll maps to spot areas with too many algae. Why is this important?",
    options: [
      "MAlgae make the sea smell good",
      "Too many algae can kill fish and harm people",
      "Algae turn into coral reefs",
      "Fishermen can eat the algae",
    ],
    correct: 1,
    explanation:
      "NASA data helps warn communities about harmful algal blooms, protecting food, health, and oceans.",
  },
  {
    id: 5,
    question:
      "Fishermen use NASA ocean temperature maps to know where fish might be found. Why?",
    options: [
      "Fish follow cooler or warmer waters",
      "Fish like to swim in red water",
      "Maps show where boats are parked",
      "Temperature makes oceans look pretty",
    ],
    correct: 0,
    explanation:
      " NASA helps fishermen locate fish safely & sustainably → supports SDG 14.",
  },
]

export function PlanetOceanus({ onBack, onBadgeEarned, playerName }: PlanetOceanusProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
      if (score >= 2) {
        onBadgeEarned("🌊 Ocean Guardian", 100)
      } else {
        onBadgeEarned("🐠 Marine Learner", 50)
      }
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-900/20 via-background to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl mx-auto bg-card/90 backdrop-blur border-cyan-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-cyan-400">Mission Complete!</CardTitle>
            <CardDescription>Planet Oceanus Status Report</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <iframe
                src="/badges/oceanousbadge.html"
                width="192"
                height="192"
                frameBorder="0"
                className="rounded-lg"
                title="Oceanus Climate Hero Badge"
              />
            </div>
            <p className="text-lg">
              Excellent work, Guardian {playerName}! You scored {score} out of {questions.length} questions correctly.
            </p>
            <div className="bg-cyan-500/10 p-4 rounded-lg">
              <p className="text-cyan-400 font-semibold">
                {score >= 2 ? "🌊 Ocean Guardian Badge Earned!" : "🐠 Marine Learner Badge Earned!"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You've helped Planet Oceanus understand ocean health using real NASA data!
              </p>
            </div>
            <Button onClick={onBack} className="bg-cyan-600 hover:bg-cyan-700">
              Return to Galaxy Map
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900/20 via-background to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Galaxy
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-cyan-400">🌊 Planet Oceanus</h1>
          <p className="text-muted-foreground">Life Below Water</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-lg font-bold text-cyan-400">Score: {score}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/90 backdrop-blur border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-400">Ocean Challenge</CardTitle>
            {question.link && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  View NASA Data
                </a>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">{question.question}</p>
            {currentQuestion === 0 && (
              <div className="flex justify-center">
                <img
                  src="/images/question3/pic1.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 1 && (
              <div className="flex justify-center">
                <img
                  src="/images/question3/pic1.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 2 && (
              <div className="flex justify-center">
                <img
                  src="/images/question3/pic3.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 3 && (
              <div className="flex justify-center">
                <img
                  src="/images/question3/pic3.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  variant={
                    showExplanation
                      ? index === question.correct
                        ? "default"
                        : selectedAnswer === index
                          ? "destructive"
                          : "outline"
                      : "outline"
                  }
                  className={`text-left justify-start h-auto p-4 ${
                    showExplanation && index === question.correct ? "bg-cyan-600 hover:bg-cyan-700 border-cyan-500" : ""
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                  {option}
                </Button>
              ))}
            </div>

            {showExplanation && (
              <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/30">
                <p className="text-cyan-400 font-semibold mb-2">
                  {selectedAnswer === question.correct ? "Correct! ✅" : "Incorrect ❌"}
                </p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            )}

            {showExplanation && (
              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-700">
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Mission"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
