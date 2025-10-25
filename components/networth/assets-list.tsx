'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Asset } from "@/types"
import {
  PiggyBank,
  TrendingUp,
  Home,
  Wallet,
  Plus,
  Pencil,
  Trash2
} from "lucide-react"

const iconMap: Record<string, any> = {
  'piggy': PiggyBank,
  'trending': TrendingUp,
  'home': Home,
  'wallet': Wallet,
}

const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Savings Account',
    type: 'savings',
    value: 35000,
    description: 'Emergency fund and general savings',
    icon: 'piggy',
  },
  {
    id: '2',
    name: 'Investment Portfolio',
    type: 'investment',
    value: 45250,
    description: 'Stocks, bonds, and ETFs',
    icon: 'trending',
  },
  {
    id: '3',
    name: 'Real Estate',
    type: 'property',
    value: 32500,
    description: 'Home equity',
    icon: 'home',
  },
  {
    id: '4',
    name: 'Checking Account',
    type: 'savings',
    value: 8500,
    description: 'Day-to-day expenses',
    icon: 'wallet',
  },
  {
    id: '5',
    name: 'Retirement Fund (401k)',
    type: 'investment',
    value: 4500,
    description: 'Employer-matched retirement account',
    icon: 'trending',
  },
]

export function AssetsList() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets)

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)

  const handleDelete = (id: string) => {
    setAssets(assets.filter(a => a.id !== id))
  }

  const handleAddAsset = () => {
    // This would open a dialog/modal in a real implementation
    console.log('Add new asset')
  }

  return (
    <Card className="border-emerald-200 bg-emerald-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <TrendingUp className="h-5 w-5" />
            Assets
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600 text-white font-mono">
              ${totalAssets.toLocaleString()}
            </Badge>
            <Button
              size="sm"
              onClick={handleAddAsset}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assets.map((asset) => {
            const Icon = iconMap[asset.icon]
            return (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{asset.name}</div>
                    <div className="text-sm text-muted-foreground">{asset.description}</div>
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-emerald-100 text-emerald-700 text-xs"
                    >
                      {asset.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600 font-mono">
                      ${asset.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {((asset.value / totalAssets) * 100).toFixed(1)}% of total
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
                      onClick={() => handleDelete(asset.id)}
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
