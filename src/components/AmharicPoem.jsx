import { AMHARIC_POEM_LINES } from '../config'
import { useInView } from '../hooks/useInView'

export default function AmharicPoem() {
  const [ref, inView] = useInView()

  return (
    <section
      id="poem"
      ref={ref}
      lang="am"
      dir="ltr"
      className="scroll-mt-24 bg-linear-to-b from-zinc-950 via-neutral-950 to-black px-6 pt-16 pb-2 md:pt-20 md:pb-3"
    >
      <div className="mx-auto max-w-2xl">
        <div
          className={`rounded-3xl border border-gold-500/20 bg-zinc-900/80 px-6 py-10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-1000 md:px-12 md:py-14 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mx-auto mb-8 h-px max-w-xs bg-linear-to-r from-transparent via-gold-500/40 to-transparent" />
          <div className="font-amharic text-center text-[1.125rem] font-medium leading-[2.15] tracking-wide text-neutral-200 md:text-[1.25rem] md:leading-[2.25]">
            {AMHARIC_POEM_LINES.map((line, i) =>
              line === '' ? (
                <div key={i} className="h-4 md:h-5" aria-hidden />
              ) : (
                <p key={i} className="whitespace-pre-wrap">
                  {line}
                </p>
              ),
            )}
          </div>
          <div className="mx-auto mt-10 h-px max-w-xs bg-linear-to-r from-transparent via-zinc-600 to-transparent" />
        </div>
      </div>
    </section>
  )
}
