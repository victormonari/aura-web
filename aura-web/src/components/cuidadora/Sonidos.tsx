import clsx from 'clsx';
import { CloudRain, Leaf, type LucideIcon, Minus, Music, Play, Plus, Square, Waves } from 'lucide-react';
import type { Sonido } from '../../lib/sound';
import { SONIDOS } from './helpers';
import { BigButton, Body, STROKE, Title, TopBar } from './ui';

export interface SonidoState {
  kind: Sonido;
  minutos: number;
  vol: number; // 0.1 – 1
}

const MINUTOS = [15, 30, 60];

const ICONO: Record<Sonido, LucideIcon> = {
  lluvia: CloudRain,
  mar: Waves,
  ruido: Leaf,
  musica: Music,
};

export function Sonidos({
  dark,
  state,
  setState,
  sonando,
  onPlay,
  onParar,
  onBack,
}: {
  /** true while sleeping: dimmer text, no bright whites */
  dark: boolean;
  state: SonidoState;
  setState: (s: SonidoState) => void;
  sonando: Sonido | null;
  onPlay: (s: SonidoState) => void;
  onParar: () => void;
  onBack: () => void;
}) {
  const strong = dark ? 'text-ink-2' : 'text-ink';
  const nivel = Math.round(state.vol * 10);

  const elegir = (kind: Sonido) => {
    const next = { ...state, kind };
    setState(next);
    onPlay(next);
  };
  const cambiarVol = (d: number) => {
    const vol = Math.min(1, Math.max(0.1, Math.round((state.vol + d) * 10) / 10));
    setState({ ...state, vol });
  };

  return (
    <div className={clsx('flex flex-1 flex-col min-h-0', dark && 'bg-black')}>
      <TopBar
        night={dark}
        onBack={onBack}
        leer="Elige un sonido para dormir: lluvia, mar, ruido suave o música."
      />
      <Body>
        <Title night={dark}>Sonidos</Title>

        <div className="grid grid-cols-2 gap-3">
          {SONIDOS.map((s) => {
            const Icon = ICONO[s.kind];
            const on = state.kind === s.kind;
            return (
              <button
                key={s.kind}
                type="button"
                onClick={() => elegir(s.kind)}
                className={clsx(
                  'card min-h-[104px] p-4 flex flex-col justify-between text-left transition active:scale-[0.98]',
                  on && 'bg-surface-2 ring-1 ring-accent/60',
                )}
              >
                <span
                  className={clsx(
                    'grid size-10 place-items-center rounded-xl',
                    on ? 'bg-accent/20 text-accent' : 'bg-surface-3/60 text-ink-3',
                  )}
                >
                  <Icon size={22} strokeWidth={STROKE} />
                </span>
                <span className={clsx('text-[20px] font-semibold leading-tight', on ? strong : 'text-ink-2')}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* iOS segmented control for the timer */}
        <div className="flex flex-col gap-2">
          <span className="eyebrow px-1">Apagar en</span>
          <div className="flex rounded-full bg-surface p-1 border border-line">
            {MINUTOS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setState({ ...state, minutos: m })}
                className={clsx(
                  'flex-1 min-h-14 rounded-full text-[20px] font-semibold transition',
                  state.minutos === m ? `bg-surface-3 ${strong}` : 'text-ink-3',
                )}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>

        <div className="card flex items-center gap-2 p-2">
          <button
            type="button"
            onClick={() => cambiarVol(-0.1)}
            className="btn min-h-16 px-4 text-[20px] text-ink-2"
          >
            <Minus size={22} strokeWidth={STROKE} /> Bajo
          </button>
          <div className="flex flex-1 flex-col items-center gap-2">
            <span className={clsx('text-[20px] font-semibold tabular-nums', strong)}>Volumen {nivel}</span>
            <span className="h-1.5 w-full rounded-full bg-surface-3">
              <span
                className="block h-full rounded-full bg-accent/80"
                style={{ width: `${nivel * 10}%` }}
              />
            </span>
          </div>
          <button
            type="button"
            onClick={() => cambiarVol(0.1)}
            className="btn min-h-16 px-4 text-[20px] text-ink-2"
          >
            Alto <Plus size={22} strokeWidth={STROKE} />
          </button>
        </div>

        {sonando ? (
          <BigButton tone="quiet" icon={<Square size={22} strokeWidth={STROKE} />} onClick={onParar}>
            Parar
          </BigButton>
        ) : (
          <BigButton
            tone={dark ? 'night' : 'primary'}
            icon={<Play size={22} strokeWidth={STROKE} />}
            onClick={() => onPlay(state)}
          >
            Escuchar
          </BigButton>
        )}
      </Body>
    </div>
  );
}
