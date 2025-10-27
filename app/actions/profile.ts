'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const displayName = formData.get('display_name') as string

  if (!displayName || displayName.trim().length === 0) {
    return { error: 'Display name is required' }
  }

  if (displayName.length > 50) {
    return { error: 'Display name must be 50 characters or less' }
  }

  // Update the profile in the database
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating display name:', error)
    return { error: 'Failed to update display name' }
  }

  // Revalidate all pages to show the updated name
  revalidatePath('/', 'layout')

  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('full_name') as string | null
  const displayName = formData.get('display_name') as string | null
  const currency = formData.get('currency') as string | null
  const timezone = formData.get('timezone') as string | null

  const updates: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  }

  if (fullName !== null) updates.full_name = fullName.trim()
  if (displayName !== null) updates.display_name = displayName.trim()
  if (currency !== null) updates.currency = currency
  if (timezone !== null) updates.timezone = timezone

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile' }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/profile')
  revalidatePath('/settings')

  return { success: true }
}
