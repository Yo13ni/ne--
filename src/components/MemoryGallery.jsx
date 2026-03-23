import { GALLERY_IMAGES } from '../config'
import { useInView } from '../hooks/useInView'
import { publicUrl } from '../utils/publicUrl'

const rotations = ['-rotate-1', 'rotate-1', 'rotate-0', '-rotate-2', 'rotate-2', '-rotate-1']

export default function MemoryGallery() {
  const [ref, inView] = useInView()

  return (
    <section
      id="gallery"
      ref={ref}
      className="scroll-mt-24 bg-linear-to-b from-black via-zinc-950 to-neutral-950 px-5 pt-4 pb-24 md:px-8 md:pt-5 md:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className={`mb-12 text-center font-display text-3xl tracking-wide text-stone-100 transition-all duration-1000 md:mb-16 md:text-4xl ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Sweetheart
        </h2>

        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {GALLERY_IMAGES.map((img, i) => (
            <figure
              key={img.src}
              className={`group mb-8 break-inside-avoid transition-all duration-700 ${
                inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } ${rotations[i % rotations.length]}`}
              style={{ transitionDelay: inView ? `${80 + (i % 6) * 70}ms` : '0ms' }}
            >
              <div className="relative rounded-sm bg-zinc-900 p-3 pb-10 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.7),0_0_0_1px_rgba(212,175,55,0.15)] ring-1 ring-gold-500/15 transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] group-hover:ring-gold-500/30">
                <div className="overflow-hidden bg-zinc-800">
                  <img
                    src={publicUrl(img.src)}
                    alt={img.caption ?? img.alt}
                    className="w-full object-cover object-center transition duration-700 group-hover:scale-[1.03]"
                    style={{ aspectRatio: '3 / 4' }}
                    loading="lazy"
                  />
                </div>
                <div className="absolute bottom-3 left-0 right-0 z-10 px-2 text-center">
                  <figcaption className="font-display text-sm leading-snug text-neutral-300">
                    {img.caption ?? img.alt}
                  </figcaption>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 z-[1] rounded-sm opacity-0 transition group-hover:opacity-100"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.08)',
                  }}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
