# Supabase Authentication - Quick Start Guide

## 5-Minute Setup

Follow these steps to get authentication working in your app.

### Step 1: Create a Supabase Project (2 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create account)
4. Click "New Project"
5. Fill in:
   - **Name**: personal-finance-app (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait 1-2 minutes for provisioning

### Step 2: Get Your API Keys (1 minute)

1. In your new project dashboard
2. Click the Settings icon (⚙️) in the sidebar
3. Click "API" under Project Settings
4. Copy these two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### Step 3: Configure Your App (1 minute)

1. Open `.env.local` in your project root
2. Replace the values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

### Step 4: Start Your App (1 minute)

```bash
npm run dev
```

### Step 5: Test It! (30 seconds)

1. Go to `http://localhost:3000/signup`
2. Create an account with your email
3. Check your email for confirmation (if enabled)
4. Go to `http://localhost:3000/login`
5. Sign in with your credentials
6. You're in!

---

## What's Working Now

- Email/password authentication
- Sign up and sign in pages
- Forgot password functionality
- Protected routes (budget, loans, etc.)
- Session management
- Automatic redirects

---

## Optional: Enable Google Sign-In

If you want "Sign in with Google" to work:

### 1. Enable Google Provider in Supabase

1. In Supabase dashboard → **Authentication** → **Providers**
2. Click **Google**
3. Enable it (toggle switch)

### 2. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Choose **Web application**
6. Add Authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   (Replace `your-project-ref` with your actual Supabase project ref)
7. Copy **Client ID** and **Client Secret**

### 3. Add to Supabase

1. Back in Supabase → **Authentication** → **Providers** → **Google**
2. Paste **Client ID**
3. Paste **Client Secret**
4. Click **Save**

Now the "Sign in with Google" button will work!

---

## Troubleshooting

### "Invalid API key"
- Check `.env.local` has correct values
- Restart dev server (`npm run dev`)

### Email not sending
- Check spam folder
- Or disable email confirmation in Supabase (Auth → Settings)

### Can't access protected pages
- Make sure you're signed in
- Clear browser cookies and try again

---

## What's Next?

Read the full guide: [SUPABASE_AUTH_GUIDE.md](/Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2/SUPABASE_AUTH_GUIDE.md)

Learn about:
- Customizing email templates
- Adding user profiles
- Securing your database
- Advanced features

---

## Need Help?

- Full documentation: `SUPABASE_AUTH_GUIDE.md`
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Issues? Check the troubleshooting section in the full guide

---

**You're ready to go!** Your authentication system is fully functional.
