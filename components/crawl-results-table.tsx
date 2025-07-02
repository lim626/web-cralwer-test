"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Pause, Eye, ArrowUpDown } from "lucide-react"
import type { CrawlResult } from "@/types/crawler"

interface CrawlResultsTableProps {
  results: CrawlResult[]
  selectedUrls: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  onRowClick: (result: CrawlResult) => void
  onStart: (id: string) => void
  onStop: (id: string) => void
}

type SortField = "url" | "status" | "title" | "createdAt" | "internalLinks" | "externalLinks"
type SortDirection = "asc" | "desc"

export function CrawlResultsTable({
  results,
  selectedUrls,
  onSelectionChange,
  onRowClick,
  onStart,
  onStop,
}: CrawlResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortField) {
      case "url":
        aValue = a.url
        bValue = b.url
        break
      case "status":
        aValue = a.status
        bValue = b.status
        break
      case "title":
        aValue = a.data?.title || ""
        bValue = b.data?.title || ""
        break
      case "createdAt":
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case "internalLinks":
        aValue = a.data?.internalLinks || 0
        bValue = b.data?.internalLinks || 0
        break
      case "externalLinks":
        aValue = a.data?.externalLinks || 0
        bValue = b.data?.externalLinks || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const paginatedResults = sortedResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(sortedResults.length / itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(results.map((r) => r.id)))
    } else {
      onSelectionChange(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedUrls)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    onSelectionChange(newSelected)
  }

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

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer hover:bg-accent/50 select-none" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="w-4 h-4" />
      </div>
    </TableHead>
  )

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUrls.size === results.length && results.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <SortableHeader field="url">URL</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="title">Title</SortableHeader>
              <TableHead>HTML Version</TableHead>
              <SortableHeader field="internalLinks">Internal Links</SortableHeader>
              <SortableHeader field="externalLinks">External Links</SortableHeader>
              <TableHead>Broken Links</TableHead>
              <TableHead>Login Form</TableHead>
              <SortableHeader field="createdAt">Created</SortableHeader>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResults.map((result) => (
              <TableRow
                key={result.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => onRowClick(result)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedUrls.has(result.id)}
                    onCheckedChange={(checked) => handleSelectRow(result.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium max-w-xs truncate">{result.url}</TableCell>
                <TableCell>{getStatusBadge(result.status)}</TableCell>
                <TableCell className="max-w-xs truncate">{result.data?.title || "-"}</TableCell>
                <TableCell>{result.data?.htmlVersion || "-"}</TableCell>
                <TableCell>{result.data?.internalLinks || "-"}</TableCell>
                <TableCell>{result.data?.externalLinks || "-"}</TableCell>
                <TableCell>{result.data?.brokenLinks?.length || 0}</TableCell>
                <TableCell>{result.data?.hasLoginForm ? "✓" : result.data ? "✗" : "-"}</TableCell>
                <TableCell>{new Date(result.createdAt).toLocaleDateString()}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1">
                    {result.status === "queued" || result.status === "stopped" ? (
                      <Button size="sm" variant="outline" onClick={() => onStart(result.id)}>
                        <Play className="w-3 h-3" />
                      </Button>
                    ) : result.status === "running" ? (
                      <Button size="sm" variant="outline" onClick={() => onStop(result.id)}>
                        <Pause className="w-3 h-3" />
                      </Button>
                    ) : null}
                    <Button size="sm" variant="outline" onClick={() => onRowClick(result)}>
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedResults.length)} of {sortedResults.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
