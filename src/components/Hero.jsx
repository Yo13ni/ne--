import { HER_NAME, HERO_LOGO, HERO_MESSAGE, HERO_PHOTO } from '../config'
import FloatingHearts from './FloatingHearts'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black px-5 py-14 md:px-10"
    >
      {/* Dreamy blurred portrait backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={HERO_PHOTO}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-25 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-black/90 via-zinc-950/85 to-black"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-radial-[ellipse_at_30%_20%] from-gold-500/8 via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-radial-[ellipse_at_80%_70%] from-rose-950/40 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      {/* Subtle grain (light on dark) */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.035] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <FloatingHearts />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
        {/* Logo + portrait */}
        <div className="flex w-full max-w-sm shrink-0 flex-col items-center animate-fade-in-up">
          <div className="mb-4 flex w-full items-center justify-center gap-2.5 sm:gap-3">
            <span className="h-px w-8 bg-linear-to-r from-transparent to-gold-500/55 sm:w-10" aria-hidden />
            <span className="font-script text-2xl text-gold-400 sm:text-3xl md:text-4xl">{HERO_LOGO}</span>
            <span className="h-px w-8 bg-linear-to-l from-transparent to-gold-500/55 sm:w-10" aria-hidden />
          </div>

          <div className="relative w-full">
            <div className="relative overflow-hidden rounded-xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.85)] ring-1 ring-gold-500/30">
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              <img
                src={HERO_PHOTO}
                alt={`${HER_NAME}, my love`}
                className="aspect-3/4 w-full object-cover object-[center_20%] md:max-h-[min(70vh,520px)]"
                width={480}
                height={640}
                fetchPriority="high"
              />
            </div>
          </div>
          <p className="mt-2 text-center font-script text-xl text-gold-400/95 sm:text-2xl">Always you</p>
        </div>

        {/* Greeting */}
        <div className="max-w-xl flex-1 text-center lg:text-left">
          <h1 className="animate-fade-in-up mb-8 font-script text-5xl leading-tight text-stone-100 md:text-6xl lg:text-7xl">
            Happy Birthday,
            <br />
            <span className="bg-gradient-to-r from-gold-400 via-amber-200 to-gold-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
              {HER_NAME}
            </span>
          </h1>
          <p className="animate-fade-in-up mb-3 font-display text-sm tracking-[0.28em] text-gold-500/90 uppercase md:text-base">
            With all my heart
          </p>
          <p className="animate-fade-in-up mx-auto max-w-lg font-display text-lg leading-[1.85] text-neutral-300 delay-100 lg:mx-0 md:text-xl">
            {HERO_MESSAGE}
          </p>
        </div>
      </div>
    </section>
  )
}
