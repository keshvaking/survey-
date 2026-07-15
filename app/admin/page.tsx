import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createAdminClient } from '@/lib/supabase/admin'
import { categoryOptions } from '@/lib/survey'

export const dynamic = 'force-dynamic'

type Row = {
  id: string
  created_at: string
  email: string | null
  phone: string | null
  category: string | null
  demand_score: number | null
  is_high_intent_ca_lead: boolean | null
  wants_call: boolean | null
}

const categoryLabel = (value: string | null) =>
  categoryOptions.find((c) => c.value === value)?.label ?? value ?? '—'

function scoreClass(score: number | null) {
  if (score == null) return 'text-muted-foreground'
  if (score >= 65) return 'text-primary'
  return 'text-foreground'
}

function WantsCallBadge({ wantsCall }: { wantsCall: boolean | null }) {
  return wantsCall ? (
    <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      Yes
    </span>
  ) : (
    <span className="text-xs text-muted-foreground">No</span>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const { view } = await searchParams
  // 'consumer' (default) shows solo/agency rows sorted by demand score.
  // 'ca' shows CA rows, high-intent leads first.
  const activeView = view === 'ca' ? 'ca' : 'consumer'

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('survey_responses')
    .select(
      'id, created_at, email, phone, category, demand_score, is_high_intent_ca_lead, wants_call',
    )

  const allRows = (data ?? []) as Row[]

  const consumerRows = allRows
    .filter((r) => r.category === 'solo' || r.category === 'agency')
    .sort((a, b) => (b.demand_score ?? -1) - (a.demand_score ?? -1))

  const caRows = allRows
    .filter((r) => r.category === 'ca')
    .sort((a, b) => Number(b.is_high_intent_ca_lead) - Number(a.is_high_intent_ca_lead))

  const rows = activeView === 'ca' ? caRows : consumerRows

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Survey responses</h1>
          <p className="text-sm text-muted-foreground">
            {allRows.length} total response{allRows.length === 1 ? '' : 's'} — {consumerRows.length}{' '}
            consumer, {caRows.length} CA.
          </p>
        </div>
        <div className="flex w-fit gap-1 rounded-lg border border-border bg-card/60 p-1">
          <Link
            href="/admin?view=consumer"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeView === 'consumer'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Consumer leads ({consumerRows.length})
          </Link>
          <Link
            href="/admin?view=ca"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeView === 'ca'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            CA leads ({caRows.length})
          </Link>
        </div>
      </header>

      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load responses: {error.message}
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-lg border border-border bg-card/60 px-4 py-8 text-center text-sm text-muted-foreground">
          No responses yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">
                  {activeView === 'ca' ? 'Status' : 'Demand score'}
                </TableHead>
                <TableHead>Wants call</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-foreground">{row.email ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{row.phone ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{categoryLabel(row.category)}</TableCell>
                  <TableCell className="text-right">
                    {activeView === 'ca' ? (
                      row.is_high_intent_ca_lead ? (
                        <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          High-intent CA lead
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )
                    ) : (
                      <span className={`font-semibold tabular-nums ${scoreClass(row.demand_score)}`}>
                        {row.demand_score ?? '—'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <WantsCallBadge wantsCall={row.wants_call} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {formatDate(row.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  )
}
