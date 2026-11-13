import { Moon, Music, Square, Sun, Wind } from 'lucide-react';
import { useAura } from '../../lib/store';
import { horaSim } from '../../lib/sim';
import type { Sonido } from '../../lib/sound';
import { fraseCama, type Screen, saludo, sonidoLabel } from './helpers';
import { BigButton, Body, IconTile, STROKE, Title, TopBar } from './ui';

/** Night screen: pure black, dim amber moon, ink-2 text — nothing bright. */
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
    <div className="flex flex-1 flex-col min-h-0 bg-black bg-[radial-gradient(circle_at_50%_22%,rgba(255,179,64,0.10),transparent_45%)]">
      <TopBar night leer={`${descansa}. ${frase}.`} />
      <Body className="gap-5">
        <div className="flex flex-col items-center gap-4 pt-2 text-center">
          <Moon
            size={64}
            strokeWidth={1.25}
            className="text-amber/70 fill-amber/20 drop-shadow-[0_0_28px_rgba(255,179,64,0.35)]"
          />
          {live.running && (
            <span className="text-[52px] font-light leading-none tracking-tight text-ink-2 tabular-nums">
              {horaSim(live.minute)}
            </span>
          )}
          <Title night center>
            {descansa}
          </Title>
          <p className="text-[22px] text-ink-3">{frase}</p>
        </div>

        {sonando ? (
          <div className="card flex items-center gap-3 p-3 pl-4">
            <IconTile tint="bg-accent/10 text-accent/70">
              <Music size={22} strokeWidth={STROKE} />
            </IconTile>
            <span className="flex-1 text-[20px] text-ink-2">{sonidoLabel(sonando)}</span>
            <button
              type="button"
              onClick={onParar}
              className="btn min-h-16 px-5 bg-surface-2 text-ink-2 text-[20px]"
            >
              <Square size={20} strokeWidth={STROKE} />
              Parar
            </button>
          </div>
        ) : (
          <BigButton tone="night" icon={<Music size={24} strokeWidth={STROKE} />} onClick={() => go('sonidos')}>
            Sonidos
          </BigButton>
        )}

        <BigButton tone="night" icon={<Wind size={24} strokeWidth={STROKE} />} onClick={() => go('respirar')}>
          Respirar conmigo
        </BigButton>
        <BigButton
          tone="amber"
          icon={<Sun size={24} strokeWidth={STROKE} />}
          onClick={() => (live.running ? levantar() : go('inicio'))}
        >
          Ya me levanté
        </BigButton>
      </Body>
    </div>
  );
}
