import confetti from 'canvas-confetti'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BIRTHDAY_BLOW_INSTRUCTION,
  BIRTHDAY_CANDLE_COUNT,
  BIRTHDAY_REVEAL_MESSAGE,
  BIRTHDAY_VIDEO_URL,
} from '../config'
import { useInView } from '../hooks/useInView'
import { publicUrl } from '../utils/publicUrl'

const MIC_RMS_THRESHOLD = 0.14
const MIC_COOLDOWN_MS = 700

function Candle({ lit, onBlow }) {
  const [justOut, setJustOut] = useState(false)

  const handleClick = () => {
    if (!lit) return
    setJustOut(true)
    onBlow()
    window.setTimeout(() => setJustOut(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!lit}
      className="group flex flex-col items-center gap-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-default"
      aria-label={lit ? 'Blow out this candle' : 'Candle out'}
    >
      <span className="relative flex h-11 w-10 items-end justify-center">
        {lit ? (
          <span
            className="animate-flame pointer-events-none absolute bottom-[calc(100%-4px)] h-9 w-6 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-linear-to-t from-amber-600 via-amber-300 to-yellow-100 shadow-[0_0_12px_rgba(251,191,36,0.85)]"
            aria-hidden
          />
        ) : justOut ? (
          <span
            className="pointer-events-none absolute bottom-[calc(100%-8px)] h-6 w-1 rounded-full bg-zinc-500/50 animate-smoke-wisp"
            aria-hidden
          />
        ) : null}
        <span
          className={`relative z-[1] h-14 w-2.5 rounded-sm shadow-inner transition-colors ${
            lit ? 'bg-linear-to-b from-rose-100 to-rose-300' : 'bg-zinc-700'
          }`}
          aria-hidden
        />
      </span>
    </button>
  )
}

export default function BirthdayCard() {
  const [ref, inView] = useInView({ once: true, threshold: 0.08 })
  const count = Math.min(12, Math.max(1, BIRTHDAY_CANDLE_COUNT))
  const [lit, setLit] = useState(() => Array.from({ length: count }, () => true))
  const [videoFailed, setVideoFailed] = useState(false)
  const revealedRef = useRef(false)
  const lastMicBlowRef = useRef(0)
  const streamRef = useRef(null)
  const rafRef = useRef(0)
  const audioCtxRef = useRef(null)
  const micSetupRef = useRef(false)
  const micSessionRef = useRef(0)

  const videoSrc = BIRTHDAY_VIDEO_URL?.trim() ? publicUrl(BIRTHDAY_VIDEO_URL.trim()) : ''

  const allOut = useMemo(() => lit.every((x) => !x), [lit])

  const fireConfetti = useCallback(() => {
    const end = Date.now() + 1800
    const colors = ['#d4af37', '#fbbf24', '#fecdd3', '#fda4af']

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
        ticks: 200,
        gravity: 1,
        scalar: 0.9,
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
        ticks: 200,
        gravity: 1,
        scalar: 0.9,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  useEffect(() => {
    if (allOut && !revealedRef.current) {
      revealedRef.current = true
      fireConfetti()
    }
    if (!allOut) revealedRef.current = false
  }, [allOut, fireConfetti])

  const extinguishAt = useCallback((index) => {
    setLit((prev) => {
      const next = [...prev]
      if (index >= 0 && index < next.length && next[index]) next[index] = false
      return next
    })
  }, [])

  const blowNextLit = useCallback(() => {
    setLit((prev) => {
      const i = prev.findIndex(Boolean)
      if (i === -1) return prev
      const next = [...prev]
      next[i] = false
      return next
    })
  }, [])

  const stopMic = useCallback(() => {
    micSessionRef.current += 1
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    micSetupRef.current = false
  }, [])

  const startMic = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return
    if (streamRef.current || micSetupRef.current || allOut) return
    micSetupRef.current = true
    const session = micSessionRef.current

    let analyser
    let dataArray

    const loop = () => {
      if (session !== micSessionRef.current || !analyser || !dataArray) return
      analyser.getByteTimeDomainData(dataArray)
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / dataArray.length)
      const now = Date.now()
      if (rms > MIC_RMS_THRESHOLD && now - lastMicBlowRef.current > MIC_COOLDOWN_MS) {
        lastMicBlowRef.current = now
        blowNextLit()
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        if (session !== micSessionRef.current) {
          stream.getTracks().forEach((t) => t.stop())
          micSetupRef.current = false
          return
        }
        streamRef.current = stream
        const Ctx = window.AudioContext || window.webkitAudioContext
        const ctx = new Ctx()
        audioCtxRef.current = ctx
        if (ctx.state === 'suspended') await ctx.resume()
        if (session !== micSessionRef.current) {
          stream.getTracks().forEach((t) => t.stop())
          micSetupRef.current = false
          return
        }
        const source = ctx.createMediaStreamSource(stream)
        analyser = ctx.createAnalyser()
        analyser.fftSize = 1024
        analyser.smoothingTimeConstant = 0.5
        source.connect(analyser)
        dataArray = new Uint8Array(analyser.fftSize)
        rafRef.current = requestAnimationFrame(loop)
      } catch {
        micSetupRef.current = false
      }
    })()
  }, [allOut, blowNextLit])

  useEffect(() => {
    if (allOut) {
      stopMic()
      return
    }
    startMic()
    return () => {
      stopMic()
    }
  }, [allOut, startMic, stopMic])

  const tryMicOnInteraction = useCallback(() => {
    if (allOut || streamRef.current) return
    if (micSetupRef.current) return
    startMic()
  }, [allOut, startMic])

  const resetCandles = () => {
    setLit(Array.from({ length: count }, () => true))
    setVideoFailed(false)
    revealedRef.current = false
    lastMicBlowRef.current = 0
  }

  return (
    <section
      id="birthday"
      ref={ref}
      className="relative scroll-mt-24 border-t border-zinc-800 bg-linear-to-b from-zinc-950 via-black to-black px-6 py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold-500/25 to-transparent"
        aria-hidden
      />

      <div className="mx-auto mt-2 max-w-lg">
        {!allOut && (
          <div
            role="presentation"
            onPointerDown={tryMicOnInteraction}
            className={`rounded-3xl border border-gold-500/20 bg-zinc-900/60 px-6 py-10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-all duration-700 ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mb-6 flex items-center justify-center gap-2 sm:gap-4">
              {lit.map((isLit, i) => (
                <Candle key={i} lit={isLit} onBlow={() => extinguishAt(i)} />
              ))}
            </div>

            <div
              className="relative mx-auto h-28 w-full max-w-[280px] rounded-t-2xl bg-linear-to-b from-rose-300/95 via-rose-200 to-amber-100/90 shadow-[inset_0_-8px_0_rgba(0,0,0,0.06)] ring-1 ring-white/20"
              aria-hidden
            >
              <div className="absolute inset-x-3 top-3 h-4 rounded-full bg-white/35 blur-sm" />
            </div>
            <div className="relative -mt-1 mx-auto h-14 w-full max-w-[300px] rounded-b-xl bg-linear-to-b from-amber-900/95 to-amber-950 shadow-lg ring-1 ring-black/40" />

            <p className="mt-8 max-w-sm mx-auto text-center font-display text-base leading-relaxed text-neutral-400">
              {BIRTHDAY_BLOW_INSTRUCTION}
            </p>
          </div>
        )}

        {allOut && (
          <div
            className="animate-fade-in-up space-y-8 rounded-3xl border border-gold-500/25 bg-zinc-900/50 px-6 py-10 text-center shadow-[0_24px_80px_-24px_rgba(201,162,39,0.12)] backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            {videoSrc && !videoFailed ? (
              <div className="overflow-hidden rounded-2xl ring-1 ring-gold-500/30">
                <video
                  className="aspect-video w-full bg-black object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  src={videoSrc}
                  onError={() => setVideoFailed(true)}
                />
              </div>
            ) : videoSrc && videoFailed ? (
              <p className="rounded-2xl border border-zinc-700 bg-zinc-950/80 px-4 py-8 font-amharic text-neutral-400">
                ቪዲዮ ማሳየት አልተቻለም።
              </p>
            ) : null}

            <p className="mx-auto max-w-lg font-amharic text-xl leading-relaxed text-neutral-200 md:text-2xl">
              {BIRTHDAY_REVEAL_MESSAGE}
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={resetCandles}
                className="rounded-full border border-zinc-600 px-8 py-3 font-display text-neutral-400 transition-colors hover:border-zinc-500 hover:text-neutral-200"
              >
                Light the candles again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
