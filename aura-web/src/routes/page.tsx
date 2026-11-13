import { ChevronRight, Moon, Users } from 'lucide-react';

/** Entry: choose your role. In a real product this is where login would go. */
export default function Home() {
  return (
    <div className="min-h-dvh bg-bg bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(125,107,255,0.22),transparent)] flex flex-col items-center px-6 pt-20 pb-12">
      <img src="/aura-simbolo.png" alt="" className="size-20" />
      <h1 className="mt-6 title-xl text-center">Aura</h1>
      <p className="mt-3 max-w-sm text-center text-[17px] text-ink-2">
        Quien cuida también merece ser cuidado.
      </p>

      <div className="mt-14 w-full max-w-md card overflow-hidden">
        <a href="/cuidadora" className="flex items-center gap-4 px-5 py-5 active:bg-surface-2">
          <span className="grid size-12 place-items-center rounded-2xl bg-amber/15">
            <Moon className="size-6 text-amber" />
          </span>
          <span className="flex-1">
            <span className="block text-[20px] font-semibold">Yo descanso</span>
            <span className="block text-[15px] text-ink-2">Mi cama y mi descanso</span>
          </span>
          <ChevronRight className="size-5 text-ink-3" />
        </a>
        <div className="ml-[84px] h-px bg-line" />
        <a href="/familia" className="flex items-center gap-4 px-5 py-5 active:bg-surface-2">
          <span className="grid size-12 place-items-center rounded-2xl bg-accent/15">
            <Users className="size-6 text-accent" />
          </span>
          <span className="flex-1">
            <span className="block text-[20px] font-semibold">Soy familiar</span>
            <span className="block text-[15px] text-ink-2">Cuidar a quien cuida</span>
          </span>
          <ChevronRight className="size-5 text-ink-3" />
        </a>
      </div>

      <a href="/demo" className="mt-8 text-[15px] text-ink-3 hover:text-ink-2">
        Ver demo para presentación
      </a>
    </div>
  );
}
