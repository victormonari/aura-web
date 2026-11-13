import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { ETAPA_LABEL } from '../../lib/sim';
import { useAura } from '../../lib/store';
import type { SabanaConfig } from '../../lib/types';
import { Card, SectionTitle, Tile } from './ui';

type TempKey = 'temp_induccion' | 'temp_profundo' | 'temp_despertar';

const ROWS: { key: TempKey; etapa: 'induccion' | 'profundo' | 'despertar'; hora: (c: SabanaConfig) => string }[] = [
  { key: 'temp_induccion', etapa: 'induccion', hora: (c) => c.hora_induccion.slice(0, 5) },
  { key: 'temp_profundo', etapa: 'profundo', hora: () => 'toda la noche' },
  { key: 'temp_despertar', etapa: 'despertar', hora: (c) => c.hora_despertar.slice(0, 5) },
];

const MIN = 13;
const MAX = 43;

export function Sabana() {
  const { config, live, updateConfig, cuidadora } = useAura();
  const nombre = cuidadora?.nombre ?? 'tu familiar';
  if (!config) return <p className="p-4 text-sm text-neutral-500">Sin configuración de sábana.</p>;

  const bump = (k: TempKey, d: number) => {
    const v = Math.min(MAX, Math.max(MIN, Number(config[k]) + d));
    void updateConfig({ [k]: v });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <img src="/aura-termosleep-simbolo.png" alt="" className="h-9 w-9" />
        <SectionTitle sub={`Sábana inteligente de ${nombre}`}>Aura TermoSleep</SectionTitle>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Tile label="Actual" value={<span className="text-xl">{live.temp.toFixed(1)}°</span>} hint="°C" />
        <Tile label="Objetivo" value={<span className="text-xl">{live.objetivo.toFixed(1)}°</span>} hint="°C" />
        <Tile
          label="Ruido"
          value={<span className="text-xl">{Math.round(live.ruido)}</span>}
          hint={<span className="rounded bg-emerald-600 px-1 font-bold text-white">&lt; 30 dB</span>}
          tone="good"
        />
      </div>

      <Card>
        <div className="mb-2 text-sm font-bold text-aura-night">Modo</div>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
          {(['automatico', 'manual'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => void updateConfig({ modo: m })}
              className={clsx(
                'rounded-lg py-2 text-sm font-bold',
                config.modo === m ? 'bg-white text-aura-violet shadow' : 'text-neutral-500',
              )}
            >
              {m === 'automatico' ? 'Automático' : 'Manual'}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-neutral-500">
          {config.modo === 'automatico'
            ? `Aura Rest ajusta la sábana según el sueño de ${nombre}.`
            : 'La sábana sigue exactamente las temperaturas que elijas.'}
        </p>
      </Card>

      <Card>
        <div className="mb-2 text-sm font-bold text-aura-night">Fases de la noche</div>
        <div className="divide-y divide-neutral-100">
          {ROWS.map((r) => {
            const activa = live.running && live.etapa === r.etapa;
            return (
              <div key={r.key} className="flex items-center gap-2 py-2">
                <div className="flex-1">
                  <div className={clsx('text-sm font-bold', activa ? 'text-aura-termo' : 'text-aura-night')}>
                    {ETAPA_LABEL[r.etapa]} {activa && '· ahora'}
                  </div>
                  <div className="text-[11px] text-neutral-500">{r.hora(config)}</div>
                </div>
                <button
                  type="button"
                  aria-label="Bajar 0,5 °C"
                  onClick={() => bump(r.key, -0.5)}
                  className="rounded-full border border-neutral-300 p-1.5 text-aura-termo active:scale-90"
                >
                  <Minus size={14} />
                </button>
                <div className="w-14 text-center text-base font-extrabold">
                  {Number(config[r.key]).toFixed(1)}°
                </div>
                <button
                  type="button"
                  aria-label="Subir 0,5 °C"
                  onClick={() => bump(r.key, 0.5)}
                  className="rounded-full border border-neutral-300 p-1.5 text-aura-amber active:scale-90"
                >
                  <Plus size={14} />
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-neutral-500">Rango permitido {MIN}–{MAX} °C · pasos de 0,5 °C</p>
      </Card>
    </div>
  );
}
