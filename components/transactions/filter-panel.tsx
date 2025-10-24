'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionFilters, TransactionType } from "@/types"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
  onClose: () => void
  categories: string[]
  paymentMethods: string[]
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
  categories,
  paymentMethods
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const emptyFilters: TransactionFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const updateFilter = (key: keyof TransactionFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (category: string) => {
    const current = localFilters.categories || []
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    updateFilter('categories', updated.length > 0 ? updated : undefined)
  }

  const togglePaymentMethod = (method: string) => {
    const current = localFilters.paymentMethods || []
    const updated = current.includes(method)
      ? current.filter(m => m !== method)
      : [...current, method]
    updateFilter('paymentMethods', updated.length > 0 ? updated : undefined)
  }

  return (
    <Card className="absolute right-0 top-full mt-2 w-96 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Advanced Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Amount Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Min</Label>
              <Input
                type="number"
                placeholder="0"
                value={localFilters.amountMin || ''}
                onChange={(e) => updateFilter('amountMin', e.target.value ? Number(e.target.value) : undefined)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max</Label>
              <Input
                type="number"
                placeholder="No limit"
                value={localFilters.amountMax || ''}
                onChange={(e) => updateFilter('amountMax', e.target.value ? Number(e.target.value) : undefined)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Transaction Type</Label>
          <Select
            value={localFilters.type || 'all'}
            onValueChange={(value) => updateFilter('type', value === 'all' ? undefined : value as TransactionType)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const isSelected = localFilters.categories?.includes(category)
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="h-7 text-xs"
                >
                  {category}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Payment Methods</Label>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map(method => {
              const isSelected = localFilters.paymentMethods?.includes(method)
              return (
                <Button
                  key={method}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePaymentMethod(method)}
                  className="h-7 text-xs"
                >
                  {method}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
