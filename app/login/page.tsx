import { SignIn } from '@/components/auth/sign-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Personal Finance App',
  description: 'Sign in to access your financial dashboard and manage your money smarter.',
};

export default function LoginPage() {
  return <SignIn />;
}
