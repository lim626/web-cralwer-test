"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Trash2, RefreshCw } from "lucide-react"

interface BulkActionsBarProps {
  selectedCount: number
  onStart: () => void
  onStop: () => void
  onDelete: () => void
  onRerun: () => void
}

export function BulkActionsBar({ selectedCount, onStart, onStop, onDelete, onRerun }: BulkActionsBarProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {selectedCount} URL{selectedCount !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={onStart}>
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button size="sm" variant="outline" onClick={onStop}>
              <Pause className="w-4 h-4 mr-2" />
              Stop
            </Button>
            <Button size="sm" variant="outline" onClick={onRerun}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-run
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
