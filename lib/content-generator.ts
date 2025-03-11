import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

type ContentOutput = {
  title: string
  description: string
  outline: string[]
  keywords: string[]
  callToAction: string
  estimatedEngagement: {
    views: number
    conversionRate: number
    potentialRevenue: number
  }
}

export async function createContent(
  platform: string,
  topic: string,
  targetAudience: string,
  contentType: string,
): Promise<ContentOutput> {
  const model = openai("gpt-4o")

  const prompt = `
Create high-converting ${contentType} content for ${platform} about "${topic}" targeting ${targetAudience}.

The content should:
1. Be optimized for ${platform}'s algorithm and user behavior
2. Include hooks that capture attention in the first 3 seconds
3. Have clear calls to action for affiliate marketing or product promotion
4. Be structured for maximum engagement and retention
5. Include SEO-optimized elements where applicable

Format the response as a structured content plan with title, description, outline, keywords, call to action, 
and estimated engagement metrics.
`

  const { text } = await generateText({
    model,
    prompt,
  })

  // Parse the generated text into structured content
  // This is a simplified implementation - in a real system, you would use more robust parsing
  try {
    // Extract title
    const titleMatch = text.match(/Title:?\s*(.*?)(?:\n|$)/i)
    const title = titleMatch ? titleMatch[1].trim() : `${topic} for ${targetAudience}`

    // Extract description
    const descMatch = text.match(/Description:?\s*(.*?)(?:\n\n|\n[A-Z])/is)
    const description = descMatch ? descMatch[1].trim() : ""

    // Extract outline
    const outlineMatch = text.match(/Outline:?\s*([\s\S]*?)(?:\n\n|\n[A-Z])/i)
    const outlineText = outlineMatch ? outlineMatch[1] : ""
    const outline = outlineText
      .split("\n")
      .map((line) => line.replace(/^[0-9-.\s]+/, "").trim())
      .filter((line) => line.length > 0)

    // Extract keywords
    const keywordsMatch = text.match(/Keywords:?\s*([\s\S]*?)(?:\n\n|\n[A-Z])/i)
    const keywordsText = keywordsMatch ? keywordsMatch[1] : ""
    const keywords = keywordsText
      .split(/[,\n]/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    // Extract call to action
    const ctaMatch = text.match(/Call to Action:?\s*([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i)
    const callToAction = ctaMatch ? ctaMatch[1].trim() : ""

    // Generate estimated engagement metrics based on platform and content type
    const estimatedEngagement = generateEngagementEstimates(platform, contentType)

    return {
      title,
      description,
      outline,
      keywords,
      callToAction,
      estimatedEngagement,
    }
  } catch (error) {
    console.error("Error parsing generated content:", error)

    // Return fallback content if parsing fails
    return {
      title: `${topic} Guide for ${targetAudience}`,
      description: `A comprehensive ${contentType} about ${topic} designed specifically for ${targetAudience}.`,
      outline: ["Introduction", "Main Points", "Benefits", "How-to Steps", "Conclusion"],
      keywords: [topic, targetAudience, contentType, platform],
      callToAction: `Learn more about ${topic} and start implementing these strategies today!`,
      estimatedEngagement: generateEngagementEstimates(platform, contentType),
    }
  }
}

function generateEngagementEstimates(
  platform: string,
  contentType: string,
): {
  views: number
  conversionRate: number
  potentialRevenue: number
} {
  // Base estimates that would be refined with actual data in a real system
  const baseEstimates = {
    youtube: { views: 5000, conversionRate: 0.02, revenuePerConversion: 25 },
    tiktok: { views: 8000, conversionRate: 0.015, revenuePerConversion: 20 },
    blog: { views: 2000, conversionRate: 0.03, revenuePerConversion: 30 },
    landing_page: { views: 1000, conversionRate: 0.05, revenuePerConversion: 40 },
  }

  // Content type modifiers
  const contentModifiers = {
    tutorial: { viewsMultiplier: 1.2, conversionMultiplier: 1.3 },
    review: { viewsMultiplier: 1.1, conversionMultiplier: 1.5 },
    comparison: { viewsMultiplier: 0.9, conversionMultiplier: 1.2 },
    story: { viewsMultiplier: 1.4, conversionMultiplier: 0.8 },
  }

  // Get base estimates for the platform (default to blog if not found)
  const base = baseEstimates[platform.toLowerCase() as keyof typeof baseEstimates] || baseEstimates.blog

  // Get content modifiers (default to tutorial if not found)
  const modifier =
    contentModifiers[contentType.toLowerCase() as keyof typeof contentModifiers] || contentModifiers.tutorial

  // Calculate estimates
  const views = Math.round(base.views * modifier.viewsMultiplier)
  const conversionRate = base.conversionRate * modifier.conversionMultiplier
  const potentialRevenue = Math.round(views * conversionRate * base.revenuePerConversion)

  return {
    views,
    conversionRate,
    potentialRevenue,
  }
}

