import { useAura } from '../../lib/store';
import { BedVisual } from './BedVisual';
import { Controls } from './Controls';
import { HowItWorks } from './HowItWorks';
import { SensorCard } from './SensorCard';
import { NightProgress, StatTiles } from './StatTiles';

/** Aura TermoSleep simulator panel (center of demo page, mockup D2). */
export function Simulator() {
  const { live, ready } = useAura();
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg">
      <header className="flex items-center gap-3">
        <img src="/aura-termosleep-simbolo.png" alt="" className="h-11 w-11 object-contain" />
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-aura-night">Simulador Aura TermoSleep</h2>
          <p className="text-xs text-neutral-500">Sábana inteligente · TS-A21</p>
        </div>
        <span
          className={
            live.running
              ? 'rounded-full bg-aura-termo/15 px-3 py-1 text-xs font-bold text-aura-termo'
              : 'rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500'
          }
        >
          {!ready ? 'Cargando…' : live.running ? '● Noche en curso' : 'En espera'}
        </span>
      </header>
      <BedVisual live={live} />
      <NightProgress live={live} />
      <StatTiles live={live} />
      <Controls />
      <SensorCard />
      <HowItWorks />
    </div>
  );
}
