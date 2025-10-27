import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/db/queries'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, Globe, DollarSign } from 'lucide-react'

export const metadata = {
  title: 'Profile - Personal Finance App',
  description: 'View and manage your profile information',
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect('/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your personal information
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <p className="text-base font-medium">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Display Name</Label>
                  <p className="text-base font-medium">
                    {profile.display_name || 'Not set'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="text-base font-medium">
                    {profile.full_name || 'Not set'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Currency
                  </Label>
                  <p className="text-base font-medium">{profile.currency}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Timezone
                  </Label>
                  <p className="text-base font-medium">{profile.timezone}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </Label>
                  <p className="text-base font-medium">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href="/settings">
                  <Button>Edit Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Additional account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">User ID</Label>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {user.id}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Last Updated</Label>
                <p className="text-base">{formatDate(profile.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
