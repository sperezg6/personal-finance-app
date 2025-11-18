import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/db/queries";
import { ProfileButton } from "@/components/profile-button";
import { Analytics } from "@vercel/analytics/next";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finance Tracker - Manage Your Money",
  description: "Track expenses, manage budgets, monitor savings goals, and take control of your financial future.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profileData = null;
  if (user) {
    const profile = await getUserProfile(user.id);
    if (profile) {
      profileData = {
        id: user.id,
        email: user.email || profile.email,
        displayName: profile.display_name,
        fullName: profile.full_name,
      };
    }
  }

  return (
    <html lang="en">
      <body
        className={`${hankenGrotesk.variable} antialiased`}
      >
        {profileData && <ProfileButton user={profileData} />}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
