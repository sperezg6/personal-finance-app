import { SignUp } from '@/components/auth/sign-up';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Personal Finance App',
  description: 'Create your account and start managing your finances smarter today.',
};

export default function SignUpPage() {
  return <SignUp />;
}
