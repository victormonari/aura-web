import { Clock, Gauge, Heart, Moon, Target, Thermometer } from 'lucide-react';
import type { ReactNode } from 'react';
import { FASE_LABEL, horaSim, NIGHT_MIN } from '../../lib/sim';
import type { Live } from '../../lib/types';

function Tile({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f8f6ff] p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-extrabold text-aura-night">{value}</div>
      {hint && <div className="text-xs text-neutral-500">{hint}</div>}
    </div>
  );
}

export function StatTiles({ live }: { live: Live }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Tile icon={<Thermometer size={14} />} label="Temp actual" value={`${live.temp.toFixed(1)} °C`} />
      <Tile icon={<Target size={14} />} label="Objetivo" value={`${live.objetivo.toFixed(1)} °C`} />
      <Tile icon={<Moon size={14} />} label="Fase" value={FASE_LABEL[live.fase]} />
      <Tile
        icon={<Heart size={14} className="text-aura-sensor" />}
        label="Pulso"
        value={`${live.pulso} lpm`}
        hint={live.fuente === 'xiaomi' ? 'Aura Sensor ✓' : 'simulado'}
      />
      <Tile
        icon={<Gauge size={14} />}
        label="Bomba"
        value={`${live.ruido.toFixed(0)} dB`}
        hint="< 30 dB"
      />
      <Tile icon={<Clock size={14} />} label="Hora sim." value={horaSim(live.minute)} />
    </div>
  );
}

export function NightProgress({ live }: { live: Live }) {
  const pct = Math.min((live.minute / NIGHT_MIN) * 100, 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-semibold text-neutral-500">
        <span>9:40 p. m.</span>
        <span>{Math.round(pct)} % de la noche</span>
        <span>5:40 a. m.</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-aura-soft">
        <div
          className="h-full rounded-full bg-gradient-to-r from-aura-violet to-aura-lilac transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
