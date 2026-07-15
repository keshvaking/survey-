import { Globe } from 'lucide-react'
import { SurveyWizard } from '@/components/survey/survey-wizard'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* subtle background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col px-5 py-16 md:py-24">
        <header className="mb-10 flex flex-col gap-5 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Globe className="h-3.5 w-3.5 text-primary" />
            Cross-border compliance · 90-second survey
          </span>
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
            Stop dreading GST season with foreign clients.
          </h1>
          <p className="mx-auto max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Take our 90-second survey to help us understand your biggest cross-border compliance pain
            points.
          </p>
        </header>

        <SurveyWizard />

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          Your answers are confidential and used only to shape what we build.
        </p>
      </div>
    </main>
  )
}
