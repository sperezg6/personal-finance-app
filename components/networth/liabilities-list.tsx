'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Liability } from "@/types"
import {
  CreditCard,
  GraduationCap,
  Home,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  TrendingDown
} from "lucide-react"

const iconMap: Record<string, any> = {
  'credit': CreditCard,
  'graduation': GraduationCap,
  'home': Home,
  'dollar': DollarSign,
}

const initialLiabilities: Liability[] = [
  {
    id: '1',
    name: 'Student Loan',
    type: 'loan',
    value: 25000,
    interestRate: 4.5,
    description: 'Federal student loans',
    icon: 'graduation',
  },
  {
    id: '2',
    name: 'Credit Card Balance',
    type: 'credit-card',
    value: 3200,
    interestRate: 18.9,
    description: 'Chase Sapphire',
    icon: 'credit',
  },
  {
    id: '3',
    name: 'Car Loan',
    type: 'loan',
    value: 12100,
    interestRate: 3.2,
    description: '2023 Honda Civic',
    icon: 'dollar',
  },
  {
    id: '4',
    name: 'Personal Loan',
    type: 'loan',
    value: 2000,
    interestRate: 7.8,
    description: 'Home improvement',
    icon: 'home',
  },
]

export function LiabilitiesList() {
  const [liabilities, setLiabilities] = useState<Liability[]>(initialLiabilities)

  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0)

  const handleDelete = (id: string) => {
    setLiabilities(liabilities.filter(l => l.id !== id))
  }

  const handleAddLiability = () => {
    // This would open a dialog/modal in a real implementation
    console.log('Add new liability')
  }

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <TrendingDown className="h-5 w-5" />
            Liabilities
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-600 text-white font-mono">
              ${totalLiabilities.toLocaleString()}
            </Badge>
            <Button
              size="sm"
              onClick={handleAddLiability}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {liabilities.map((liability) => {
            const Icon = iconMap[liability.icon]
            return (
              <div
                key={liability.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Icon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{liability.name}</div>
                    <div className="text-sm text-muted-foreground">{liability.description}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-700 text-xs"
                      >
                        {liability.type}
                      </Badge>
                      {liability.interestRate && (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 text-xs font-mono"
                        >
                          {liability.interestRate}% APR
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-600 font-mono">
                      ${liability.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {((liability.value / totalLiabilities) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(liability.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
