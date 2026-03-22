import { useCallback, useMemo, useState } from 'react'
import { HER_NAME } from '../config'
import { useInView } from '../hooks/useInView'

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export default function Surprise() {
  const [ref, inView] = useInView()
  const [active, setActive] = useState(false)

  const particles = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: `${randomBetween(2, 98)}%`,
      delay: `${randomBetween(0, 1.2).toFixed(2)}s`,
      duration: `${randomBetween(2.2, 4.5).toFixed(2)}s`,
      hue: i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#e8b4bc' : '#a8a29e',
      size: randomBetween(6, 12),
    }))
  }, [active])

  const hearts = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${randomBetween(5, 95)}%`,
      delay: `${randomBetween(0, 2).toFixed(2)}s`,
      duration: `${randomBetween(4, 8).toFixed(2)}s`,
      scale: randomBetween(0.7, 1.2).toFixed(2),
    }))
  }, [active])

  const trigger = useCallback(() => {
    setActive(true)
    window.setTimeout(() => setActive(false), 6500)
  }, [])

  return (
    <section id="surprise" ref={ref} className="relative scroll-mt-24 bg-black px-6 py-28 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent" />

      <div className="mx-auto max-w-xl text-center">
        <h2
          className={`mb-6 font-display text-3xl text-stone-100 transition-all duration-1000 md:text-4xl ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          One last thing
        </h2>
        <p
          className={`mb-10 font-display text-lg text-neutral-400 transition-all delay-100 duration-1000 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {HER_NAME}, tap below—this moment is yours.
        </p>

        <button
          type="button"
          onClick={trigger}
          className={`group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-full border-2 border-gold-500/50 bg-linear-to-r from-zinc-900 via-zinc-950 to-zinc-900 px-10 py-3 font-display text-lg tracking-wide text-stone-100 shadow-[0_12px_40px_-8px_rgba(201,162,39,0.25)] transition-all duration-1000 hover:scale-[1.02] hover:border-gold-500/70 hover:shadow-[0_16px_48px_-8px_rgba(201,162,39,0.35)] active:scale-[0.98] ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <span className="relative z-10">Click for a surprise</span>
          <span
            className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-gold-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            aria-hidden
          />
        </button>
      </div>

      {active && (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute top-0 rounded-sm"
              style={{
                left: p.left,
                width: p.size,
                height: p.size * 0.4,
                backgroundColor: p.hue,
                animation: `confetti-fall ${p.duration} ease-in ${p.delay} forwards`,
                transform: `rotate(${randomBetween(-40, 40)}deg)`,
              }}
            />
          ))}
          {hearts.map((h) => (
            <span
              key={h.id}
              className="absolute bottom-0 text-2xl text-rose-400/70 drop-shadow-md"
              style={{
                left: h.left,
                animation: `heart-rise ${h.duration} ease-out ${h.delay} forwards`,
                transform: `scale(${h.scale})`,
              }}
            >
              ♥
            </span>
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="max-w-sm rounded-3xl border border-gold-500/35 bg-zinc-900/95 px-8 py-6 text-center font-script text-3xl text-gold-400 shadow-2xl md:text-4xl"
              style={{ animation: 'sparkle 2s ease-in-out infinite' }}
            >
              I love you—today, tomorrow, always.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
