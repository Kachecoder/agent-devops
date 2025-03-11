import { type NextRequest, NextResponse } from "next/server"
import { runMarketingAgent, handleToolCall } from "@/src/lib/agent"
import { auth } from "@/src/lib/auth"

export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        const agentStream = await runMarketingAgent(prompt, session.user.id)

        // Handle the agent's response
        agentStream.onTextContent((content: string) => {
          controller.enqueue(encoder.encode(content))
        })

        agentStream.onToolCall(async (toolCall) => {
          try {
            const result = await handleToolCall(toolCall)
            controller.enqueue(encoder.encode(`\n\nTool Result: ${result}\n\n`))
          } catch (error) {
            controller.enqueue(encoder.encode(`\n\nTool Error: ${error}\n\n`))
          }
        })

        agentStream.onFinal(() => {
          controller.close()
        })
      },
    })

    // Return the stream
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Agent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}