import { FASE_LABEL, horaSim, NIGHT_MIN } from '../../lib/sim';
import type { Live } from '../../lib/types';

function Metric({
  label,
  value,
  unit,
  hint,
  tint = 'text-ink',
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  tint?: string;
}) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-[13px] text-ink-2">{label}</p>
      <p className={`mt-0.5 text-[24px] font-bold leading-tight tracking-tight tabular-nums ${tint}`}>
        {value}
        {unit && <span className="ml-1 text-[13px] font-semibold text-ink-2">{unit}</span>}
      </p>
      {hint && <p className="text-[11px] text-ink-3">{hint}</p>}
    </div>
  );
}

export function StatTiles({ live }: { live: Live }) {
  return (
    <div className="card grid grid-cols-3 overflow-hidden [&>*:nth-child(-n+3)]:border-b [&>*:not(:nth-child(3n))]:border-r [&>*]:border-line">
      <Metric label="Temp actual" value={live.temp.toFixed(1)} unit="°C" tint="text-teal" />
      <Metric label="Objetivo" value={live.objetivo.toFixed(1)} unit="°C" />
      <Metric label="Fase" value={FASE_LABEL[live.fase]} tint="text-accent" />
      <Metric
        label="Pulso"
        value={String(live.pulso)}
        unit="lpm"
        tint="text-red"
        hint={live.fuente === 'xiaomi' ? 'Aura Sensor ✓' : 'simulado'}
      />
      <Metric label="Bomba" value={live.ruido.toFixed(0)} unit="dB" hint="< 30 dB" />
      <Metric label="Hora sim." value={horaSim(live.minute)} />
    </div>
  );
}

export function NightProgress({ live }: { live: Live }) {
  const pct = Math.min((live.minute / NIGHT_MIN) * 100, 100);
  return (
    <div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent transition-[width] duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ink-3 tabular-nums">
        <span>9:40 p. m.</span>
        <span>{Math.round(pct)} % de la noche</span>
        <span>5:40 a. m.</span>
      </div>
    </div>
  );
}
