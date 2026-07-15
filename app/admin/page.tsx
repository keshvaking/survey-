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
  wants_call: boolean | null
}

const categoryLabel = (value: string | null) =>
  categoryOptions.find((c) => c.value === value)?.label ?? value ?? '—'

function scoreClass(score: number | null) {
  if (score == null) return 'text-muted-foreground'
  if (score >= 65) return 'text-primary'
  return 'text-foreground'
}

export default async function AdminPage() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('survey_responses')
    .select('id, created_at, email, phone, category, demand_score, wants_call')
    .order('demand_score', { ascending: false })

  const rows = (data ?? []) as Row[]

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <header className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Survey responses</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} response{rows.length === 1 ? '' : 's'}, sorted by demand score.
        </p>
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
                <TableHead className="text-right">Demand score</TableHead>
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
                  <TableCell className={`text-right font-semibold tabular-nums ${scoreClass(row.demand_score)}`}>
                    {row.demand_score ?? '—'}
                  </TableCell>
                  <TableCell>
                    {row.wants_call ? (
                      <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {new Date(row.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
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
