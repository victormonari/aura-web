import { ETAPA_LABEL } from '../../lib/sim';
import type { Live } from '../../lib/types';

type RGB = [number, number, number];

const COOL: RGB = [100, 210, 255]; // teal #64d2ff
const NEUTRAL: RGB = [196, 184, 255]; // soft lilac #c4b8ff
const WARM: RGB = [255, 179, 64]; // amber #ffb340

function mix(a: RGB, b: RGB, t: number): RGB {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as RGB;
}

/** ≤25 °C teal → 27 °C neutral → ≥30 °C amber, as an "r g b" triplet. */
export function tempRgb(temp: number) {
  const c =
    temp <= 27
      ? mix(COOL, NEUTRAL, Math.min(Math.max((temp - 25) / 2, 0), 1))
      : mix(NEUTRAL, WARM, Math.min((temp - 27) / 3, 1));
  return c.join(',');
}

function estadoCama(live: Live) {
  const d = live.objetivo - live.temp;
  if (!live.running) return 'En espera';
  if (d < -0.2) return 'Enfriando';
  if (d > 0.2) return 'Calentando';
  return 'En su punto';
}

/** Minimal bed with a soft glow whose hue follows the live temperature. */
export function BedVisual({ live }: { live: Live }) {
  const rgb = tempRgb(live.temp);
  const channels = Array.from({ length: 7 }, (_, i) => i);
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-black px-6 pb-6 pt-8">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-[1500ms]"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 55%, rgba(${rgb},0.28), transparent 70%)`,
        }}
      />
      <div className="relative flex items-end justify-between">
        <div>
          <p className="eyebrow">{ETAPA_LABEL[live.etapa]}</p>
          <p className="mt-1 text-[15px] text-ink-2">{estadoCama(live)}</p>
        </div>
        <p className="text-[48px] font-bold leading-none tracking-tight tabular-nums">
          {live.temp.toFixed(1)}
          <span className="ml-1 text-[20px] font-semibold text-ink-2">°C</span>
        </p>
      </div>

      {/* bed */}
      <div className="relative mx-auto mt-6 w-full max-w-[380px]">
        <div className="flex gap-2 px-3">
          <div className="h-7 flex-1 rounded-xl bg-surface-3/70" />
          <div className="h-7 flex-1 rounded-xl bg-surface-3/70" />
        </div>
        <div
          className="relative mt-2 h-36 overflow-hidden rounded-[20px] bg-surface transition-shadow duration-[1500ms]"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(${rgb},0.25), 0 0 60px -10px rgba(${rgb},0.45)`,
          }}
        >
          <div
            className="absolute inset-0 transition-[background] duration-[1500ms]"
            style={{ background: `linear-gradient(180deg, rgba(${rgb},0.10), rgba(${rgb},0.22))` }}
          />
          <div className="absolute inset-0 flex flex-col justify-evenly px-5">
            {channels.map((i) => (
              <div
                key={i}
                className={live.running ? 'sim-channel h-px' : 'h-px'}
                style={{
                  backgroundColor: live.running ? undefined : `rgba(${rgb},0.25)`,
                  ['--c' as string]: rgb,
                  animationDelay: `${i * 0.25}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .sim-channel {
          background: linear-gradient(90deg, rgba(var(--c),0.12) 0%, rgba(var(--c),0.9) 50%, rgba(var(--c),0.12) 100%);
          background-size: 250% 100%;
          animation: sim-channel 3.2s ease-in-out infinite;
        }
        @keyframes sim-channel {
          from { background-position: 150% 0; }
          to { background-position: -100% 0; }
        }
        @media (prefers-reduced-motion: reduce) { .sim-channel { animation: none; } }
      `}</style>
    </div>
  );
}
