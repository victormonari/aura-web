import { Music, Square, Sun, Wind } from 'lucide-react';
import { useAura } from '../../lib/store';
import type { Sonido } from '../../lib/sound';
import { fraseCama, type Screen, saludo, sonidoLabel } from './helpers';
import { BigButton, Body, Title, TopBar } from './ui';

export function Durmiendo({
  go,
  sonando,
  onParar,
}: {
  go: (s: Screen) => void;
  sonando: Sonido | null;
  onParar: () => void;
}) {
  const { live, levantar, cuidadora } = useAura();
  const descansa = saludo('Descansa', cuidadora?.nombre);
  const frase = live.running ? fraseCama(live) : 'Tu cama se está preparando';

  return (
    <>
      <TopBar dark leer={`${descansa}. ${frase}.`} />
      <Body className="items-stretch">
        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          <div className="text-[88px] leading-none drop-shadow-[0_0_24px_rgba(253,230,138,0.35)]">
            🌙
          </div>
          <Title dark>{descansa}</Title>
          <p className="text-[22px] text-amber-100/90">{frase}</p>
        </div>

        {sonando ? (
          <div className="rounded-3xl bg-white/10 border-2 border-amber-200/20 p-4 flex items-center gap-3">
            <Music size={32} className="text-amber-200 shrink-0" />
            <span className="flex-1 text-xl text-amber-50">
              Suena: <b>{sonidoLabel(sonando)}</b>
            </span>
            <button
              type="button"
              onClick={onParar}
              className="min-h-16 px-4 rounded-2xl bg-amber-200 text-aura-night text-xl font-extrabold flex items-center gap-2"
            >
              <Square size={22} />
              Parar
            </button>
          </div>
        ) : (
          <BigButton tone="night" icon={<Music size={28} />} onClick={() => go('sonidos')}>
            Sonidos
          </BigButton>
        )}

        <BigButton tone="night" icon={<Wind size={28} />} onClick={() => go('respirar')}>
          Respirar conmigo
        </BigButton>
        <BigButton
          tone="amber"
          icon={<Sun size={28} />}
          onClick={() => (live.running ? levantar() : go('inicio'))}
        >
          Ya me levanté
        </BigButton>
      </Body>
    </>
  );
}
