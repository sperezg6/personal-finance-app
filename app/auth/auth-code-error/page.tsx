import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Authentication Error</h1>
          <p className="text-muted-foreground">
            Sorry, we could not authenticate you. Please try signing in again.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white">
              Back to Sign In
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
