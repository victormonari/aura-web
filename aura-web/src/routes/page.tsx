import { HeartHandshake, Moon, Presentation } from 'lucide-react';

/** Entry: choose your role. In a real product this is where login would go. */
export default function Home() {
  return (
    <div className="min-h-dvh bg-[#f3f0ff] flex flex-col items-center px-6 py-12">
      <img src="/aura-logo.png" alt="Aura" className="h-24" />
      <p className="mt-4 max-w-md text-center text-lg text-neutral-600">
        Quien cuida también merece ser cuidado.
      </p>
      <div className="mt-10 w-full max-w-md flex flex-col gap-5">
        <a
          href="/cuidadora"
          className="flex items-center gap-5 rounded-3xl bg-aura-night p-6 text-white shadow-lg active:scale-[0.99]"
        >
          <Moon className="size-12 text-aura-amber shrink-0" />
          <span>
            <span className="block text-3xl font-extrabold">Yo descanso</span>
            <span className="block text-lg text-white/70">Aura Rest · mi cama y mi descanso</span>
          </span>
        </a>
        <a
          href="/familia"
          className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-aura-soft active:scale-[0.99]"
        >
          <HeartHandshake className="size-12 text-aura-violet shrink-0" />
          <span>
            <span className="block text-3xl font-extrabold">Soy familiar</span>
            <span className="block text-lg text-neutral-500">Aura Rest Familia · cuidar a quien cuida</span>
          </span>
        </a>
      </div>
      <a href="/demo" className="mt-10 flex items-center gap-2 text-aura-violet font-semibold">
        <Presentation className="size-5" /> Ver demo para presentación
      </a>
    </div>
  );
}
