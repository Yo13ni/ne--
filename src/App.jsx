import Hero from './components/Hero'
import BirthdayCard from './components/BirthdayCard'
import AmharicPoem from './components/AmharicPoem'
import MemoryGallery from './components/MemoryGallery'
import CountdownMusic from './components/CountdownMusic'
import Surprise from './components/Surprise'
import { HER_NAME } from './config'

function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black px-6 py-10 text-center">
      <p className="font-display text-sm text-neutral-500">
        Made with love for {HER_NAME} · {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-svh bg-black">
      <main>
        <Hero />
        <BirthdayCard />
        <AmharicPoem />
        <MemoryGallery />
        <CountdownMusic />
        <Surprise />
      </main>
      <Footer />
    </div>
  )
}
