export type Option = { value: string; label: string; description?: string }

export type Category = 'solo' | 'agency' | 'ca'

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

// ---- Shared consumer-track (solo + agency) options ----

export const earningsOptions: Option[] = [
  { value: 'under_1k', label: 'Under $1k' },
  { value: '1.5k_3k', label: '$1.5k–$3k' },
  { value: '3k_5k', label: '$3k–$5k' },
  { value: '5k_plus', label: '$5k+' },
]

export const invoiceVolumeOptions: Option[] = [
  { value: '1_5', label: '1–5 / month' },
  { value: '6_15', label: '6–15 / month' },
  { value: '16_30', label: '16–30 / month' },
  { value: '30_plus', label: '30+ / month' },
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

export const soloHandlerOptions: Option[] = [
  { value: 'myself', label: 'Myself' },
  { value: 'ca', label: 'A CA' },
  { value: 'nobody', label: 'Nobody, I wing it' },
]

export const agencyHandlerOptions: Option[] = [
  { value: 'founder', label: 'The founder' },
  { value: 'ops_person', label: 'An ops person' },
  { value: 'ca', label: 'A CA' },
  { value: 'nobody_we_wing_it', label: 'Nobody, we wing it' },
]

// Kept for backwards-compat / anywhere generic "handler" was referenced.
export const handlerOptions = soloHandlerOptions

export const invoicingMethodOptions: Option[] = [
  { value: 'google_template', label: 'A Google Doc / Sheets template' },
  { value: 'accounting_tool', label: 'An accounting tool (Refrens, Zoho, GimBooks, etc.)' },
  { value: 'ca_sends_it', label: 'My CA sends it' },
  { value: 'dont_do_it_properly', label: "Honestly, I don't do it properly" },
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

export const caAlongsideOrReplaceOptions: Option[] = [
  { value: 'alongside_ca', label: 'Work alongside my existing CA' },
  { value: 'mostly_replace_ca', label: 'Mostly replace the need for a CA' },
  { value: 'no_ca_currently', label: "I don't use a CA currently" },
]

// ---- CA-track-only options ----

export const clientCountOptions: Option[] = [
  { value: '1_10', label: '1–10 clients' },
  { value: '11_30', label: '11–30 clients' },
  { value: '31_80', label: '31–80 clients' },
  { value: '80_plus', label: '80+ clients' },
]

export const multiRailClientShareOptions: Option[] = [
  { value: 'under_25', label: 'Under 25%' },
  { value: '25_50', label: '25–50%' },
  { value: '50_75', label: '50–75%' },
  { value: '75_100', label: '75–100%' },
]

export const caTimeSinkOptions: Option[] = [
  { value: 'chasing_fira', label: 'Chasing down FIRA/FIRC' },
  { value: 'tracking_lut', label: 'Tracking LUT status/deadlines' },
  { value: 'reconciling_invoices', label: 'Reconciling invoices against rails' },
  { value: 'registration_questions', label: 'Registration / eligibility questions' },
  { value: 'none_really', label: 'None really' },
]

export const caHoursOptions: Option[] = [
  { value: 'under_5', label: 'Under 5 hrs' },
  { value: '5_15', label: '5–15 hrs' },
  { value: '15_30', label: '15–30 hrs' },
  { value: '30_plus', label: '30+ hrs' },
]

export const caPerClientWtpOptions: Option[] = [
  { value: 'under_99', label: 'Under ₹99 / client' },
  { value: '99_199', label: '₹99–₹199 / client' },
  { value: '199_399', label: '₹199–₹399 / client' },
  { value: '399_plus', label: '₹399+ / client' },
  { value: 'wouldnt_pay', label: "I wouldn't pay" },
]

export type SurveyAnswers = {
  category: Category | null

  // Solo / agency — step 2
  earnings_band: string | null // solo
  invoice_volume: string | null // agency
  foreign_income_share: string | null // solo + agency
  rails_used: string[] // solo + agency

  // Solo / agency — step 3
  pain_points: string[] // solo + agency
  hours_lost: string | null // solo + agency
  compliance_handler: string | null // solo + agency
  invoicing_method: string | null // solo + agency (new)

  // Solo / agency — step 4
  willingness_to_pay: string | null // solo + agency
  paid_before: string | null // solo + agency
  ca_alongside_or_replace: string | null // solo + agency (new)

  // CA track — step 2
  client_count: string | null
  multi_rail_client_share: string | null

  // CA track — step 3
  ca_time_sink: string | null
  ca_hours_lost: string | null

  // CA track — step 4
  ca_per_client_wtp: string | null
  ca_paid_before: string | null
  ca_churn_reason: string

  // Step 5 — shared by all
  email: string
  phone: string
  wants_call: boolean
}

export const emptyAnswers: SurveyAnswers = {
  category: null,

  earnings_band: null,
  invoice_volume: null,
  foreign_income_share: null,
  rails_used: [],

  pain_points: [],
  hours_lost: null,
  compliance_handler: null,
  invoicing_method: null,

  willingness_to_pay: null,
  paid_before: null,
  ca_alongside_or_replace: null,

  client_count: null,
  multi_rail_client_share: null,

  ca_time_sink: null,
  ca_hours_lost: null,

  ca_per_client_wtp: null,
  ca_paid_before: null,
  ca_churn_reason: '',

  email: '',
  phone: '',
  wants_call: false,
}

// Demand score 0–100. Only meaningful for category 'solo' | 'agency'.
// Ability to pay (25%) + Cross-rail exposure (15%) + Pain intensity (35%) + Willingness to pay (25%)
export function computeDemandScore(a: SurveyAnswers): number | null {
  if (a.category !== 'solo' && a.category !== 'agency') {
    return null
  }

  // Ability to pay — earnings band (solo) or invoice volume (agency), 0..1
  const earningsMap: Record<string, number> = {
    under_1k: 0.25,
    '1.5k_3k': 0.5,
    '3k_5k': 0.75,
    '5k_plus': 1,
  }
  const invoiceVolumeMap: Record<string, number> = {
    '1_5': 0.25,
    '6_15': 0.5,
    '16_30': 0.75,
    '30_plus': 1,
  }
  const ability =
    a.category === 'agency'
      ? invoiceVolumeMap[a.invoice_volume ?? ''] ?? 0
      : earningsMap[a.earnings_band ?? ''] ?? 0

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

// High-intent CA lead: manages a large client base AND would pay a
// meaningful per-client price for the dashboard.
export function computeIsHighIntentCaLead(a: SurveyAnswers): boolean {
  if (a.category !== 'ca') return false
  const bigBook = a.client_count === '31_80' || a.client_count === '80_plus'
  const highWtp = a.ca_per_client_wtp === '199_399' || a.ca_per_client_wtp === '399_plus'
  return bigBook && highWtp
}
