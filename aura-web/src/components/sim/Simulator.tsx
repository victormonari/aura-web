import { useAura } from '../../lib/store';
import { BedVisual } from './BedVisual';
import { Controls } from './Controls';
import { HowItWorks } from './HowItWorks';
import { SensorCard } from './SensorCard';
import { NightProgress, StatTiles } from './StatTiles';

/** Aura TermoSleep simulator panel (center of demo page, mockup D2). */
export function Simulator() {
  const { live, ready } = useAura();
  const estado = !ready ? 'Cargando…' : live.running ? 'Noche en curso' : 'En espera';
  return (
    <div className="flex flex-col gap-4">
      <div className="card overflow-hidden">
        <header className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-2xl bg-teal/15">
            <img src="/aura-termosleep-simbolo.png" alt="" className="size-6 object-contain" />
          </span>
          <div className="flex-1">
            <h2 className="text-[17px] font-semibold">Simulador Aura TermoSleep</h2>
            <p className="text-[13px] text-ink-3">Sábana inteligente · TS-A21</p>
          </div>
          <span className="flex items-center gap-1.5 text-[13px] text-ink-2">
            <span
              className={
                live.running ? 'size-1.5 animate-pulse rounded-full bg-teal' : 'size-1.5 rounded-full bg-ink-3'
              }
            />
            {estado}
          </span>
        </header>
        <div className="px-2">
          <BedVisual live={live} />
        </div>
        <div className="px-5 pb-5 pt-4">
          <NightProgress live={live} />
        </div>
      </div>
      <StatTiles live={live} />
      <Controls />
      <SensorCard />
      <HowItWorks />
    </div>
  );
}
