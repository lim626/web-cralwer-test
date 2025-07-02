"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, AlertTriangle } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { CrawlResult } from "@/types/crawler"

interface CrawlDetailsModalProps {
  result: CrawlResult
  open: boolean
  onClose: () => void
}

export function CrawlDetailsModal({ result, open, onClose }: CrawlDetailsModalProps) {
  if (!result.data) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crawl Details</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data available for this URL yet.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const { data } = result

  // Prepare chart data
  const linkData = [
    { name: "Internal Links", value: data.internalLinks, color: "#8884d8" },
    { name: "External Links", value: data.externalLinks, color: "#82ca9d" },
  ]

  const headingData = Object.entries(data.headingCounts)
    .filter(([_, count]) => count > 0)
    .map(([level, count]) => ({
      level: level.toUpperCase(),
      count,
    }))

  const getStatusBadge = (status: string) => {
    const variants = {
      queued: "outline",
      running: "secondary",
      completed: "default",
      error: "destructive",
      stopped: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Crawl Details
            {getStatusBadge(result.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm break-all">{result.url}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Page Title</label>
                  <p className="mt-1 font-medium">{data.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">HTML Version</label>
                  <p className="mt-1">{data.htmlVersion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Login Form Present</label>
                  <p className="mt-1">
                    {data.hasLoginForm ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Links Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Links Distribution</CardTitle>
                <CardDescription>Internal vs External links breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={linkData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {linkData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{data.internalLinks}</p>
                    <p className="text-sm text-muted-foreground">Internal Links</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{data.externalLinks}</p>
                    <p className="text-sm text-muted-foreground">External Links</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Heading Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Heading Structure</CardTitle>
                <CardDescription>Distribution of heading tags (H1-H6)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={headingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Broken Links */}
          {data.brokenLinks && data.brokenLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Broken Links ({data.brokenLinks.length})
                </CardTitle>
                <CardDescription>Links that returned 4xx or 5xx status codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.brokenLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-mono text-sm break-all">{link.url}</span>
                      <Badge variant="destructive">{link.statusCode}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(result.createdAt).toLocaleString()}</span>
                </div>
                {result.startedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{new Date(result.startedAt).toLocaleString()}</span>
                  </div>
                )}
                {result.completedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span>{new Date(result.completedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
