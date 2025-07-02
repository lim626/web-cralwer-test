"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { CrawlResultsTable } from "@/components/crawl-results-table"
import { CrawlDetailsModal } from "@/components/crawl-details-modal"
import { BulkActionsBar } from "@/components/bulk-actions-bar"
import { useToast } from "@/hooks/use-toast"
import type { CrawlResult, CrawlStatus } from "@/types/crawler"

export default function WebCrawlerDashboard() {
  const [urls, setUrls] = useState<CrawlResult[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CrawlStatus | "all">("all")
  const [selectedResult, setSelectedResult] = useState<CrawlResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUrls((prevUrls) =>
        prevUrls.map((url) => {
          if (url.status === "running") {
            // Simulate completion after some time
            if (Math.random() > 0.7) {
              return {
                ...url,
                status: "completed" as CrawlStatus,
                completedAt: new Date().toISOString(),
                data: {
                  htmlVersion: "HTML5",
                  title: `Sample Title for ${new URL(url.url).hostname}`,
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
                  ].slice(0, Math.floor(Math.random() * 3)),
                  hasLoginForm: Math.random() > 0.5,
                },
              }
            }
          }
          return url
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const addUrl = async () => {
    if (!newUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to add",
        variant: "destructive",
      })
      return
    }

    try {
      new URL(newUrl) // Validate URL
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newCrawlResult: CrawlResult = {
        id: Date.now().toString(),
        url: newUrl,
        status: "queued",
        createdAt: new Date().toISOString(),
        data: null,
      }

      setUrls((prev) => [...prev, newCrawlResult])
      setNewUrl("")

      toast({
        title: "URL Added",
        description: "URL has been queued for crawling",
      })

      // Auto-start crawling after a short delay
      setTimeout(() => {
        setUrls((prev) =>
          prev.map((url) =>
            url.id === newCrawlResult.id
              ? { ...url, status: "running" as CrawlStatus, startedAt: new Date().toISOString() }
              : url,
          ),
        )
      }, 1000)
    } catch (error) {
      console.error("Failed to add URL:", error)
      toast({
        title: "Error",
        description: "Failed to add URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addDemoUrls = () => {
    const demoUrls = [
      "https://example.com",
      "https://github.com",
      "https://stackoverflow.com",
      "https://developer.mozilla.org",
      "https://react.dev",
    ]

    demoUrls.forEach((url, index) => {
      setTimeout(() => {
        const newCrawlResult: CrawlResult = {
          id: (Date.now() + index).toString(),
          url,
          status: "queued",
          createdAt: new Date().toISOString(),
          data: null,
        }

        setUrls((prev) => [...prev, newCrawlResult])

        // Auto-start crawling with staggered timing
        setTimeout(
          () => {
            setUrls((prev) =>
              prev.map((result) =>
                result.id === newCrawlResult.id
                  ? { ...result, status: "running" as CrawlStatus, startedAt: new Date().toISOString() }
                  : result,
              ),
            )
          },
          2000 + index * 500,
        )
      }, index * 300)
    })

    toast({
      title: "Demo URLs Added",
      description: `Added ${demoUrls.length} demo URLs for testing`,
    })
  }

  const startCrawling = (urlIds: string[]) => {
    setUrls((prev) =>
      prev.map((url) =>
        urlIds.includes(url.id)
          ? { ...url, status: "running" as CrawlStatus, startedAt: new Date().toISOString() }
          : url,
      ),
    )

    toast({
      title: "Crawling Started",
      description: `Started crawling ${urlIds.length} URL(s)`,
    })
  }

  const stopCrawling = (urlIds: string[]) => {
    setUrls((prev) =>
      prev.map((url) =>
        urlIds.includes(url.id) && url.status === "running" ? { ...url, status: "stopped" as CrawlStatus } : url,
      ),
    )

    toast({
      title: "Crawling Stopped",
      description: `Stopped crawling ${urlIds.length} URL(s)`,
    })
  }

  const deleteUrls = (urlIds: string[]) => {
    setUrls((prev) => prev.filter((url) => !urlIds.includes(url.id)))
    setSelectedUrls(new Set())

    toast({
      title: "URLs Deleted",
      description: `Deleted ${urlIds.length} URL(s)`,
    })
  }

  const rerunAnalysis = (urlIds: string[]) => {
    setUrls((prev) =>
      prev.map((url) => (urlIds.includes(url.id) ? { ...url, status: "queued" as CrawlStatus, data: null } : url)),
    )

    toast({
      title: "Analysis Requeued",
      description: `Requeued ${urlIds.length} URL(s) for analysis`,
    })
  }

  const filteredUrls = urls.filter((url) => {
    const matchesSearch =
      url.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.data?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || url.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: urls.length,
    queued: urls.filter((u) => u.status === "queued").length,
    running: urls.filter((u) => u.status === "running").length,
    completed: urls.filter((u) => u.status === "completed").length,
    error: urls.filter((u) => u.status === "error").length,
    stopped: urls.filter((u) => u.status === "stopped").length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Web Crawler Dashboard</h1>
            <p className="text-muted-foreground">Analyze websites and track crawling progress</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Enter website URL..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addUrl()}
              className="sm:w-80"
            />
            <Button onClick={addUrl} disabled={isLoading || !newUrl.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add URL
            </Button>
            <Button variant="outline" onClick={addDemoUrls} disabled={isLoading}>
              Add Demo URLs
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Card key={status} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{status}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Badge
                    variant={
                      status === "completed"
                        ? "default"
                        : status === "running"
                          ? "secondary"
                          : status === "error"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search URLs or titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CrawlStatus | "all")}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="queued">Queued</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="error">Error</option>
                <option value="stopped">Stopped</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUrls.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedUrls.size}
          onStart={() => startCrawling(Array.from(selectedUrls))}
          onStop={() => stopCrawling(Array.from(selectedUrls))}
          onDelete={() => deleteUrls(Array.from(selectedUrls))}
          onRerun={() => rerunAnalysis(Array.from(selectedUrls))}
        />
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Crawl Results</CardTitle>
          <CardDescription>
            {filteredUrls.length} of {urls.length} URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrawlResultsTable
            results={filteredUrls}
            selectedUrls={selectedUrls}
            onSelectionChange={setSelectedUrls}
            onRowClick={setSelectedResult}
            onStart={(id) => startCrawling([id])}
            onStop={(id) => stopCrawling([id])}
          />
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedResult && (
        <CrawlDetailsModal result={selectedResult} open={!!selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </div>
  )
}
