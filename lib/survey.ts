export type Option = { value: string; label: string; description?: string }

export const categoryOptions: Option[] = [
  {
    value: 'solo',
    label: 'Solo freelancer',
    description: 'Dev, designer, writer, marketer billing foreign clients',
  },
  {
    value: 'agency',
    label: 'Agency / studio',
    description: 'Small team with recurring foreign invoices',
  },
  {
    value: 'ca',
    label: 'CA / accountant',
    description: 'I handle compliance for cross-border freelance clients',
  },
]

export const earningsOptions: Option[] = [
  { value: 'under_1k', label: 'Under $1k' },
  { value: '1.5k_3k', label: '$1.5k–$3k' },
  { value: '3k_5k', label: '$3k–$5k' },
  { value: '5k_plus', label: '$5k+' },
]

export const foreignShareOptions: Option[] = [
  { value: 'under_25', label: 'Under 25%' },
  { value: '25_50', label: '25–50%' },
  { value: '50_75', label: '50–75%' },
  { value: '75_100', label: '75–100%' },
]

export const railsOptions: Option[] = [
  { value: 'wise', label: 'Wise' },
  { value: 'payoneer', label: 'Payoneer' },
  { value: 'skydo', label: 'Skydo' },
  { value: 'bank', label: 'Bank transfer' },
  { value: 'other', label: 'Other' },
]

export const painPointOptions: Option[] = [
  { value: 'tax_notice', label: 'Received a tax notice' },
  { value: 'lut_missed', label: 'LUT deadline missed or nearly missed' },
  { value: 'fira_late', label: "Couldn't get FIRA/FIRC in time" },
  { value: 'account_freeze', label: 'Account freeze or scare' },
  { value: 'none', label: 'None of these' },
]

export const hoursOptions: Option[] = [
  { value: 'under_2', label: 'Under 2 hrs' },
  { value: '2_5', label: '2–5 hrs' },
  { value: '5_10', label: '5–10 hrs' },
  { value: '10_plus', label: '10+ hrs' },
]

export const handlerOptions: Option[] = [
  { value: 'myself', label: 'Myself' },
  { value: 'ca', label: 'A CA' },
  { value: 'nobody', label: 'Nobody, I wing it' },
]

export const wtpOptions: Option[] = [
  { value: 'under_299', label: 'Under ₹299' },
  { value: '299_499', label: '₹299–₹499' },
  { value: '499_999', label: '₹499–₹999' },
  { value: '999_plus', label: '₹999+' },
  { value: 'wouldnt_pay', label: "I wouldn't pay" },
]

export const paidBeforeOptions: Option[] = [
  { value: 'yes_still', label: 'Yes, still paying' },
  { value: 'yes_stopped', label: 'Yes, but stopped' },
  { value: 'never', label: 'Never' },
]

export type SurveyAnswers = {
  category: string | null
  earnings_band: string | null
  foreign_income_share: string | null
  rails_used: string[]
  pain_points: string[]
  hours_lost: string | null
  compliance_handler: string | null
  willingness_to_pay: string | null
  paid_before: string | null
  email: string
  phone: string
  wants_call: boolean
}

export const emptyAnswers: SurveyAnswers = {
  category: null,
  earnings_band: null,
  foreign_income_share: null,
  rails_used: [],
  pain_points: [],
  hours_lost: null,
  compliance_handler: null,
  willingness_to_pay: null,
  paid_before: null,
  email: '',
  phone: '',
  wants_call: false,
}

// Demand score 0–100.
// Ability to pay (25%) + Cross-rail exposure (15%) + Pain intensity (35%) + Willingness to pay (25%)
export function computeDemandScore(a: SurveyAnswers): number {
  // Ability to pay — based on earnings band (0..1)
  const earningsMap: Record<string, number> = {
    under_1k: 0.25,
    '1.5k_3k': 0.5,
    '3k_5k': 0.75,
    '5k_plus': 1,
  }
  const ability = earningsMap[a.earnings_band ?? ''] ?? 0

  // Cross-rail exposure — number of rails selected (0..1), capped at 3+
  const exposure = Math.min(a.rails_used.length, 3) / 3

  // Pain intensity — number of real pain points + hours lost (0..1)
  const realPains = a.pain_points.filter((p) => p !== 'none')
  const painCount = Math.min(realPains.length, 4) / 4
  const hoursMap: Record<string, number> = {
    under_2: 0.25,
    '2_5': 0.5,
    '5_10': 0.75,
    '10_plus': 1,
  }
  const hours = hoursMap[a.hours_lost ?? ''] ?? 0
  const pain = painCount * 0.5 + hours * 0.5

  // Willingness to pay — ₹ band selected (0..1)
  const wtpMap: Record<string, number> = {
    under_299: 0.2,
    '299_499': 0.45,
    '499_999': 0.75,
    '999_plus': 1,
    wouldnt_pay: 0,
  }
  const wtp = wtpMap[a.willingness_to_pay ?? ''] ?? 0

  const score = ability * 25 + exposure * 15 + pain * 35 + wtp * 25
  return Math.round(score)
}
