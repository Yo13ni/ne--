const hearts = [
  { left: '8%', delay: '0s', duration: '14s', size: 14 },
  { left: '18%', delay: '2s', duration: '16s', size: 11 },
  { left: '28%', delay: '1s', duration: '12s', size: 16 },
  { left: '42%', delay: '3s', duration: '15s', size: 12 },
  { left: '55%', delay: '0.5s', duration: '17s', size: 13 },
  { left: '68%', delay: '2.5s', duration: '13s', size: 10 },
  { left: '78%', delay: '1.5s', duration: '14s', size: 15 },
  { left: '88%', delay: '3.5s', duration: '16s', size: 11 },
  { left: '95%', delay: '2s', duration: '15s', size: 9 },
]

export default function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute bottom-0 text-rose-400/25"
          style={{
            left: h.left,
            fontSize: h.size,
            animation: `heart-rise ${h.duration} ease-in-out ${h.delay} infinite`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}
