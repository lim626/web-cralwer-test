import { type NextRequest, NextResponse } from "next/server"

// This would be your actual database in a real application
const crawlResults: any[] = []

function authorize(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }
  return true
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const { action } = await request.json()

  const resultIndex = crawlResults.findIndex((r) => r.id === id)
  if (resultIndex === -1) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 })
  }

  switch (action) {
    case "start":
      crawlResults[resultIndex] = {
        ...crawlResults[resultIndex],
        status: "running",
        startedAt: new Date().toISOString(),
      }
      break
    case "stop":
      crawlResults[resultIndex] = {
        ...crawlResults[resultIndex],
        status: "stopped",
      }
      break
    case "rerun":
      crawlResults[resultIndex] = {
        ...crawlResults[resultIndex],
        status: "queued",
        data: null,
      }
      break
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  return NextResponse.json(crawlResults[resultIndex])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const resultIndex = crawlResults.findIndex((r) => r.id === id)

  if (resultIndex === -1) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 })
  }

  crawlResults.splice(resultIndex, 1)
  return NextResponse.json({ success: true })
}
