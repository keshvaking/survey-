'use client'

import { Check } from 'lucide-react'
import type { Option } from '@/lib/survey'
import { cn } from '@/lib/utils'

export function QuestionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-pretty text-base font-medium leading-relaxed text-foreground md:text-lg">
      {children}
    </h3>
  )
}

export function RadioCards({
  options,
  value,
  onChange,
  name,
}: {
  options: Option[]
  value: string | null
  onChange: (value: string) => void
  name: string
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'group flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 text-left transition-colors',
              'hover:border-primary/60 hover:bg-accent/40',
              selected && 'border-primary bg-accent/50 ring-1 ring-primary/40',
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                selected ? 'border-primary' : 'border-muted-foreground/50',
              )}
            >
              <span
                className={cn(
                  'h-2.5 w-2.5 rounded-full bg-primary transition-transform',
                  selected ? 'scale-100' : 'scale-0',
                )}
              />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
              {opt.description && (
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function CheckboxCards({
  options,
  values,
  onChange,
  name,
}: {
  options: Option[]
  values: string[]
  onChange: (values: string[]) => void
  name: string
}) {
  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value))
    } else {
      onChange([...values, value])
    }
  }

  return (
    <div role="group" aria-label={name} className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const selected = values.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            onClick={() => toggle(opt.value)}
            className={cn(
              'flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 text-left transition-colors',
              'hover:border-primary/60 hover:bg-accent/40',
              selected && 'border-primary bg-accent/50 ring-1 ring-primary/40',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/50',
              )}
            >
              <Check className={cn('h-3.5 w-3.5 transition-transform', selected ? 'scale-100' : 'scale-0')} />
            </span>
            <span className="text-sm font-medium text-foreground">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
