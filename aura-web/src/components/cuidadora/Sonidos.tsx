import clsx from 'clsx';
import { Minus, Play, Plus, Square, Timer } from 'lucide-react';
import type { Sonido } from '../../lib/sound';
import { SONIDOS } from './helpers';
import { BigButton, Body, Title, TopBar } from './ui';

export interface SonidoState {
  kind: Sonido;
  minutos: number;
  vol: number; // 0.1 – 1
}

const MINUTOS = [15, 30, 60];

export function Sonidos({
  dark,
  state,
  setState,
  sonando,
  onPlay,
  onParar,
  onBack,
}: {
  dark: boolean;
  state: SonidoState;
  setState: (s: SonidoState) => void;
  sonando: Sonido | null;
  onPlay: (s: SonidoState) => void;
  onParar: () => void;
  onBack: () => void;
}) {
  const card = dark ? 'bg-white/10 text-amber-50' : 'bg-aura-soft text-aura-night';
  const sel = dark ? 'bg-amber-200 text-aura-night' : 'bg-aura-violet text-white';
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
    <>
      <TopBar dark={dark} onBack={onBack} leer="Elige un sonido para dormir: lluvia, mar, ruido suave o música." />
      <Body>
        <Title dark={dark}>Sonidos</Title>
        <div className="grid grid-cols-2 gap-3">
          {SONIDOS.map((s) => (
            <button
              key={s.kind}
              type="button"
              onClick={() => elegir(s.kind)}
              className={clsx(
                'min-h-24 rounded-3xl flex flex-col items-center justify-center gap-1 text-xl font-extrabold transition',
                state.kind === s.kind ? sel : card,
              )}
            >
              <span className="text-[34px] leading-none">{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Timer size={26} className="shrink-0" />
          {MINUTOS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setState({ ...state, minutos: m })}
              className={clsx(
                'flex-1 min-h-14 rounded-2xl text-xl font-bold',
                state.minutos === m ? sel : card,
              )}
            >
              {m} min
            </button>
          ))}
        </div>

        <div className={clsx('flex items-center gap-3 rounded-3xl p-2', card)}>
          <button
            type="button"
            onClick={() => cambiarVol(-0.1)}
            className="min-h-16 px-4 rounded-2xl flex items-center gap-1 text-xl font-bold"
          >
            <Minus size={24} /> Bajo
          </button>
          <span className="flex-1 text-center text-xl font-extrabold">Volumen {nivel}</span>
          <button
            type="button"
            onClick={() => cambiarVol(0.1)}
            className="min-h-16 px-4 rounded-2xl flex items-center gap-1 text-xl font-bold"
          >
            Alto <Plus size={24} />
          </button>
        </div>

        {sonando ? (
          <BigButton tone="amber" icon={<Square size={28} />} onClick={onParar}>
            Parar
          </BigButton>
        ) : (
          <BigButton tone={dark ? 'night' : 'violet'} icon={<Play size={28} />} onClick={() => onPlay(state)}>
            Escuchar
          </BigButton>
        )}
      </Body>
    </>
  );
}
