# Personal Finance App V2 - Setup Guide

## What Was Created

A new Next.js 15 application with TypeScript, Tailwind CSS v4, and shadcn/ui components, featuring a custom tubelight navbar component.

### Key Features:
- Next.js 15.5.6 with App Router
- TypeScript for type safety
- Tailwind CSS v4 (new CSS-based configuration)
- shadcn/ui component architecture
- Custom tubelight navbar with Framer Motion animations
- Lucide React icons
- Responsive design with mobile-first approach

## Project Structure

```
personal-finance-app-v2/
├── app/
│   ├── globals.css          # Global styles with shadcn theme variables
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home page
├── components/
│   ├── ui/
│   │   └── tubelight-navbar.tsx  # Tubelight navbar component
│   └── navbar-wrapper.tsx    # Client component wrapper for navbar
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
├── components.json           # shadcn/ui configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Installed Dependencies

### Production Dependencies:
- **next**: 15.5.6 - React framework
- **react**: 19.1.0 - UI library
- **react-dom**: 19.1.0 - React DOM renderer
- **lucide-react**: 0.546.0 - Icon library
- **framer-motion**: 12.23.24 - Animation library
- **clsx**: 2.1.1 - Utility for constructing className strings
- **tailwind-merge**: 3.3.1 - Merge Tailwind CSS classes

### Dev Dependencies:
- **typescript**: 5.x - Type safety
- **tailwindcss**: 4.x - Utility-first CSS framework
- **@tailwindcss/postcss**: 4.x - PostCSS plugin
- **eslint**: 9.x - Code linting
- **eslint-config-next**: 15.5.6 - Next.js ESLint configuration

## How to Run

### Development Server

```bash
cd /Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Lint Code

```bash
npm run lint
```

## Component Usage

### Using the Tubelight Navbar

The navbar is already integrated in the home page via the `NavBarWrapper` component. To customize it:

1. Edit `/Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2/components/navbar-wrapper.tsx`
2. Modify the `navItems` array with your menu items
3. Import icons from `lucide-react`

Example:

```tsx
import { Home, User, Briefcase, FileText } from 'lucide-react'

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'About', url: '/about', icon: User },
  { name: 'Projects', url: '/projects', icon: Briefcase },
  { name: 'Resume', url: '/resume', icon: FileText }
]
```

## Theme Customization

The app uses shadcn/ui theme variables defined in `/Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2/app/globals.css`

- Automatic dark mode support based on system preferences
- Customizable color palette using CSS variables
- HSL color values for better color manipulation

## Adding More shadcn/ui Components

To add additional shadcn/ui components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Components will be added to `/Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2/components/ui/`

## Additional Setup Steps

### Optional: Configure Turbopack Root (to silence warning)

Edit `next.config.ts` and add:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: '/Users/santiago.perez.gutierrez/Desktop/personal-finance-app-v2'
  }
}

export default nextConfig
```

### Git Repository

The project has been initialized as a Git repository. To make your first commit:

```bash
git add .
git commit -m "Initial commit: Next.js app with tubelight navbar"
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

Build output shows optimal bundle sizes:
- Main page: ~49.5 kB
- First Load JS: ~164 kB (including shared chunks)
- All pages are statically pre-rendered for best performance

## Next Steps

1. Customize the navbar items in `navbar-wrapper.tsx`
2. Create additional pages in the `app/` directory
3. Add more shadcn/ui components as needed
4. Implement your finance app features
5. Configure environment variables if needed
6. Set up database connection (if required)

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- -p 3001
```

### Clear Build Cache
If you encounter build issues:

```bash
rm -rf .next
npm run build
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
