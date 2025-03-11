import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, DollarSign } from "lucide-react"

async function getMarketingInsights() {
  // In a real app, this would fetch actual insights from the AI agent
  // This is a simplified example
  return [
    {
      type: "opportunity",
      title: "TikTok Short-Form Content",
      description: "Short-form video content on TikTok is showing 35% higher engagement for your niche.",
      potentialRevenue: 450,
      difficulty: "Low",
    },
    {
      type: "trend",
      title: "AI-Generated Content",
      description: "Using AI to create and optimize content can reduce production time by 60%.",
      growthRate: 42,
    },
    {
      type: "recommendation",
      title: "Optimize YouTube Thumbnails",
      description: "A/B testing shows custom thumbnails increase click-through rates by 28%.",
      impact: "Medium",
    },
  ]
}

export async function MarketingInsights() {
  const insights = await getMarketingInsights()

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {insight.type === "opportunity" && <DollarSign className="h-5 w-5 text-green-500" />}
                {insight.type === "trend" && <TrendingUp className="h-5 w-5 text-blue-500" />}
                {insight.type === "recommendation" && <Lightbulb className="h-5 w-5 text-amber-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{insight.title}</h3>
                  <Badge variant="outline" className="capitalize">
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>

                <div className="mt-2">
                  {insight.type === "opportunity" && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Potential Weekly Revenue:</span>
                      <span className="font-medium text-green-600">${insight.potentialRevenue}</span>
                    </div>
                  )}
                  {insight.type === "trend" && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Growth Rate:</span>
                      <span className="font-medium text-blue-600">{insight.growthRate}%</span>
                    </div>
                  )}
                  {insight.type === "recommendation" && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Impact:</span>
                      <span className="font-medium">{insight.impact}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}