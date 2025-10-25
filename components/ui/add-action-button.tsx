'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ButtonHTMLAttributes, ReactNode } from "react"

export type AddActionButtonVariant = 'animated' | 'simple'

export interface AddActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * The text label to display on the button
   * @example "Add Transaction" or "Add Budget"
   */
  label: string

  /**
   * Visual style variant of the button
   * - 'animated': Fancy sliding animation with plus icon (used in transactions)
   * - 'simple': Simple button with icon and text (used in budget)
   * @default 'simple'
   */
  variant?: AddActionButtonVariant

  /**
   * Button size - maps to shadcn Button size prop
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg' | 'icon'

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Click handler - will be called when button is clicked
   * Use this to open dialogs/modals or perform other actions
   */
  onClick?: () => void

  /**
   * Optional icon to use instead of the default Plus icon
   */
  icon?: ReactNode

  /**
   * Whether the button should be disabled
   * @default false
   */
  disabled?: boolean
}

/**
 * Reusable button component for adding items (transactions, budgets, etc.)
 * Supports two visual variants: animated and simple
 *
 * @example
 * // Animated variant (transactions page)
 * <AddActionButton
 *   label="Add Transaction"
 *   variant="animated"
 *   size="lg"
 *   onClick={() => setDialogOpen(true)}
 * />
 *
 * @example
 * // Simple variant (budget page)
 * <AddActionButton
 *   label="Add Budget"
 *   variant="simple"
 *   onClick={() => setDialogOpen(true)}
 * />
 */
export function AddActionButton({
  label,
  variant = 'simple',
  size = 'default',
  className = '',
  onClick,
  icon,
  disabled = false,
  ...rest
}: AddActionButtonProps) {
  const IconComponent = icon || <Plus size={16} strokeWidth={2} aria-hidden="true" />

  if (variant === 'animated') {
    return (
      <Button
        className={`group relative overflow-hidden ${className}`}
        size={size}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
          {label}
        </span>
        <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
          {IconComponent}
        </i>
      </Button>
    )
  }

  // Simple variant (default)
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      className={className}
      {...rest}
    >
      <span className="h-4 w-4 mr-2">
        {IconComponent}
      </span>
      {label}
    </Button>
  )
}
