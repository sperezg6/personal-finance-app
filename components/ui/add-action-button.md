# AddActionButton Component

A reusable, accessible button component designed for adding items across the application (transactions, budgets, expenses, etc.). The component supports two visual variants to match different UI contexts.

## Features

- Two visual variants: `animated` and `simple`
- Fully typed with TypeScript
- Accessible with proper ARIA attributes
- Customizable with props and className
- Consistent with existing design system
- Easy to extend for new use cases

## Usage

### Basic Examples

#### Animated Variant (Transactions Page)
```tsx
import { AddActionButton } from '@/components/ui/add-action-button'

function TransactionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AddActionButton
      label="Add Transaction"
      variant="animated"
      size="lg"
      onClick={() => setDialogOpen(true)}
    />
  )
}
```

#### Simple Variant (Budget Page)
```tsx
import { AddActionButton } from '@/components/ui/add-action-button'

function BudgetPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AddActionButton
      label="Add Budget"
      variant="simple"
      onClick={() => setDialogOpen(true)}
    />
  )
}
```

### Specialized Components

The application provides specialized components that wrap `AddActionButton` for specific contexts:

#### AddTransactionButton
```tsx
import { AddTransactionButton } from '@/components/ui/add-transaction-button'

<AddTransactionButton onClick={() => openTransactionDialog()} />
```

#### AddBudgetButton
```tsx
import { AddBudgetButton } from '@/components/budget/add-budget-button'

<AddBudgetButton onClick={() => openBudgetDialog()} />
```

### Creating New Specialized Buttons

To create a new specialized button for other pages (e.g., savings, loans):

```tsx
'use client'

import { AddActionButton, AddActionButtonProps } from "@/components/ui/add-action-button"

export interface AddSavingsButtonProps extends Omit<AddActionButtonProps, 'label' | 'variant'> {
  onClick?: () => void
}

export function AddSavingsButton({ onClick, ...props }: AddSavingsButtonProps) {
  return (
    <AddActionButton
      label="Add Savings Goal"
      variant="simple" // or "animated" based on your preference
      onClick={onClick}
      {...props}
    />
  )
}
```

## API Reference

### AddActionButtonProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | The text label to display on the button |
| `variant` | `'animated' \| 'simple'` | `'simple'` | Visual style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `onClick` | `() => void` | `undefined` | Click handler function |
| `className` | `string` | `''` | Additional CSS classes |
| `icon` | `ReactNode` | `<Plus />` | Custom icon component |
| `disabled` | `boolean` | `false` | Whether button is disabled |

### Variants

#### Animated
- Fancy sliding animation effect
- Plus icon animates on hover
- Best for primary CTAs or high-emphasis actions
- Used in: Transactions page

**Visual behavior:**
- Default: Text visible, icon in corner
- Hover: Text fades out, icon expands
- Active: Slight scale effect

#### Simple
- Clean, straightforward design
- Icon and text side by side
- Best for secondary actions or cleaner layouts
- Used in: Budget page

**Visual behavior:**
- Consistent appearance
- Standard button hover states
- No complex animations

## Design Decisions

1. **Two Variants**: Provides flexibility while maintaining consistency
2. **Specialized Wrappers**: Makes code more semantic and easier to maintain
3. **TypeScript First**: Full type safety and IntelliSense support
4. **Accessibility**: Proper ARIA labels and keyboard support
5. **Customizable**: Accepts all standard button props for flexibility

## Integration with Dialogs/Modals

The button is designed to work with dialogs and modals. When the UI designer provides the dialog designs:

```tsx
import { AddActionButton } from '@/components/ui/add-action-button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AddActionButton
          label="Add Transaction"
          variant="animated"
          size="lg"
        />
      </DialogTrigger>
      <DialogContent>
        {/* Form content will go here */}
      </DialogContent>
    </Dialog>
  )
}
```

## Testing

The component should be tested for:
- Renders correctly in both variants
- Click handlers are called
- Accessibility attributes are present
- Keyboard navigation works
- Disabled state works correctly
- Custom props are passed through

## Next Steps

1. Wait for UI designer to provide form/dialog designs
2. Implement dialog/modal components
3. Connect buttons to actual form functionality
4. Add form validation and submission logic
