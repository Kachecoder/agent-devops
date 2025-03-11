import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"

async function getCampaigns() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  // In a real app, this would fetch actual data from the database
  // This is a simplified example
  return [
    {
      id: 1,
      name: "Affiliate Product Review",
      platform: "YouTube",
      status: "active",
      revenue: 320,
      conversionRate: 2.4,
    },
    {
      id: 2,
      name: "Tutorial Series",
      platform: "TikTok",
      status: "active",
      revenue: 280,
      conversionRate: 1.8,
    },
    {
      id: 3,
      name: "Product Comparison",
      platform: "Blog",
      status: "draft",
      revenue: 0,
      conversionRate: 0,
    },
  ]
}

export async function CampaignList() {
  const campaigns = await getCampaigns()

  return (
    <div className="space-y-4">
      {campaigns.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No active campaigns</p>
      ) : (
        campaigns.map((campaign) => (
          <div key={campaign.id} className="border rounded-md p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{campaign.name}</h3>
                <p className="text-sm text-gray-500">{campaign.platform}</p>
              </div>
              <Badge variant={campaign.status === "active" ? "default" : "outline"}>{campaign.status}</Badge>
            </div>
            {campaign.status === "active" && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm">
                  <span className="text-gray-500">Revenue:</span>{" "}
                  <span className="font-medium">${campaign.revenue}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Conv. Rate:</span>{" "}
                  <span className="font-medium">{campaign.conversionRate}%</span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
