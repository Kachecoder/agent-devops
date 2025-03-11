import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { DollarSign, TrendingUp, Users, BarChart } from "lucide-react"

async function getMarketingStats() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      totalRevenue: 0,
      weeklyRevenue: 0,
      conversionRate: 0,
      activeAudience: 0,
    }
  }

  // In a real app, this would fetch actual data from the database
  // This is a simplified example
  return {
    totalRevenue: 4250,
    weeklyRevenue: 950,
    conversionRate: 2.8,
    activeAudience: 12500,
  }
}

export default async function MarketingDashboard() {
  const stats = await getMarketingStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRevenue}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.weeklyRevenue}</div>
          <p className="text-xs text-muted-foreground">
            {stats.weeklyRevenue >= 1000
              ? "Goal achieved!"
              : `${Math.round((stats.weeklyRevenue / 1000) * 100)}% of $1,000 goal`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          <p className="text-xs text-muted-foreground">+0.5% from last week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Audience</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeAudience.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+12.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}