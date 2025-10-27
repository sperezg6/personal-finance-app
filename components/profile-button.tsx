'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, Settings, LogOut, UserCircle, Loader2 } from 'lucide-react'
import { signOut } from '@/lib/auth/actions'
import { updateDisplayName } from '@/app/actions/profile'

interface ProfileButtonProps {
  user: {
    id: string
    email: string
    displayName?: string | null
    fullName?: string | null
  }
}

export function ProfileButton({ user }: ProfileButtonProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isChangeNameOpen, setIsChangeNameOpen] = React.useState(false)
  const [displayName, setDisplayName] = React.useState(user.displayName || user.fullName || '')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Get the first letter for the avatar
  const getInitial = () => {
    if (user.displayName) return user.displayName.charAt(0).toUpperCase()
    if (user.fullName) return user.fullName.charAt(0).toUpperCase()
    return user.email.charAt(0).toUpperCase()
  }

  // Get display text
  const getDisplayText = () => {
    return user.displayName || user.fullName || user.email.split('@')[0]
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateDisplayName(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        setIsChangeNameOpen(false)
        // Refresh the page to show updated name
        router.refresh()
      }
    } catch (err) {
      setError('Failed to update name. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 5000) // Shorter delay for snappier close
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="fixed top-4 right-4 md:top-6 md:right-6 z-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
            aria-label="Open user menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Avatar className="size-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                {getInitial()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          sideOffset={0}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getDisplayText()}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push('/profile')}
            className="cursor-pointer"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push('/settings')}
            className="cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsChangeNameOpen(true)}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Change Name</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isChangeNameOpen} onOpenChange={setIsChangeNameOpen}>
        <DialogContent>
          <form onSubmit={handleUpdateName}>
            <DialogHeader>
              <DialogTitle>Change Display Name</DialogTitle>
              <DialogDescription>
                Update how your name appears throughout the app. This will be used in place of your email address.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  type="text"
                  placeholder="Enter your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  maxLength={50}
                  className="w-full"
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChangeNameOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
