'use client'

import { useEffect, useState } from 'react'

export function ScoreRing({ score }: { score: number }) {
  const [progress, setProgress] = useState(0)
  const radius = 84
  const stroke = 12
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  useEffect(() => {
    const t = setTimeout(() => setProgress(score), 100)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div className="relative flex items-center justify-center" role="img" aria-label={`Demand score ${score} out of 100`}>
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="var(--muted)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-semibold tabular-nums text-foreground">{score}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}
