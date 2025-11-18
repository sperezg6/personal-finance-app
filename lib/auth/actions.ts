'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation: minimum 12 characters, at least one uppercase, one lowercase, one number
const PASSWORD_MIN_LENGTH = 12
function isValidPassword(password: string): boolean {
  if (password.length < PASSWORD_MIN_LENGTH) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

// Sanitize input by trimming and limiting length
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 255)
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient()

  const rawEmail = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate inputs
  if (!rawEmail || !password) {
    return { error: 'Email and password are required' }
  }

  const email = sanitizeEmail(rawEmail)

  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Invalid email format' }
  }

  if (password.length === 0) {
    return { error: 'Password is required' }
  }

  const data = { email, password }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Return generic error to prevent user enumeration
    return { error: 'Invalid email or password' }
  }

  revalidatePath('/', 'layout')
  redirect('/home')
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient()

  const rawEmail = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate inputs
  if (!rawEmail || !password) {
    return { error: 'Email and password are required' }
  }

  const email = sanitizeEmail(rawEmail)

  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Invalid email format' }
  }

  if (!isValidPassword(password)) {
    return { error: 'Password must be at least 12 characters long and contain uppercase, lowercase, and numbers' }
  }

  const data = { email, password }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const rawEmail = formData.get('email') as string

  // Validate input
  if (!rawEmail) {
    return { error: 'Email is required' }
  }

  const email = sanitizeEmail(rawEmail)

  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Invalid email format' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    // Return generic message to prevent user enumeration
    return { success: true }
  }

  return { success: true }
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
