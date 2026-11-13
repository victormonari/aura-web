import { ETAPA_LABEL } from '../../lib/sim';
import type { Live } from '../../lib/types';

type RGB = [number, number, number];

const COLD: RGB = [12, 133, 153]; // aura-termo #0c8599
const NEUTRAL: RGB = [229, 219, 255]; // aura-soft #e5dbff
const WARM: RGB = [245, 159, 0]; // aura-amber #f59f00

function mix(a: RGB, b: RGB, t: number): RGB {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as RGB;
}

/** ≤25 °C teal → 27 °C neutral → ≥30 °C amber. */
export function tempColor(temp: number) {
  const c =
    temp <= 27
      ? mix(COLD, NEUTRAL, Math.min(Math.max((temp - 25) / 2, 0), 1))
      : mix(NEUTRAL, WARM, Math.min((temp - 27) / 3, 1));
  return `rgb(${c.join(',')})`;
}

function estadoCama(live: Live) {
  const d = live.objetivo - live.temp;
  if (!live.running) return 'En espera';
  if (d < -0.2) return 'Enfriando';
  if (d > 0.2) return 'Calentando';
  return 'En su punto';
}

/** Animated top-down bed whose sheet color follows the live temperature. */
export function BedVisual({ live }: { live: Live }) {
  const color = tempColor(live.temp);
  const stripes = Array.from({ length: 9 }, (_, i) => i);
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="rounded-[28px] border-4 border-[#8d6e63] bg-[#a1887f] p-3 shadow-inner">
        {/* Headboard pillows */}
        <div className="mb-2 flex gap-2">
          <div className="h-10 flex-1 rounded-2xl bg-white/90 shadow" />
          <div className="h-10 flex-1 rounded-2xl bg-white/90 shadow" />
        </div>
        {/* Sheet with microchannels */}
        <div
          className="relative h-44 overflow-hidden rounded-2xl transition-colors duration-1000"
          style={{ backgroundColor: color }}
        >
          <div className="absolute inset-0 flex flex-col justify-evenly px-4">
            {stripes.map((i) => (
              <div
                key={i}
                className={live.running ? 'sim-flow h-1 rounded-full' : 'h-1 rounded-full bg-white/35'}
                style={live.running ? { animationDelay: `${i * 0.15}s` } : undefined}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <span className="rounded-full bg-black/45 px-4 py-1 text-sm font-bold text-white backdrop-blur">
              Etapa: {ETAPA_LABEL[live.etapa]} · {estadoCama(live)}
            </span>
          </div>
          <div className="absolute right-3 top-3 rounded-xl bg-white/80 px-3 py-1 text-2xl font-extrabold text-aura-night">
            {live.temp.toFixed(1)} °C
          </div>
        </div>
      </div>
      <style>{`
        .sim-flow {
          background: linear-gradient(90deg, rgba(255,255,255,.15) 0%, rgba(255,255,255,.75) 50%, rgba(255,255,255,.15) 100%);
          background-size: 200% 100%;
          animation: sim-flow 2.4s linear infinite;
        }
        @keyframes sim-flow {
          from { background-position: 200% 0; }
          to { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
}
