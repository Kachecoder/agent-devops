import { db } from "./db"
import { eq, and, gte, lte } from "drizzle-orm"
import { campaigns } from "./db"

type MarketAnalysis = {
  topPerformingNiches: { niche: string; revenue: number; roi: number }[]
  marketTrends: { trend: string; growthRate: number; confidence: number }[]
  opportunities: { niche: string; platform: string; potentialRevenue: number; difficulty: string }[]
  recommendations: string[]
}

export async function analyzeMarketingData(niche: string, timeframe: string): Promise<MarketAnalysis> {
  // Calculate date range based on timeframe
  const now = new Date()
  const startDate = new Date()

  switch (timeframe) {
    case "last_week":
      startDate.setDate(now.getDate() - 7)
      break
    case "last_month":
      startDate.setMonth(now.getMonth() - 1)
      break
    case "last_quarter":
      startDate.setMonth(now.getMonth() - 3)
      break
    default:
      startDate.setDate(now.getDate() - 30) // Default to last 30 days
  }

  // Get campaign data for the specified niche and timeframe
  const campaignData = await db.query.campaigns.findMany({
    where: and(
      eq(campaigns.settings.targetAudience, niche),
      gte(campaigns.startDate, startDate),
      lte(campaigns.startDate, now),
    ),
    with: {
      metrics: true,
    },
  })

  // Process the data to generate insights
  const topPerformingNiches = calculateTopNiches(campaignData)
  const marketTrends = identifyMarketTrends(campaignData)
  const opportunities = findOpportunities(campaignData, niche)
  const recommendations = generateRecommendations(topPerformingNiches, marketTrends, opportunities)

  return {
    topPerformingNiches,
    marketTrends,
    opportunities,
    recommendations,
  }
}

function calculateTopNiches(campaignData: any[]): { niche: string; revenue: number; roi: number }[] {
  // Group campaigns by niche and calculate total revenue and ROI
  const nichePerformance: Record<string, { revenue: number; cost: number }> = {}

  campaignData.forEach((campaign) => {
    const niche = campaign.settings.targetAudience
    if (!nichePerformance[niche]) {
      nichePerformance[niche] = { revenue: 0, cost: 0 }
    }

    campaign.metrics.forEach((metric: any) => {
      nichePerformance[niche].revenue += metric.revenue
      nichePerformance[niche].cost += metric.cost
    })
  })

  // Calculate ROI and sort by revenue
  return Object.entries(nichePerformance)
    .map(([niche, { revenue, cost }]) => ({
      niche,
      revenue,
      roi: cost > 0 ? ((revenue - cost) / cost) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5) // Return top 5
}

function identifyMarketTrends(campaignData: any[]): { trend: string; growthRate: number; confidence: number }[] {
  // Simplified implementation - in a real system, this would use more sophisticated trend analysis
  const trends = [
    { trend: "Short-form video content", growthRate: 35, confidence: 0.85 },
    { trend: "AI-generated content", growthRate: 42, confidence: 0.78 },
    { trend: "Voice search optimization", growthRate: 28, confidence: 0.72 },
    { trend: "Micro-influencer marketing", growthRate: 31, confidence: 0.81 },
    { trend: "Interactive content", growthRate: 25, confidence: 0.76 },
  ]

  return trends
}

function findOpportunities(
  campaignData: any[],
  targetNiche: string,
): { niche: string; platform: string; potentialRevenue: number; difficulty: string }[] {
  // Simplified implementation - in a real system, this would use more sophisticated opportunity analysis
  const opportunities = [
    { niche: targetNiche, platform: "YouTube", potentialRevenue: 1200, difficulty: "Medium" },
    { niche: targetNiche, platform: "TikTok", potentialRevenue: 950, difficulty: "Low" },
    { niche: targetNiche, platform: "Instagram", potentialRevenue: 850, difficulty: "Medium" },
    { niche: targetNiche, platform: "Blog + SEO", potentialRevenue: 750, difficulty: "High" },
    { niche: targetNiche, platform: "Email Marketing", potentialRevenue: 650, difficulty: "Medium" },
  ]

  return opportunities
}

function generateRecommendations(
  topNiches: { niche: string; revenue: number; roi: number }[],
  trends: { trend: string; growthRate: number; confidence: number }[],
  opportunities: { niche: string; platform: string; potentialRevenue: number; difficulty: string }[],
): string[] {
  // Generate actionable recommendations based on the analysis
  const recommendations = [
    `Focus on ${opportunities[0].platform} for ${opportunities[0].niche} with potential weekly revenue of $${Math.round(opportunities[0].potentialRevenue / 4)}`,
    `Incorporate ${trends[0].trend} in your content strategy for ${Math.round(trends[0].growthRate)}% growth potential`,
    `Optimize existing campaigns for ${topNiches[0].niche} to improve ROI from ${Math.round(topNiches[0].roi)}%`,
    `Test a small budget campaign on ${opportunities[1].platform} with ${opportunities[1].difficulty} implementation difficulty`,
    `Develop a content calendar that combines ${trends[1].trend} and ${trends[2].trend} for maximum engagement`,
  ]

  return recommendations
}

