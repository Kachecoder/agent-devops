import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { pgTable, serial, text, timestamp, json, integer, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

// Define schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
  preferences: json("preferences").$type<{
    marketingNiches: string[]
    preferredPlatforms: string[]
    budgetRange: string
    revenueGoals: string
  }>(),
})

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("draft"),
  budget: integer("budget"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  settings: json("settings").$type<{
    targetAudience: string
    keywords: string[]
    contentType: string
    automationLevel: string
  }>(),
})

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  date: timestamp("date").defaultNow(),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  conversions: integer("conversions").default(0),
  revenue: integer("revenue").default(0),
  cost: integer("cost").default(0),
  roi: integer("roi").default(0),
})

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  seoScore: integer("seo_score"),
  assetUrl: text("asset_url"),
  isAutomated: boolean("is_automated").default(false),
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
}))

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  metrics: many(metrics),
  content: many(content),
}))

export const metricsRelations = relations(metrics, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [metrics.campaignId],
    references: [campaigns.id],
  }),
}))

export const contentRelations = relations(content, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [content.campaignId],
    references: [campaigns.id],
  }),
}))

// Export the database client
export const db = drizzle(pool, {
  schema: {
    users,
    campaigns,
    metrics,
    content,
  },
})

