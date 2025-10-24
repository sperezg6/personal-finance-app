'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AddBudgetButton() {
  const handleAddBudget = () => {
    // This would open a dialog/modal in a real implementation
    console.log('Add new budget category')
  }

  return (
    <Button onClick={handleAddBudget}>
      <Plus className="h-4 w-4 mr-2" />
      Add Budget
    </Button>
  )
}
