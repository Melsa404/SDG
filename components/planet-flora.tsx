"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface PlanetFloraProps {
  onBack: () => void
  onBadgeEarned: (badge: string, points: number) => void
  playerName: string
}

const questions = [
  {
    id: 1,
    question:
      "Look at this NASA NDVI map for December 2010. The dark green regions show areas with very healthy plant life. Which of the following is most likely one of these dense vegetation zones?",
    link: "https://svs.gsfc.nasa.gov/31053/?utm_source=chatgpt.com#media_group_321980",
    options: ["The Sahara Desert", "The Amazon Rainforest", "The Arctic tundra", "The Outback of Australia"],
    correct: 1,
    explanation:
      "The Amazon appears as one of the darkest green regions—representing its vibrant, dense forests critical to biodiversity and global oxygen production NASA Earth Observations (NEO)Earth Observatory.",
  },
  {
    id: 2,
    question:
      " NASA NDVI maps show green = healthy plants, brown = less plants. If a region turns from green to brown on the map, what does it mean?",
    options: [
      "Forest is healthy ",
      "Trees are disappearing ",
      "New plants are growing ",
      "More animals are living there",
    ],
    correct: 1,
    explanation:"NDVI (Normalized Difference Vegetation Index) uses satellite data to track how “green” the land is. Brown = less plants → deforestation or vegetation loss.",
  },
  {
    id: 3,
    question:
      "NASA forest maps show green = trees, red = lost trees.If a map shows more red patches in the Amazon, what does that tell us?",
    options: [
      "Forests are growing bigger ",
      "Forests are shrinking due to cutting ",
      "Mountains are forming ",
      "Grass is turning into ice ",
    ],
    correct: 1,
    explanation:
      "Red = forest loss, often from logging or farming. This shows kids how satellite maps can reveal human impact on forests.",
  },
  {
    id: 4,
    question:
      "NASA’s vegetation maps change color across seasons (green in summer, less green in winter).",
    options: [
      "Trees grow more leaves ",
      "Snow is covering the ground ",
      "Oceans are rising ",
      "Mountains are moving ",
    ],
    correct: 0,
    explanation:
      "MODIS satellites track seasonal plant growth. Greenness peaks in summer when plants photosynthesize most. This shows Earth’s living cycles.",
  },
  {
    id: 5,
    question:
      "Look at this vegetation map showing the transition from winter (top) to spring-summer (bottom). What causes the land, especially in temperate regions like the U.S., to turn greener during this time?",
    options: [
      "Snow continues to cover the ground",
      "Trees grow more leaves and crops begin flourishing",
      "Urban areas expand rapidly",
      "Ocean water rises and floods the land",
    ],
    correct: 1,
    explanation:
      " The EVI maps visualize how plants respond to seasonal changes. In temperate regions, spring brings longer daylight and warmer temperatures, prompting trees and crops to grow leaves—leading to the increase in 'greenness' that satellites capture and translate into these vivid green maps",
  },
]

export function PlanetFlora({ onBack, onBadgeEarned, playerName }: PlanetFloraProps) {
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
        onBadgeEarned("🌿 Forest Guardian", 100)
      } else {
        onBadgeEarned("🌱 Nature Learner", 50)
      }
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900/20 via-background to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl mx-auto bg-card/90 backdrop-blur border-emerald-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-emerald-400">Mission Complete!</CardTitle>
            <CardDescription>Planet Flora Status Report</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <iframe
                src="/badges/florabadge.html"
                width="192"
                height="192"
                frameBorder="0"
                className="rounded-lg"
                title="Flora Climate Hero Badge"
              />
            </div>
            <p className="text-lg">
              Excellent work, Guardian {playerName}! You scored {score} out of {questions.length} questions correctly.
            </p>
            <div className="bg-emerald-500/10 p-4 rounded-lg">
              <p className="text-emerald-400 font-semibold">
                {score >= 2 ? "🌿 Forest Guardian Badge Earned!" : "🌱 Nature Learner Badge Earned!"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You've helped Planet Flora understand vegetation health using real NASA satellite data!
              </p>
            </div>
            <Button onClick={onBack} className="bg-emerald-600 hover:bg-emerald-700">
              Return to Galaxy Map
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900/20 via-background to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Galaxy
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-400">🌿 Planet Flora</h1>
          <p className="text-muted-foreground">The Living World</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-lg font-bold text-emerald-400">Score: {score}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/90 backdrop-blur border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-400">Vegetation Challenge</CardTitle>
            {question.link && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
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
                  <source src="/videos/question4/video1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {currentQuestion === 1 && (
              <div className="flex justify-center">
                <video
                  controls
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                  style={{ maxHeight: "400px" }}
                >
                  <source src="/videos/question4/video1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {currentQuestion === 2 && (
              <div className="flex justify-center">
                <img
                  src="/images/question4/pic3.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 3 && (
              <div className="flex justify-center">
                <video
                  controls
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                  style={{ maxHeight: "400px" }}
                >
                  <source src="/videos/question4/video4.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {currentQuestion === 4 && (
              <div className="flex justify-center">
                <img
                  src="/images/question4/pic5.png"
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
                    showExplanation && index === question.correct
                      ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-500"
                      : ""
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                  {option}
                </Button>
              ))}
            </div>

            {showExplanation && (
              <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/30">
                <p className="text-emerald-400 font-semibold mb-2">
                  {selectedAnswer === question.correct ? "Correct! ✅" : "Incorrect ❌"}
                </p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            )}

            {showExplanation && (
              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700">
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
