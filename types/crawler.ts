export type CrawlStatus = "queued" | "running" | "completed" | "error" | "stopped"

export interface BrokenLink {
  url: string
  statusCode: number
}

export interface HeadingCounts {
  h1: number
  h2: number
  h3: number
  h4: number
  h5: number
  h6: number
}

export interface CrawlData {
  htmlVersion: string
  title: string
  headingCounts: HeadingCounts
  internalLinks: number
  externalLinks: number
  brokenLinks: BrokenLink[]
  hasLoginForm: boolean
}

export interface CrawlResult {
  id: string
  url: string
  status: CrawlStatus
  createdAt: string
  startedAt?: string
  completedAt?: string
  data: CrawlData | null
}
