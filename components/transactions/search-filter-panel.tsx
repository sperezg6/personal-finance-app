'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  DollarSign,
  Tag,
  CreditCard,
  Save,
  ChevronDown
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TransactionFilters, FilterPreset } from "@/types"

interface SearchFilterPanelProps {
  onFilterChange: (filters: TransactionFilters) => void
  onPresetSave?: (preset: FilterPreset) => void
  savedPresets?: FilterPreset[]
}

const categories = [
  'Salary',
  'Freelance',
  'Food',
  'Transport',
  'Rent',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Other'
]

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'PayPal'
]

export function SearchFilterPanel({ onFilterChange, onPresetSave, savedPresets = [] }: SearchFilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])

  const handleFilterUpdate = (newFilters: Partial<TransactionFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(newCategories)
    handleFilterUpdate({ categories: newCategories.length > 0 ? newCategories : undefined })
  }

  const handlePaymentMethodToggle = (method: string) => {
    const newMethods = selectedPaymentMethods.includes(method)
      ? selectedPaymentMethods.filter(m => m !== method)
      : [...selectedPaymentMethods, method]

    setSelectedPaymentMethods(newMethods)
    handleFilterUpdate({ paymentMethods: newMethods.length > 0 ? newMethods : undefined })
  }

  const clearAllFilters = () => {
    setFilters({})
    setSelectedCategories([])
    setSelectedPaymentMethods([])
    setSearchQuery("")
    onFilterChange({})
  }

  const activeFilterCount =
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    (filters.amountMin || filters.amountMax ? 1 : 0) +
    selectedCategories.length +
    selectedPaymentMethods.length +
    (filters.type ? 1 : 0)

  const loadPreset = (preset: FilterPreset) => {
    setFilters(preset.filters)
    setSelectedCategories(preset.filters.categories || [])
    setSelectedPaymentMethods(preset.filters.paymentMethods || [])
    onFilterChange(preset.filters)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search transactions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  className="ml-2 h-5 min-w-5 rounded-full bg-emerald-500 text-white text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {(filters.dateFrom || filters.dateTo) && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {filters.dateFrom && filters.dateTo
                    ? `${filters.dateFrom} - ${filters.dateTo}`
                    : filters.dateFrom
                    ? `From ${filters.dateFrom}`
                    : `Until ${filters.dateTo}`
                  }
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterUpdate({ dateFrom: undefined, dateTo: undefined })}
                  />
                </Badge>
              )}
              {(filters.amountMin || filters.amountMax) && (
                <Badge
                  variant="secondary"
                  className="bg-violet-100 text-violet-700 hover:bg-violet-200"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  {filters.amountMin && filters.amountMax
                    ? `$${filters.amountMin} - $${filters.amountMax}`
                    : filters.amountMin
                    ? `Min $${filters.amountMin}`
                    : `Max $${filters.amountMax}`
                  }
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterUpdate({ amountMin: undefined, amountMax: undefined })}
                  />
                </Badge>
              )}
              {selectedCategories.map(category => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {category}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleCategoryToggle(category)}
                  />
                </Badge>
              ))}
              {selectedPaymentMethods.map(method => (
                <Badge
                  key={method}
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  {method}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handlePaymentMethodToggle(method)}
                  />
                </Badge>
              ))}
              {filters.type && (
                <Badge
                  variant="secondary"
                  className={filters.type === 'income'
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                  }
                >
                  {filters.type === 'income' ? 'Income' : 'Expense'}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleFilterUpdate({ type: undefined })}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Saved Presets */}
            {savedPresets.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Saved Filters</label>
                <div className="flex flex-wrap gap-2">
                  {savedPresets.map(preset => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="date"
                      placeholder="From"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterUpdate({ dateFrom: e.target.value || undefined })}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="To"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleFilterUpdate({ dateTo: e.target.value || undefined })}
                    />
                  </div>
                </div>
              </div>

              {/* Amount Range */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-violet-500" />
                  Amount Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.amountMin || ''}
                    onChange={(e) => handleFilterUpdate({
                      amountMin: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.amountMax || ''}
                    onChange={(e) => handleFilterUpdate({
                      amountMax: e.target.value ? Number(e.target.value) : undefined
                    })}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-500" />
                  Categories
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : 'hover:bg-emerald-50'
                      }`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-orange-500" />
                  Payment Methods
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                  {paymentMethods.map(method => (
                    <Badge
                      key={method}
                      variant={selectedPaymentMethods.includes(method) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedPaymentMethods.includes(method)
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'hover:bg-orange-50'
                      }`}
                      onClick={() => handlePaymentMethodToggle(method)}
                    >
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Transaction Type</label>
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => handleFilterUpdate({
                  type: value === 'all' ? undefined : value as 'income' | 'expense'
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expense Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Save Preset Button */}
            {onPresetSave && activeFilterCount > 0 && (
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    const presetName = prompt('Enter a name for this filter preset:')
                    if (presetName) {
                      onPresetSave({
                        id: Date.now().toString(),
                        name: presetName,
                        filters
                      })
                    }
                  }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Preset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
