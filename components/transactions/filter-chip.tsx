'use client'

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <Badge variant="secondary" className="gap-1.5 pl-3 pr-1.5 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-4 w-4 p-0 hover:bg-transparent ml-1"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  )
}
