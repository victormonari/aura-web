import { BarChart3, ChevronRight, Moon, Music, Thermometer } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAura } from '../../lib/store';
import { type Screen, saludo } from './helpers';
import { BigButton, Body, IconTile, Separator, STROKE, Title, TopBar } from './ui';

function Row({
  icon,
  titulo,
  sub,
  onClick,
}: {
  icon: ReactNode;
  titulo: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[84px] flex items-center gap-4 px-5 py-3 text-left active:bg-surface-2"
    >
      {icon}
      <span className="flex-1">
        <span className="block text-[22px] font-semibold leading-tight">{titulo}</span>
        <span className="block text-[20px] text-ink-2">{sub}</span>
      </span>
      <ChevronRight size={22} className="text-ink-3" />
    </button>
  );
}

export function Inicio({ go }: { go: (s: Screen) => void }) {
  const { config, dormir, cuidadora } = useAura();
  const hola = saludo('Buenas noches', cuidadora?.nombre);
  const temp = config ? Number(config.temp_induccion) : 25;
  const estado = `Tu cama está lista · ${temp.toLocaleString('es-CO')} °C`;

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(125,107,255,0.16),transparent)]">
      <TopBar leer={`${hola}. ${estado.replace('·', '.')}`} />
      <Body>
        <Title eyebrow="Esta noche">{hola}</Title>

        {/* Bed status, Apple Health style: label + big number + unit */}
        <div className="card p-5 flex items-center gap-4">
          <IconTile tint="bg-teal/15 text-teal">
            <Thermometer size={24} strokeWidth={STROKE} />
          </IconTile>
          <div className="flex-1">
            <span className="block text-[20px] text-ink-2">Tu cama está lista</span>
            <span className="flex items-baseline gap-1">
              <span className="text-[44px] font-bold leading-none tracking-tight">
                {temp.toLocaleString('es-CO')}
              </span>
              <span className="text-[20px] text-ink-2">°C</span>
            </span>
          </div>
        </div>

        <BigButton
          tone="primary"
          icon={<Moon size={26} strokeWidth={STROKE} />}
          className="min-h-[72px] text-[22px]"
          onClick={() => {
            dormir();
            go('durmiendo');
          }}
        >
          Dormir
        </BigButton>

        <div className="card overflow-hidden">
          <Row
            icon={
              <IconTile tint="bg-accent/15 text-accent">
                <Music size={24} strokeWidth={STROKE} />
              </IconTile>
            }
            titulo="Sonidos"
            sub="Lluvia, mar, música"
            onClick={() => go('sonidos')}
          />
          <Separator />
          <Row
            icon={
              <IconTile tint="bg-amber/15 text-amber">
                <BarChart3 size={24} strokeWidth={STROKE} />
              </IconTile>
            }
            titulo="Mi descanso"
            sub="Cómo dormiste"
            onClick={() => go('descanso')}
          />
        </div>
      </Body>
    </div>
  );
}
