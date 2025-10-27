'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { updateProfile } from '@/app/actions/profile'

interface SettingsFormProps {
  profile: {
    id: string
    email: string
    full_name: string | null
    display_name: string | null
    currency: string
    timezone: string
  }
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateProfile(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        router.refresh()
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                name="display_name"
                type="text"
                placeholder="Enter your display name"
                defaultValue={profile.display_name || ''}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                This is how your name will appear in the app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Enter your full name"
                defaultValue={profile.full_name || ''}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                type="text"
                placeholder="USD"
                defaultValue={profile.currency}
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">
                Your preferred currency (e.g., USD, EUR, GBP)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                name="timezone"
                type="text"
                placeholder="America/New_York"
                defaultValue={profile.timezone}
              />
              <p className="text-xs text-muted-foreground">
                Your timezone (e.g., America/New_York, Europe/London)
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 dark:bg-green-950/20 p-3 text-sm text-green-700 dark:text-green-400">
              Profile updated successfully!
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/profile')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
