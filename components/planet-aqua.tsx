"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface PlanetAquaProps {
  onBack: () => void
  onBadgeEarned: (badge: string, points: number) => void
  playerName: string
}

const questions = [
  {
    id: 1,
    question:
      "The IMERG map shows very heavy rainfall in equatorial regions (bright colors), but much less in areas just north and south of the tropics. Why is this imbalance a crisis for Planet Aqua?",
    link: "https://gpm.nasa.gov/data/imerg",
    options: [
      "Because floods can destroy homes and crops in rainy zones while deserts expand in dry zones 🌧️🔥",
      "Because satellites make errors and show rain where it doesn't really exist 🛰️",
      "Because the ocean only rains over land, skipping deserts 🌍",
      "Because volcanoes are erupting everywhere, creating fake rain ☄️",
    ],
    correct: 0,
    explanation:
      "Planet Aqua's crisis is real—too much rain in some areas leads to flooding, while too little rain in others causes drought.",
  },
  {
    id: 2,
    question:
      "Looking at the rainfall map (blue = lots of rain, yellow/red = very little rain), which place receives the least rainfall?",
    options: ["Amazon Rainforest (South America)", "Sahara Desert (Africa)", "India (Asia)", "Southeast Asia"],
    correct: 1,
    explanation:
      "The Sahara Desert appears yellow/red on the NASA map, indicating very dry conditions with very little rainfall.",
  },
  {
    id: 3,
    question:
      "This NASA soil moisture map shows brown areas which means soil is dry and low in moisture. What can farmers do to save water?",
    link: "https://smap.jpl.nasa.gov/news/1266/nasa-soil-moisture-data-advance-global-crop-forecasts/",
    options: [
      "Use drip irrigation 💧",
      "Flood fields with excess water 🌊",
      "Cut down trees 🌲✂️",
      "Burn crop waste 🔥",
    ],
    correct: 0,
    explanation:
      "Drip irrigation delivers water directly to plant roots, reducing waste and conserving precious water resources.",
  },
  {
    id: 4,
    question:
      "GRACE satellites show fast-declining groundwater in northern India due to over-irrigation of rice and wheat. What long-term crisis could this cause, and which action best prevents it?",
    link: "https://svs.gsfc.nasa.gov/10764/",
    options: [
      "Crisis: Food + water insecurity -> Action: Shift to drought-resistant crops & recharge aquifers",
      "Crisis: Groundwater flooding -> Action: Build taller dams ",
      "Crisis: Unlimited water supply -> Action: Keep drilling borewells ",
      "Crisis: Ocean levels rise faster -> Action: Stop using rivers ",
    ],
    correct: 0,
    explanation:
      "Over-pumping lowers aquifers → threatens agriculture + cities. Crop switching + recharge = resilience.",
  },
  {
    id: 5,
    question:
      "This NASA soil moisture map shows brown areas which means soil is dry and low in moisture. What can farmers do to save water?",
    link: "https://smap.jpl.nasa.gov/news/1266/nasa-soil-moisture-data-advance-global-crop-forecasts/",
    options: [
      "Use drip irrigation",
      "Flood fields with excess water",
      "Cut down trees",
      "Burn crop waste",
    ],
    correct: 0,
    explanation:
      "Drip irrigation delivers water directly to plant roots, reducing waste and conserving precious water resources.",
  },
]

export function PlanetAqua({ onBack, onBadgeEarned, playerName }: PlanetAquaProps) {
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
      // Award badge based on score
      if (score >= 2) {
        onBadgeEarned("💧 Water Guardian", 100)
      } else {
        onBadgeEarned("🌊 Water Learner", 50)
      }
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900/20 via-background to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl mx-auto bg-card/90 backdrop-blur border-blue-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-blue-400">Mission Complete!</CardTitle>
            <CardDescription>Planet Aqua Status Report</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <iframe
                src="/badges/aquabadge.html"
                width="192"
                height="192"
                frameBorder="0"
                className="rounded-lg"
                title="Aqua Climate Hero Badge"
              />
            </div>
            <p className="text-lg">
              Outstanding work, Guardian {playerName}! You scored {score} out of {questions.length} questions correctly.
            </p>
            <div className="bg-blue-500/10 p-4 rounded-lg">
              <p className="text-blue-400 font-semibold">
                {score >= 2 ? "💧 Water Guardian Badge Earned!" : "🌊 Water Learner Badge Earned!"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You've helped Planet Aqua restore water balance using real NASA data!
              </p>
            </div>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              Return to Galaxy Map
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/20 via-background to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Galaxy
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-400">💧 Planet Aqua</h1>
          <p className="text-muted-foreground">The Thirsty World</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-lg font-bold text-blue-400">Score: {score}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/90 backdrop-blur border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-blue-400">Water Challenge</CardTitle>
            {question.link && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
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
                <video
                  controls
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                  style={{ maxHeight: "400px" }}
                >
                  <source src="/videos/question2/video1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {currentQuestion === 1 && (
              <div className="flex justify-center">
                <img
                  src="/images/question2/pic2.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 2 && (
              <div className="flex justify-center">
                <img
                  src="/images/question2/pic2.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 3 && (
              <div className="flex justify-center">
                <img
                  src="/images/question2/pic4.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 4 && (
              <div className="flex justify-center">
                <img
                  src="/images/question2/pic5.png"
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
                    showExplanation && index === question.correct ? "bg-blue-600 hover:bg-blue-700 border-blue-500" : ""
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                  {option}
                </Button>
              ))}
            </div>

            {showExplanation && (
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                <p className="text-blue-400 font-semibold mb-2">
                  {selectedAnswer === question.correct ? "Correct! ✅" : "Incorrect ❌"}
                </p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            )}

            {showExplanation && (
              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
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
