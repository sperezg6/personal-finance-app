/**
 * Student Loan Data Types
 *
 * This file contains all TypeScript interfaces and types used throughout
 * the student loan tracking feature of the personal finance app.
 */

import { LucideIcon } from "lucide-react"

/**
 * Loan Type
 * Federal loans typically have better terms and protection
 * Private loans may have higher interest rates
 */
export type LoanType = 'federal' | 'private'

/**
 * Loan Status
 * Determines the visual styling and tracking state
 * - on-track: Making payments as scheduled (Green)
 * - behind: Missed or late payments (Red)
 * - paid-off: Loan fully repaid (Indigo)
 */
export type LoanStatus = 'on-track' | 'behind' | 'paid-off'

/**
 * Individual Student Loan
 * Represents a single student loan with all tracking information
 */
export interface Loan {
  /** Unique identifier for the loan */
  id: string

  /** Display name for the loan (e.g., "Federal Subsidized") */
  name: string

  /** Loan servicer company (e.g., "Great Lakes", "Nelnet") */
  servicer: string

  /** Type of loan - federal or private */
  type: LoanType

  /** Current payment status */
  status: LoanStatus

  /** Original loan amount when borrowed */
  originalAmount: number

  /** Current outstanding balance */
  currentBalance: number

  /** Annual interest rate as a percentage */
  interestRate: number

  /** Required monthly payment amount */
  monthlyPayment: number

  /** Next scheduled payment date (ISO format) */
  nextPaymentDate: string

  /** Icon component to display for this loan */
  icon: LucideIcon
}

/**
 * Loan Summary Metrics
 * Aggregated data shown in the summary cards
 */
export interface LoanSummaryMetrics {
  /** Total debt across all loans */
  totalDebt: number

  /** Total monthly payment required */
  totalMonthlyPayment: number

  /** Total interest paid year-to-date */
  interestPaidYTD: number

  /** Estimated payoff date */
  estimatedPayoffDate: string

  /** Years until debt-free */
  yearsUntilPayoff: number
}

/**
 * Payoff Progress Goal
 * Tracks specific milestones in the debt repayment journey
 */
export interface PayoffGoal {
  /** Goal title */
  title: string

  /** Goal description */
  description: string

  /** Current progress value */
  currentValue: number

  /** Target goal value */
  goalValue: number

  /** Icon component for this goal */
  icon: LucideIcon

  /** Display color for this goal (CSS color value) */
  color: string

  /** Unit to display (e.g., "$", "", "%") */
  unit: string
}

/**
 * Status Configuration
 * Visual styling configuration for each loan status
 */
export interface StatusConfig {
  /** Display label */
  label: string

  /** Main color (RGB value) */
  color: string

  /** Background color class */
  bgColor: string

  /** Text color class */
  textColor: string

  /** Progress bar color class */
  progressColor: string

  /** Progress track color class */
  trackColor: string
}

/**
 * Color Scheme Reference
 *
 * Status Colors:
 * - On Track: Emerald (rgb(16 185 129)) - Success, positive progress
 * - Behind: Red (rgb(239 68 68)) - Alert, requires attention
 * - Paid Off: Indigo (rgb(99 102 241)) - Achievement, completed
 *
 * Summary Card Colors:
 * - Total Debt: Red (rgb(239 68 68)) - Primary metric
 * - Monthly Payment: Orange (rgb(249 115 22)) - Action required
 * - Interest Paid: Violet (rgb(139 92 246)) - Cost tracking
 * - Payoff Date: Blue (rgb(59 130 246)) - Future goal
 *
 * Goal Colors:
 * - Total Paid: Yellow (rgb(234 179 8)) - Achievement
 * - On-Time Payments: Emerald (rgb(16 185 129)) - Consistency
 * - Extra Payments: Violet (rgb(139 92 246)) - Bonus progress
 */
