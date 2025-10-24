"use client"

import { Home, Receipt, PiggyBank, GraduationCap, DollarSign, TrendingUp } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarWrapper() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Transactions', url: '/transactions', icon: Receipt },
    { name: 'Savings', url: '/savings', icon: PiggyBank },
    { name: 'Budget', url: '/budget', icon: DollarSign },
    { name: 'Loans', url: '/loans', icon: GraduationCap },
    { name: 'Net Worth', url: '/networth', icon: TrendingUp }
  ]

  return <NavBar items={navItems} />
}
