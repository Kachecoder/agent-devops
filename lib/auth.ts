import { cookies } from "next/headers"

type Session = {
  user: {
    id: string
    email: string
    name?: string
  }
}

export async function auth(): Promise<Session | null> {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  // In a real app, this would validate the session token and fetch the user
  // This is a simplified example that returns a mock user
  return {
    user: {
      id: "user_123",
      email: "user@example.com",
      name: "Demo User",
    },
  }
}
