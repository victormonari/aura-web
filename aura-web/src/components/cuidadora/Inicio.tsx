import { Moon, Music, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAura } from '../../lib/store';
import { type Screen, saludo } from './helpers';
import { Body, Title, TopBar } from './ui';

function Card({
  icon,
  titulo,
  sub,
  onClick,
  className,
}: {
  icon: ReactNode;
  titulo: string;
  sub: string;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-24 rounded-3xl px-5 py-4 flex items-center gap-4 text-left transition active:scale-[0.98] ${className}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex flex-col">
        <span className="text-[26px] font-extrabold leading-tight">{titulo}</span>
        <span className="text-xl opacity-80">{sub}</span>
      </span>
    </button>
  );
}

export function Inicio({ go }: { go: (s: Screen) => void }) {
  const { config, dormir, cuidadora } = useAura();
  const hola = saludo('Buenas noches', cuidadora?.nombre);
  const temp = config ? Number(config.temp_induccion) : 25;
  const estado = `Tu cama está lista · ${temp.toLocaleString('es-CO')} °C`;

  return (
    <>
      <TopBar leer={`${hola}. ${estado.replace('·', '.')}`} />
      <Body>
        <div className="flex flex-col gap-2">
          <Title>{hola}</Title>
          <p className="text-xl text-neutral-700 flex items-center gap-2">
            <img src="/aura-termosleep-simbolo.png" alt="" className="h-8 w-8" />
            {estado}
          </p>
        </div>
        <Card
          icon={<Moon size={44} />}
          titulo="Dormir"
          sub="Tu cama se prepara sola"
          onClick={() => {
            dormir();
            go('durmiendo');
          }}
          className="bg-aura-night text-amber-50 shadow-lg"
        />
        <Card
          icon={<Music size={44} />}
          titulo="Sonidos"
          sub="Lluvia, mar, música"
          onClick={() => go('sonidos')}
          className="bg-aura-soft text-aura-night"
        />
        <Card
          icon={<Sun size={44} />}
          titulo="Mi descanso"
          sub="Cómo dormiste"
          onClick={() => go('descanso')}
          className="bg-amber-100 text-aura-night"
        />
      </Body>
    </>
  );
}
