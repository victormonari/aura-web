import clsx from 'clsx';
import { Play, RotateCcw, Square } from 'lucide-react';
import { useState } from 'react';
import { SPEEDS, useAura } from '../../lib/store';
import type { Escenario } from '../../lib/types';

const ESC_LABEL: Record<Escenario, string> = { mala: 'Noche mala', buena: 'Noche buena' };

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full px-3 py-1.5 text-sm font-semibold transition',
        active ? 'bg-aura-violet text-white' : 'bg-aura-soft text-aura-violet hover:bg-aura-lilac/50',
      )}
    >
      {children}
    </button>
  );
}

export function Controls() {
  const {
    live,
    speed,
    setSpeed,
    escenarioForzado,
    setEscenarioForzado,
    escenarioAuto,
    dormir,
    levantar,
    resetDemo,
  } = useAura();
  const [resetting, setResetting] = useState(false);

  const reset = async () => {
    setResetting(true);
    try {
      await resetDemo();
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-20 text-sm font-bold text-neutral-600">Velocidad</span>
        {SPEEDS.map((s, i) => (
          <Chip key={s.label} active={speed === i} onClick={() => setSpeed(i)}>
            {s.label}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-20 text-sm font-bold text-neutral-600">Escenario</span>
        <Chip active={escenarioForzado === null} onClick={() => setEscenarioForzado(null)}>
          Auto ({ESC_LABEL[escenarioAuto].toLowerCase()})
        </Chip>
        <Chip active={escenarioForzado === 'mala'} onClick={() => setEscenarioForzado('mala')}>
          Noche mala
        </Chip>
        <Chip active={escenarioForzado === 'buena'} onClick={() => setEscenarioForzado('buena')}>
          Noche buena
        </Chip>
      </div>
      {live.running && (
        <p className="text-xs text-neutral-500">
          Noche en curso: {ESC_LABEL[live.escenario].toLowerCase()} (el escenario aplica a la próxima noche).
        </p>
      )}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={dormir}
          disabled={live.running}
          className="flex items-center justify-center gap-2 rounded-2xl bg-aura-violet py-3 font-bold text-white shadow hover:brightness-110 disabled:opacity-40"
        >
          <Play size={18} /> Iniciar noche
        </button>
        <button
          type="button"
          onClick={levantar}
          disabled={!live.running}
          className="flex items-center justify-center gap-2 rounded-2xl bg-aura-night py-3 font-bold text-white shadow hover:brightness-125 disabled:opacity-40"
        >
          <Square size={16} /> Terminar
        </button>
        <button
          type="button"
          onClick={() => void reset()}
          disabled={resetting}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-aura-violet py-3 font-bold text-aura-violet hover:bg-aura-soft disabled:opacity-40"
        >
          <RotateCcw size={16} className={resetting ? 'animate-spin' : undefined} />
          Reiniciar demo
        </button>
      </div>
    </div>
  );
}
