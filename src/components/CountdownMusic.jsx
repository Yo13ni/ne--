import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { COUNTDOWN_TARGET_ISO, HER_NAME, OUR_SONG_PATH } from '../config'
import { publicUrl } from '../utils/publicUrl'
import { useInView } from '../hooks/useInView'

function pad(n) {
  return String(n).padStart(2, '0')
}

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    const end = new Date(target).getTime()
    const remaining = end - now
    if (remaining <= 0) {
      return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    const s = Math.floor(remaining / 1000)
    return {
      passed: false,
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    }
  }, [now, target])
}

const unitClass =
  'flex min-w-[4.5rem] flex-col items-center rounded-2xl border border-zinc-700/80 bg-zinc-900/90 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'

export default function CountdownMusic() {
  const [ref, inView] = useInView()
  const countdown = useCountdown(COUNTDOWN_TARGET_ISO)
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)

  const togglePlay = useCallback(() => {
    const a = audioRef.current
    if (!a || audioError) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play().catch(() => setAudioError(true))
      setPlaying(true)
    }
  }, [playing, audioError])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onEnd = () => setPlaying(false)
    a.addEventListener('ended', onEnd)
    return () => a.removeEventListener('ended', onEnd)
  }, [])

  return (
    <section
      id="celebration"
      ref={ref}
      className="scroll-mt-24 bg-linear-to-b from-zinc-950 via-neutral-950 to-black px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          className={`mb-4 text-center font-display text-3xl text-stone-100 transition-all duration-1000 md:text-4xl ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Until your special day
        </h2>
        <p
          className={`mb-12 text-center font-display text-neutral-400 transition-all delay-100 duration-1000 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Counting every moment until we celebrate you, {HER_NAME}.
        </p>

        <div
          className={`mb-14 flex flex-wrap justify-center gap-3 transition-all delay-200 duration-1000 md:gap-4 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {countdown.passed ? (
            <p className="rounded-2xl border border-gold-500/35 bg-zinc-900/90 px-8 py-6 text-center font-script text-3xl text-gold-400">
              Today is your day—happy birthday, my love.
            </p>
          ) : (
            <>
              <div className={unitClass}>
                <span className="font-display text-3xl tabular-nums text-stone-100 md:text-4xl">
                  {pad(countdown.days)}
                </span>
                <span className="mt-1 font-display text-xs tracking-widest text-neutral-500 uppercase">Days</span>
              </div>
              <div className={unitClass}>
                <span className="font-display text-3xl tabular-nums text-stone-100 md:text-4xl">
                  {pad(countdown.hours)}
                </span>
                <span className="mt-1 font-display text-xs tracking-widest text-neutral-500 uppercase">Hours</span>
              </div>
              <div className={unitClass}>
                <span className="font-display text-3xl tabular-nums text-stone-100 md:text-4xl">
                  {pad(countdown.minutes)}
                </span>
                <span className="mt-1 font-display text-xs tracking-widest text-neutral-500 uppercase">Minutes</span>
              </div>
              <div className={unitClass}>
                <span className="font-display text-3xl tabular-nums text-stone-100 md:text-4xl">
                  {pad(countdown.seconds)}
                </span>
                <span className="mt-1 font-display text-xs tracking-widest text-neutral-500 uppercase">Seconds</span>
              </div>
            </>
          )}
        </div>

        <div
          className={`mx-auto max-w-md rounded-3xl border border-gold-500/20 bg-zinc-900/90 p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] transition-all delay-300 duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl text-stone-100">Play this when you miss me</p>
            </div>
            <button
              type="button"
              onClick={togglePlay}
              disabled={audioError}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gold-500 to-amber-700 text-zinc-950 shadow-lg transition hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={playing ? 'Pause music' : 'Play music'}
            >
              {playing ? (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
          <audio
            ref={audioRef}
            src={publicUrl(OUR_SONG_PATH)}
            preload="metadata"
            onError={() => setAudioError(true)}
          />
          {audioError ? (
            <p className="rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 font-display text-sm text-neutral-400">
              Add your audio as <code className="text-gold-500">public/wedeshalhu degeme.m4a</code> to hear it here.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
