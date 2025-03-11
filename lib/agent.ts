import { openai } from "@ai-sdk/openai"
import { streamText, type Tool, type ToolCallPayload } from "ai"
import { z } from "zod"
import { db } from "./db"
import { analyzeMarketingData } from "./analytics"
import { createContent } from "./content-generator"
import { optimizeSEO } from "./seo-optimizer"

// Define the agent's tools
const marketingTools: Tool[] = [
  {
    name: "analyze_market_data",
    description: "Analyzes marketing data to identify trends and opportunities",
    parameters: z.object({
      niche: z.string().describe("The market niche to analyze"),
      timeframe: z.string().describe('The timeframe for analysis (e.g., "last_week", "last_month")'),
    }),
    execute: async ({ niche, timeframe }: { niche: string; timeframe: string }) => {
      const analysis = await analyzeMarketingData(niche, timeframe)
      return JSON.stringify(analysis)
    },
  },
  {
    name: "create_marketing_content",
    description: "Creates marketing content for various platforms",
    parameters: z.object({
      platform: z.enum(["youtube", "tiktok", "blog", "landing_page"]),
      topic: z.string().describe("The topic of the content"),
      targetAudience: z.string().describe("The target audience for the content"),
      contentType: z.string().describe('The type of content (e.g., "tutorial", "review", "comparison")'),
    }),
    execute: async ({ platform, topic, targetAudience, contentType }) => {
      const content = await createContent(platform, topic, targetAudience, contentType)
      return JSON.stringify(content)
    },
  },
  {
    name: "optimize_seo",
    description: "Optimizes content for search engines",
    parameters: z.object({
      content: z.string().describe("The content to optimize"),
      keywords: z.array(z.string()).describe("Target keywords for optimization"),
      platform: z.string().describe("The platform where the content will be published"),
    }),
    execute: async ({ content, keywords, platform }) => {
      const optimizedContent = await optimizeSEO(content, keywords, platform)
      return JSON.stringify(optimizedContent)
    },
  },
  {
    name: "track_campaign_performance",
    description: "Tracks the performance of marketing campaigns",
    parameters: z.object({
      campaignId: z.string().describe("The ID of the campaign to track"),
      metrics: z.array(z.string()).describe('The metrics to track (e.g., "conversions", "clicks", "revenue")'),
    }),
    execute: async ({ campaignId, metrics }) => {
      const performance = await db.campaign.findUnique({
        where: { id: campaignId },
        include: { metrics: true },
      })
      return JSON.stringify(performance)
    },
  },
]

// The agent's system prompt
const SYSTEM_PROMPT = `You are an autonomous Digital Marketing Agent with expertise in affiliate marketing, 
faceless YouTube/TikTok campaigns, and side hustles. Your objective is to help users earn $1,000/week 
through AI-driven digital marketing strategies.

You have expertise in:
- Revenue Generation through affiliate marketing, content creation, and digital products
- Technical execution using modern web technologies
- SEO optimization for maximum visibility
- AI integration for marketing automation

Always prioritize ethical marketing practices and focus on sustainable revenue generation strategies.
Provide specific, actionable advice based on data analysis.`

// Function to run the marketing agent
export async function runMarketingAgent(userPrompt: string, userId: string) {
  const model = openai("gpt-4o")

  // Get user context from the database
  const userContext = await db.user.findUnique({
    where: { id: userId },
    include: { campaigns: true, preferences: true },
  })

  const contextPrompt = `
User Context:
- Previous campaigns: ${JSON.stringify(userContext?.campaigns || [])}
- Preferences: ${JSON.stringify(userContext?.preferences || {})}

User Query: ${userPrompt}

Analyze the user's query and determine the best course of action. Use your tools to provide 
data-driven recommendations and actionable steps.
`

  return streamText({
    model,
    system: SYSTEM_PROMPT,
    prompt: contextPrompt,
    tools: marketingTools,
    maxSteps: 5, // Allow multiple tool calls to complete complex tasks
  })
}

// Function to handle tool calls from the agent
export async function handleToolCall(toolCall: ToolCallPayload) {
  const tool = marketingTools.find((t) => t.name === toolCall.name)
  if (!tool) {
    throw new Error(`Tool ${toolCall.name} not found`)
  }

  return tool.execute(toolCall.arguments)
}

