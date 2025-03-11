"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const demoData = [
  { day: "Mon", revenue: 120 },
  { day: "Tue", revenue: 180 },
  { day: "Wed", revenue: 150 },
  { day: "Thu", revenue: 250 },
  { day: "Fri", revenue: 300 },
  { day: "Sat", revenue: 220 },
  { day: "Sun", revenue: 180 },
]

export function RevenueChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[200px] bg-gray-100 animate-pulse rounded-md" />
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={demoData}>
        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border rounded-md shadow-sm">
                  <p className="font-medium">{`$${payload[0].value}`}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}