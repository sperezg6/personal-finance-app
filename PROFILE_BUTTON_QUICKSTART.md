# Profile Button - Quick Start Guide

## What Was Implemented

A complete profile management system with:
- Profile button with avatar (top-right corner)
- Dropdown menu with user actions
- Profile viewing page
- Settings page for editing profile
- Change name dialog
- Logout functionality

## Files Created

```
/components/profile-button.tsx          # Main profile button component
/components/settings-form.tsx           # Settings form component
/app/actions/profile.ts                 # Server actions for profile updates
/app/profile/page.tsx                   # Profile view page
/app/settings/page.tsx                  # Settings edit page
```

## Files Modified

```
/app/layout.tsx                         # Added ProfileButton integration
```

## How It Works

### 1. Profile Button (All Pages)
- Fixed position: top-right corner
- Shows user's initial in avatar
- Appears only when user is logged in

### 2. Dropdown Menu
Click the profile button to access:
- **View Profile** → See your profile details
- **Settings** → Edit your profile
- **Change Name** → Quick name update dialog
- **Log Out** → Sign out of the app

### 3. Profile Page (`/profile`)
Displays:
- Email address
- Display name
- Full name
- Currency preference
- Timezone
- Member since date

### 4. Settings Page (`/settings`)
Edit:
- Display name
- Full name
- Currency
- Timezone

## Quick Test

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Log in** with a test user

3. **Look for the profile button** in the top-right corner

4. **Click it** and try each menu option:
   - View Profile
   - Settings
   - Change Name
   - Log Out

## Component Props

### ProfileButton
```typescript
<ProfileButton
  user={{
    id: string
    email: string
    displayName?: string | null
    fullName?: string | null
  }}
/>
```

## Server Actions

### Update Display Name
```typescript
import { updateDisplayName } from '@/app/actions/profile'

const formData = new FormData()
formData.append('display_name', 'John Doe')
const result = await updateDisplayName(formData)
```

### Update Full Profile
```typescript
import { updateProfile } from '@/app/actions/profile'

const formData = new FormData()
formData.append('display_name', 'John Doe')
formData.append('full_name', 'John Michael Doe')
formData.append('currency', 'USD')
formData.append('timezone', 'America/New_York')
const result = await updateProfile(formData)
```

## Styling

Uses the existing design system:
- Shadcn UI components (new-york style)
- Tailwind CSS for styling
- Responsive design (mobile-first)
- Accessible (WCAG 2.1 AA compliant)

## Responsive Breakpoints

- **Mobile**: `top-4 right-4` (screens < 768px)
- **Desktop**: `top-6 right-6` (screens ≥ 768px)

## Database Requirements

The `profiles` table must have these columns:
- `id` (uuid)
- `email` (text)
- `display_name` (text, nullable)
- `full_name` (text, nullable)
- `currency` (text)
- `timezone` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Common Issues

### Button not showing
- User must be logged in
- Check if `getUserProfile()` returns data

### Changes not saving
- Check Supabase connection
- Verify database permissions
- Check browser console for errors

### Dropdown not opening
- Check z-index conflicts
- Verify Radix UI is installed

## Next Steps

1. **Test the implementation:**
   ```bash
   npm run dev
   ```

2. **Review the testing guide:**
   See `PROFILE_BUTTON_TESTING.md` for detailed tests

3. **Read the full documentation:**
   See `PROFILE_BUTTON_IMPLEMENTATION.md` for details

## Key Features

- ✅ Responsive design (mobile + desktop)
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation
- ✅ Real-time updates
- ✅ TypeScript strict mode
- ✅ Server-side validation
- ✅ Authentication required

## Support

For detailed information, see:
- **Testing Guide**: `PROFILE_BUTTON_TESTING.md`
- **Implementation Details**: `PROFILE_BUTTON_IMPLEMENTATION.md`
- **Component Source**: `/components/profile-button.tsx`
