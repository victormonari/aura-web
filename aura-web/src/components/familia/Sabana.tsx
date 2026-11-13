import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { ETAPA_LABEL } from '../../lib/sim';
import { useAura } from '../../lib/store';
import type { SabanaConfig } from '../../lib/types';
import { Eyebrow, Sep, Tile } from './ui';

type TempKey = 'temp_induccion' | 'temp_profundo' | 'temp_despertar';

const ROWS: { key: TempKey; etapa: 'induccion' | 'profundo' | 'despertar'; hora: (c: SabanaConfig) => string }[] = [
  { key: 'temp_induccion', etapa: 'induccion', hora: (c) => c.hora_induccion.slice(0, 5) },
  { key: 'temp_profundo', etapa: 'profundo', hora: () => 'Toda la noche' },
  { key: 'temp_despertar', etapa: 'despertar', hora: (c) => c.hora_despertar.slice(0, 5) },
];

const MIN = 13;
const MAX = 43;

function Step({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full bg-surface-2 text-ink active:scale-90 active:bg-surface-3"
    >
      {children}
    </button>
  );
}

export function Sabana() {
  const { config, live, updateConfig, cuidadora } = useAura();
  const nombre = cuidadora?.nombre ?? 'tu familiar';
  if (!config) return <p className="p-6 text-[15px] text-ink-3">Sin configuración de sábana.</p>;

  const bump = (k: TempKey, d: number) => {
    const v = Math.min(MAX, Math.max(MIN, Number(config[k]) + d));
    void updateConfig({ [k]: v });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pt-2">
        <img src="/aura-termosleep-simbolo.png" alt="" className="size-10" />
        <div>
          <h1 className="title-lg text-ink">Sábana</h1>
          <p className="text-[15px] text-ink-2">Aura TermoSleep de {nombre}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <Tile label="Actual" value={live.temp.toFixed(1)} unit="°" size="md" />
        <Tile label="Objetivo" value={live.objetivo.toFixed(1)} unit="°" size="md" />
        <Tile
          label="Ruido"
          value={Math.round(live.ruido)}
          unit="dB"
          size="md"
          hint={<span className="font-semibold text-green">&lt; 30 dB</span>}
        />
      </div>

      <Eyebrow className="pt-2">Modo</Eyebrow>
      <div className="card p-1.5">
        <div className="grid grid-cols-2 gap-1">
          {(['automatico', 'manual'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => void updateConfig({ modo: m })}
              className={clsx(
                'rounded-full py-2 text-[15px] font-semibold transition',
                config.modo === m ? 'bg-surface-3 text-ink' : 'text-ink-2',
              )}
            >
              {m === 'automatico' ? 'Automático' : 'Manual'}
            </button>
          ))}
        </div>
      </div>
      <p className="-mt-2 px-1 text-[13px] text-ink-3">
        {config.modo === 'automatico'
          ? `Aura Rest ajusta la sábana según el sueño de ${nombre}.`
          : 'La sábana sigue exactamente las temperaturas que elijas.'}
      </p>

      <Eyebrow className="pt-2">Fases de la noche</Eyebrow>
      <div className="card overflow-hidden">
        {ROWS.map((r, i) => {
          const activa = live.running && live.etapa === r.etapa;
          return (
            <Fragment key={r.key}>
              {i > 0 && <Sep inset={16} />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-[16px] font-semibold text-ink">
                    {activa && <span className="size-1.5 rounded-full bg-teal" />}
                    {ETAPA_LABEL[r.etapa]}
                  </div>
                  <div className="text-[13px] text-ink-3">
                    {r.hora(config)}
                    {activa && <span className="text-teal"> · ahora</span>}
                  </div>
                </div>
                <Step label="Bajar 0,5 °C" onClick={() => bump(r.key, -0.5)}>
                  <Minus size={14} strokeWidth={2} />
                </Step>
                <div className="w-14 text-center text-[20px] font-semibold tabular-nums tracking-tight">
                  {Number(config[r.key]).toFixed(1)}°
                </div>
                <Step label="Subir 0,5 °C" onClick={() => bump(r.key, 0.5)}>
                  <Plus size={14} strokeWidth={2} />
                </Step>
              </div>
            </Fragment>
          );
        })}
      </div>
      <p className="-mt-2 px-1 text-[13px] text-ink-3">
        Rango {MIN}–{MAX} °C · pasos de 0,5 °C
      </p>
    </div>
  );
}
