import clsx from 'clsx';
import { Play, RotateCcw, Square } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { SPEEDS, useAura } from '../../lib/store';
import type { Escenario } from '../../lib/types';

const ESC_LABEL: Record<Escenario, string> = { mala: 'Noche mala', buena: 'Noche buena' };

/** iOS-style segmented control. */
function Segmented({ children }: { children: ReactNode }) {
  return <div className="flex rounded-[10px] bg-surface-2 p-0.5">{children}</div>;
}

function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex-1 truncate rounded-[8px] px-2 py-1.5 text-[13px] font-semibold transition',
        active ? 'bg-surface-3 text-ink shadow-sm' : 'text-ink-2 hover:text-ink',
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
    <div className="flex flex-col gap-4">
      <div className="card flex flex-col gap-4 p-4">
        <div>
          <p className="eyebrow mb-2">Velocidad</p>
          <Segmented>
            {SPEEDS.map((s, i) => (
              <Segment key={s.label} active={speed === i} onClick={() => setSpeed(i)}>
                {s.label}
              </Segment>
            ))}
          </Segmented>
        </div>
        <div className="h-px bg-line" />
        <div>
          <p className="eyebrow mb-2">Escenario</p>
          <Segmented>
            <Segment active={escenarioForzado === null} onClick={() => setEscenarioForzado(null)}>
              Auto · {ESC_LABEL[escenarioAuto].toLowerCase()}
            </Segment>
            <Segment active={escenarioForzado === 'mala'} onClick={() => setEscenarioForzado('mala')}>
              Noche mala
            </Segment>
            <Segment active={escenarioForzado === 'buena'} onClick={() => setEscenarioForzado('buena')}>
              Noche buena
            </Segment>
          </Segmented>
          {live.running && (
            <p className="mt-2 text-[12px] text-ink-3">
              Noche en curso: {ESC_LABEL[live.escenario].toLowerCase()} (el escenario aplica a la próxima noche).
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {live.running ? (
          <button type="button" onClick={levantar} className="btn btn-quiet h-12 flex-1 text-[15px]">
            <Square size={14} strokeWidth={2} fill="currentColor" /> Terminar
          </button>
        ) : (
          <button type="button" onClick={dormir} className="btn btn-primary h-12 flex-1 text-[15px]">
            <Play size={15} strokeWidth={2} fill="currentColor" /> Iniciar noche
          </button>
        )}
        <button
          type="button"
          onClick={() => void reset()}
          disabled={resetting}
          className="btn btn-quiet h-12 px-5 text-[15px] text-ink-2 disabled:opacity-40"
        >
          <RotateCcw size={15} strokeWidth={1.75} className={resetting ? 'animate-spin' : undefined} />
          Reiniciar demo
        </button>
      </div>
    </div>
  );
}
