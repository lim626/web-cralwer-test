import { type NextRequest, NextResponse } from "next/server"
import type { CrawlResult, CrawlData } from "@/types/crawler"

// Simulated database
const crawlResults: CrawlResult[] = []

// Simulated authorization middleware
function authorize(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }
  // In a real app, validate the token here
  return true
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  let filtered = crawlResults

  if (status && status !== "all") {
    filtered = filtered.filter((result) => result.status === status)
  }

  if (search) {
    filtered = filtered.filter(
      (result) =>
        result.url.toLowerCase().includes(search.toLowerCase()) ||
        result.data?.title?.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return NextResponse.json(filtered)
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    const newResult: CrawlResult = {
      id: Date.now().toString(),
      url,
      status: "queued",
      createdAt: new Date().toISOString(),
      data: null,
    }

    crawlResults.push(newResult)

    // Simulate async crawling
    setTimeout(() => {
      simulateCrawl(newResult.id)
    }, 1000)

    return NextResponse.json(newResult, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

// Simulate the crawling process
async function simulateCrawl(id: string) {
  const resultIndex = crawlResults.findIndex((r) => r.id === id)
  if (resultIndex === -1) return

  // Update to running
  crawlResults[resultIndex] = {
    ...crawlResults[resultIndex],
    status: "running",
    startedAt: new Date().toISOString(),
  }

  // Simulate crawling time
  await new Promise((resolve) => setTimeout(resolve, 3000 + Math.random() * 5000))

  // Generate mock data
  const mockData: CrawlData = {
    htmlVersion: "HTML5",
    title: `Sample Title for ${new URL(crawlResults[resultIndex].url).hostname}`,
    headingCounts: {
      h1: Math.floor(Math.random() * 5) + 1,
      h2: Math.floor(Math.random() * 10) + 2,
      h3: Math.floor(Math.random() * 15) + 3,
      h4: Math.floor(Math.random() * 8),
      h5: Math.floor(Math.random() * 5),
      h6: Math.floor(Math.random() * 3),
    },
    internalLinks: Math.floor(Math.random() * 50) + 10,
    externalLinks: Math.floor(Math.random() * 20) + 5,
    brokenLinks: [
      { url: "/broken-page", statusCode: 404 },
      { url: "/server-error", statusCode: 500 },
      { url: "/forbidden", statusCode: 403 },
    ].slice(0, Math.floor(Math.random() * 4)),
    hasLoginForm: Math.random() > 0.5,
  }

  // Update to completed
  crawlResults[resultIndex] = {
    ...crawlResults[resultIndex],
    status: "completed",
    completedAt: new Date().toISOString(),
    data: mockData,
  }
}
