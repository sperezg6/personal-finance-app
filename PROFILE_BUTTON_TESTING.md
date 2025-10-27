# Profile Button Testing Guide

## Overview
This guide provides instructions for testing the newly implemented profile button component.

## Components Implemented

### 1. Profile Button Component
- **Location**: `/components/profile-button.tsx`
- **Features**:
  - Fixed position in top-right corner (responsive on mobile)
  - Avatar displaying user's initial
  - Dropdown menu with user actions
  - Change name dialog with form

### 2. Server Actions
- **Location**: `/app/actions/profile.ts`
- **Functions**:
  - `updateDisplayName()` - Updates user's display name
  - `updateProfile()` - Updates complete profile information

### 3. Pages
- **Profile Page**: `/app/profile/page.tsx`
  - Displays user information
  - Shows email, names, currency, timezone, member since date
  - Link to settings page

- **Settings Page**: `/app/settings/page.tsx`
  - Form to edit profile information
  - Update display name, full name, currency, timezone

### 4. Settings Form Component
- **Location**: `/components/settings-form.tsx`
- **Features**:
  - Client-side form with validation
  - Real-time error and success feedback
  - Form submission with loading states

## Manual Testing Checklist

### Test 1: Profile Button Visibility
- [ ] Navigate to any authenticated page
- [ ] Verify profile button appears in top-right corner
- [ ] On desktop: button should be at `top-6 right-6`
- [ ] On mobile: button should be at `top-4 right-4`
- [ ] Avatar shows correct initial letter

### Test 2: Dropdown Menu
- [ ] Click on the profile button
- [ ] Dropdown menu should open with 5 items:
  1. User info header (name + email)
  2. View Profile
  3. Settings
  4. Change Name
  5. Log Out
- [ ] Verify menu items are properly styled
- [ ] Hover effects work correctly

### Test 3: View Profile Navigation
- [ ] Click "View Profile" in dropdown
- [ ] Should navigate to `/profile`
- [ ] Verify profile information displays correctly:
  - Email address
  - Display name (or "Not set")
  - Full name (or "Not set")
  - Currency
  - Timezone
  - Member since date
- [ ] "Edit Profile" button should navigate to settings

### Test 4: Settings Navigation
- [ ] Click "Settings" in dropdown
- [ ] Should navigate to `/settings`
- [ ] Form should show current profile values
- [ ] Email field should be disabled
- [ ] All other fields should be editable

### Test 5: Change Name Dialog
- [ ] Click "Change Name" in dropdown
- [ ] Dialog should open with a form
- [ ] Input should show current display name
- [ ] Enter a new name and click "Save Changes"
- [ ] Dialog should close
- [ ] Page should refresh showing new name
- [ ] Test validation: empty name should show error

### Test 6: Settings Form Submission
- [ ] Navigate to `/settings`
- [ ] Modify display name, full name, currency, or timezone
- [ ] Click "Save Changes"
- [ ] Success message should appear
- [ ] Changes should be reflected immediately
- [ ] Navigate to profile page to verify changes

### Test 7: Logout Functionality
- [ ] Click "Log Out" in dropdown
- [ ] Should be redirected to `/login`
- [ ] Should be logged out (no profile button visible)
- [ ] Profile button should not appear on public pages

### Test 8: Responsive Design
- [ ] Test on desktop (>768px width)
  - Profile button at correct position
  - Dropdown menu properly aligned
  - Dialog displays correctly
- [ ] Test on mobile (<768px width)
  - Profile button at correct position
  - Dropdown menu fits screen
  - Dialog responsive

### Test 9: Accessibility
- [ ] Tab navigation should focus on profile button
- [ ] Enter/Space should open dropdown
- [ ] Arrow keys should navigate menu items
- [ ] Escape should close dropdown/dialog
- [ ] Screen reader announces button as "Open user menu"

### Test 10: Loading States
- [ ] Change name dialog shows loading spinner during submission
- [ ] Settings form shows loading spinner during submission
- [ ] Buttons are disabled during loading
- [ ] No double submissions possible

### Test 11: Error Handling
- [ ] Test with invalid data (too long names)
- [ ] Test with network errors (simulate offline)
- [ ] Error messages should display properly
- [ ] Form should remain open on error

## Database Requirements

Ensure your Supabase `profiles` table has these columns:
- `id` (uuid, primary key)
- `email` (text)
- `full_name` (text, nullable)
- `display_name` (text, nullable)
- `avatar_url` (text, nullable)
- `currency` (text, default: 'USD')
- `timezone` (text, default: 'UTC')
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Running the Tests

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Log in with a test user

3. Follow the manual testing checklist above

4. Report any issues or bugs found

## Known Limitations

- Avatar only shows initials (no image upload yet)
- Currency and timezone are text inputs (no dropdowns yet)
- No email verification flow for email changes
- Profile button appears on all pages including login/signup

## Future Enhancements

- Avatar image upload
- Currency dropdown with common currencies
- Timezone picker component
- Email change with verification
- Conditional rendering based on route
- Dark mode toggle in settings
- Notification preferences
- Privacy settings
