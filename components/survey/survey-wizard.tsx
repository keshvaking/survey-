'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, LoaderCircle, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import {
  agencyHandlerOptions,
  caAlongsideOrReplaceOptions,
  caHoursOptions,
  caPerClientWtpOptions,
  caTimeSinkOptions,
  categoryOptions,
  clientCountOptions,
  computeDemandScore,
  computeIsHighIntentCaLead,
  earningsOptions,
  emptyAnswers,
  foreignShareOptions,
  hoursOptions,
  invoiceVolumeOptions,
  invoicingMethodOptions,
  multiRailClientShareOptions,
  paidBeforeOptions,
  painPointOptions,
  railsOptions,
  soloHandlerOptions,
  wtpOptions,
  type SurveyAnswers,
} from '@/lib/survey'
import { CheckboxCards, QuestionLabel, RadioCards } from './choice-cards'
import { ScoreRing } from './score-ring'

const TOTAL_STEPS = 5

type Result = { score: number | null; isHighIntentCaLead: boolean }

export function SurveyWizard() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<SurveyAnswers>(emptyAnswers)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  function set<K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step, result])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())
  const category = answers.category

  const canContinue = useMemo(() => {
    switch (step) {
      case 1:
        return !!answers.category
      case 2:
        if (category === 'ca') {
          return !!answers.client_count && !!answers.multi_rail_client_share
        }
        if (category === 'agency') {
          return (
            !!answers.invoice_volume &&
            !!answers.foreign_income_share &&
            answers.rails_used.length > 0
          )
        }
        // solo
        return (
          !!answers.earnings_band &&
          !!answers.foreign_income_share &&
          answers.rails_used.length > 0
        )
      case 3:
        if (category === 'ca') {
          return !!answers.ca_time_sink && !!answers.ca_hours_lost
        }
        // solo + agency share the same shape
        return (
          answers.pain_points.length > 0 &&
          !!answers.hours_lost &&
          !!answers.compliance_handler &&
          !!answers.invoicing_method
        )
      case 4:
        if (category === 'ca') {
          // ca_churn_reason is optional free text
          return !!answers.ca_per_client_wtp && !!answers.ca_paid_before
        }
        // solo + agency
        return (
          !!answers.willingness_to_pay &&
          !!answers.paid_before &&
          !!answers.ca_alongside_or_replace
        )
      case 5:
        return emailValid && (!answers.wants_call || answers.phone.trim().length >= 8)
      default:
        return false
    }
  }, [step, answers, emailValid, category])

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)
    const computedScore = computeDemandScore(answers)
    const isHighIntentCaLead = computeIsHighIntentCaLead(answers)
    try {
      const supabase = createClient()
      const { error: insertError } = await supabase.from('survey_responses').insert({
        category: answers.category,

        earnings_band: answers.earnings_band,
        invoice_volume: answers.invoice_volume,
        foreign_income_share: answers.foreign_income_share,
        rails_used: answers.rails_used,

        pain_points: answers.pain_points,
        hours_lost: answers.hours_lost,
        compliance_handler: answers.compliance_handler,
        invoicing_method: answers.invoicing_method,

        willingness_to_pay: answers.willingness_to_pay,
        paid_before: answers.paid_before,
        ca_alongside_or_replace: answers.ca_alongside_or_replace,

        client_count: answers.client_count,
        multi_rail_client_share: answers.multi_rail_client_share,

        ca_time_sink: answers.ca_time_sink,
        ca_hours_lost: answers.ca_hours_lost,

        ca_per_client_wtp: answers.ca_per_client_wtp,
        ca_paid_before: answers.ca_paid_before,
        ca_churn_reason: answers.ca_churn_reason.trim() || null,

        demand_score: computedScore,
        is_high_intent_ca_lead: isHighIntentCaLead,

        email: answers.email.trim(),
        phone: answers.phone.trim() || null,
        wants_call: answers.wants_call,
      })
      if (insertError) throw insertError
      setResult({ score: computedScore, isHighIntentCaLead })
    } catch (err) {
      console.error('[survey submit error]', err)
      const detail = err instanceof Error ? err.message : JSON.stringify(err)
      setError(`Something went wrong saving your response: ${detail}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (result !== null) {
    return <ResultScreen result={result} />
  }

  const progressPct = (step / TOTAL_STEPS) * 100

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {step} / {TOTAL_STEPS}
          </span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-6">
        {step === 1 && (
          <Field>
            <QuestionLabel>First — which of these is you?</QuestionLabel>
            <RadioCards
              name="category"
              options={categoryOptions}
              value={answers.category}
              onChange={(v) => set('category', v as SurveyAnswers['category'])}
            />
          </Field>
        )}

        {step === 2 && category === 'ca' && (
          <>
            <Field>
              <QuestionLabel>
                How many cross-border freelance/agency clients do you currently manage?
              </QuestionLabel>
              <RadioCards
                name="client-count"
                options={clientCountOptions}
                value={answers.client_count}
                onChange={(v) => set('client_count', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>
                What % of those clients use more than one payment rail (Wise + Payoneer + bank
                etc.)?
              </QuestionLabel>
              <RadioCards
                name="multi-rail-share"
                options={multiRailClientShareOptions}
                value={answers.multi_rail_client_share}
                onChange={(v) => set('multi_rail_client_share', v)}
              />
            </Field>
          </>
        )}

        {step === 2 && category === 'agency' && (
          <>
            <Field>
              <QuestionLabel>
                Roughly how many foreign invoices does your team send per month?
              </QuestionLabel>
              <RadioCards
                name="invoice-volume"
                options={invoiceVolumeOptions}
                value={answers.invoice_volume}
                onChange={(v) => set('invoice_volume', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>What % of total billing is foreign clients?</QuestionLabel>
              <RadioCards
                name="foreign-share"
                options={foreignShareOptions}
                value={answers.foreign_income_share}
                onChange={(v) => set('foreign_income_share', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>Which payment rails does your team use?</QuestionLabel>
              <CheckboxCards
                name="rails"
                options={railsOptions}
                values={answers.rails_used}
                onChange={(v) => set('rails_used', v)}
              />
            </Field>
          </>
        )}

        {step === 2 && category === 'solo' && (
          <>
            <Field>
              <QuestionLabel>What&apos;s your monthly foreign income?</QuestionLabel>
              <RadioCards
                name="earnings"
                options={earningsOptions}
                value={answers.earnings_band}
                onChange={(v) => set('earnings_band', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>What % of your total income is from foreign clients?</QuestionLabel>
              <RadioCards
                name="foreign-share"
                options={foreignShareOptions}
                value={answers.foreign_income_share}
                onChange={(v) => set('foreign_income_share', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>Which payment rails do you use?</QuestionLabel>
              <CheckboxCards
                name="rails"
                options={railsOptions}
                values={answers.rails_used}
                onChange={(v) => set('rails_used', v)}
              />
            </Field>
          </>
        )}

        {step === 3 && category === 'ca' && (
          <>
            <Field>
              <QuestionLabel>Which of these eats the most time across your clients?</QuestionLabel>
              <RadioCards
                name="ca-time-sink"
                options={caTimeSinkOptions}
                value={answers.ca_time_sink}
                onChange={(v) => set('ca_time_sink', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>
                Roughly how many hours per month across your practice go into this?
              </QuestionLabel>
              <RadioCards
                name="ca-hours"
                options={caHoursOptions}
                value={answers.ca_hours_lost}
                onChange={(v) => set('ca_hours_lost', v)}
              />
            </Field>
          </>
        )}

        {step === 3 && (category === 'solo' || category === 'agency') && (
          <>
            <Field>
              <QuestionLabel>Have any of these happened to you?</QuestionLabel>
              <CheckboxCards
                name="pain-points"
                options={painPointOptions}
                values={answers.pain_points}
                onChange={(v) => set('pain_points', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>
                Roughly how many hours per month do you or your team lose to this paperwork?
              </QuestionLabel>
              <RadioCards
                name="hours"
                options={hoursOptions}
                value={answers.hours_lost}
                onChange={(v) => set('hours_lost', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>
                {category === 'agency'
                  ? 'Who currently handles compliance for the agency?'
                  : 'Who currently handles your compliance?'}
              </QuestionLabel>
              <RadioCards
                name="handler"
                options={category === 'agency' ? agencyHandlerOptions : soloHandlerOptions}
                value={answers.compliance_handler}
                onChange={(v) => set('compliance_handler', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>How do you currently invoice foreign clients?</QuestionLabel>
              <RadioCards
                name="invoicing-method"
                options={invoicingMethodOptions}
                value={answers.invoicing_method}
                onChange={(v) => set('invoicing_method', v)}
              />
            </Field>
          </>
        )}

        {step === 4 && category === 'ca' && (
          <>
            <Field>
              <QuestionLabel>
                What would you pay per client/month for a dashboard that auto-tracks LUT/FIRA
                across all of them?
              </QuestionLabel>
              <RadioCards
                name="ca-per-client-wtp"
                options={caPerClientWtpOptions}
                value={answers.ca_per_client_wtp}
                onChange={(v) => set('ca_per_client_wtp', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>
                Have you ever paid for practice-management or compliance software before?
              </QuestionLabel>
              <RadioCards
                name="ca-paid-before"
                options={paidBeforeOptions}
                value={answers.ca_paid_before}
                onChange={(v) => set('ca_paid_before', v)}
              />
            </Field>
            <Field>
              <Label htmlFor="ca-churn-reason" className="text-base font-medium">
                What&apos;s the one thing that&apos;d make you drop a client-management tool after
                a month? <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="ca-churn-reason"
                type="text"
                placeholder="e.g. clunky exports, no WhatsApp reminders…"
                value={answers.ca_churn_reason}
                onChange={(e) => set('ca_churn_reason', e.target.value)}
                className="h-11 bg-background/60"
              />
            </Field>
          </>
        )}

        {step === 4 && (category === 'solo' || category === 'agency') && (
          <>
            <Field>
              <QuestionLabel>
                {category === 'agency'
                  ? 'What would fully-automated, per-seat handling be worth/mo?'
                  : 'If this was fully handled automatically, what would that be worth to you per month?'}
              </QuestionLabel>
              <RadioCards
                name="wtp"
                options={wtpOptions}
                value={answers.willingness_to_pay}
                onChange={(v) => set('willingness_to_pay', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>
                {category === 'agency'
                  ? 'Ever paid for a compliance/invoicing tool before?'
                  : 'Have you ever paid for a tool to help with this?'}
              </QuestionLabel>
              <RadioCards
                name="paid-before"
                options={paidBeforeOptions}
                value={answers.paid_before}
                onChange={(v) => set('paid_before', v)}
              />
            </Field>
            <Field>
              <QuestionLabel>
                Would you want Sarthi to work alongside your existing CA, or reduce your need for
                one?
              </QuestionLabel>
              <RadioCards
                name="ca-alongside-or-replace"
                options={caAlongsideOrReplaceOptions}
                value={answers.ca_alongside_or_replace}
                onChange={(v) => set('ca_alongside_or_replace', v)}
              />
            </Field>
          </>
        )}

        {step === 5 && (
          <>
            <Field>
              <Label htmlFor="email" className="text-base font-medium">
                What&apos;s your email?
              </Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={answers.email}
                onChange={(e) => set('email', e.target.value)}
                className="h-11 bg-background/60"
              />
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-4">
              <Label htmlFor="wants-call" className="cursor-pointer text-sm font-medium leading-relaxed">
                Can we follow up with a quick 10-min call?
              </Label>
              <Switch
                id="wants-call"
                checked={answers.wants_call}
                onCheckedChange={(v) => set('wants_call', v)}
              />
            </div>
            {answers.wants_call && (
              <Field>
                <Label htmlFor="phone" className="text-base font-medium">
                  What&apos;s the best number to reach you on?
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={answers.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className="h-11 bg-background/60"
                />
              </Field>
            )}
          </>
        )}

        {error && (
          <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || submitting}
            className="text-muted-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
              Continue
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={!canContinue || submitting}>
              {submitting ? (
                <>
                  <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin" />
                  {category === 'ca' ? 'Submitting…' : 'Calculating…'}
                </>
              ) : category === 'ca' ? (
                'Submit'
              ) : (
                'See my demand score'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>
}

function ResultScreen({ result }: { result: Result }) {
  if (result.score === null) {
    // CA track — no fabricated score, just a simple thank-you.
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card/70 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <PartyPopper className="h-3.5 w-3.5" />
            Thanks — we&apos;ll be in touch
          </span>
          <h2 className="text-balance text-xl font-semibold text-foreground md:text-2xl">
            Thanks for sharing how your practice runs.
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            We&apos;ll follow up using the email you provided if Sarthi looks like a fit for your
            client base.
          </p>
        </div>
      </div>
    )
  }

  const score = result.score
  const highDemand = score >= 65
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card/70 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
      <ScoreRing score={score} />
      {highDemand ? (
        <div className="flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <PartyPopper className="h-3.5 w-3.5" />
            High demand match
          </span>
          <h2 className="text-balance text-xl font-semibold text-foreground md:text-2xl">
            You&apos;re exactly who we&apos;re building this for — we&apos;d love to talk.
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            Thanks for taking the survey. We&apos;ll be in touch shortly using the email you provided.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-balance text-xl font-semibold text-foreground md:text-2xl">
            Thank you for your time.
          </h2>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            We appreciate you sharing your experience — your input directly shapes what we build next.
          </p>
        </div>
      )}
    </div>
  )
}
