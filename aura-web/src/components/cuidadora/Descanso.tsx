import { Clock, Heart, Home, Moon, Users } from 'lucide-react';
import { useAura } from '../../lib/store';
import { carita, diaCorto, horasTexto, hoyLocal, nombreDependiente, saludo, vecesTexto } from './helpers';
import { BigButton, Body, IconTile, Separator, STROKE, Title, TopBar } from './ui';

/** "Buenos días" after a night, or "Mi descanso" from Inicio. Passive: nothing to answer. */
export function Descanso({ manana, onBack }: { manana: boolean; onBack: () => void }) {
  const { ultimaNoche, noches, turnos, nombreDe, cuidadora, familiar, dependientes } = useAura();
  const cara = carita(ultimaNoche?.eficiencia);
  const semana = noches.slice(0, 7).reverse();

  const turnoHoy = turnos.find((t) => t.fecha === hoyLocal() && t.a_cargo_de === 'abuela');
  const ayuda =
    turnoHoy?.responsable && turnoHoy.responsable !== cuidadora?.id
      ? `Hoy ${nombreDe(turnoHoy.responsable)} cuida a ${nombreDependiente(turnoHoy.a_cargo_de, dependientes)}`
      : null;

  const titulo = manana ? saludo('Buenos días', cuidadora?.nombre) : 'Mi descanso';
  const lineas = ultimaNoche
    ? [cara.frase, `Dormiste ${horasTexto(ultimaNoche.horas)}`, vecesTexto(ultimaNoche.despertares)]
    : ['Aún no hay noches para mostrar'];
  const leer = [titulo, ...lineas, ayuda].filter(Boolean).join('. ');
  const glow = manana ? 'rgba(255,179,64,0.14)' : 'rgba(125,107,255,0.14)';

  return (
    <div
      className="flex flex-1 flex-col min-h-0"
      style={{ backgroundImage: `radial-gradient(ellipse 80% 40% at 50% 0%, ${glow}, transparent)` }}
    >
      <TopBar onBack={onBack} leer={leer} />
      <Body>
        <Title eyebrow={manana ? 'Anoche' : 'Tu última noche'}>{titulo}</Title>

        {ultimaNoche ? (
          <div className="card overflow-hidden">
            <div className="flex flex-col items-center gap-2 px-5 pt-6 pb-5 text-center">
              <span className="text-[64px] leading-none">{cara.emoji}</span>
              <span className="title-lg">{cara.frase}</span>
            </div>
            <div className="h-px bg-line" />
            <div className="flex items-center gap-4 px-5 py-4">
              <IconTile tint="bg-accent/15 text-accent">
                <Clock size={22} strokeWidth={STROKE} />
              </IconTile>
              <span className="text-[20px]">Dormiste {horasTexto(ultimaNoche.horas)}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-4 px-5 py-4">
              <IconTile tint="bg-amber/15 text-amber">
                <Moon size={22} strokeWidth={STROKE} />
              </IconTile>
              <span className="text-[20px]">{vecesTexto(ultimaNoche.despertares)}</span>
            </div>
          </div>
        ) : (
          <p className="text-[20px] text-ink-2">{lineas[0]}</p>
        )}

        {semana.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="eyebrow px-1">Tu semana</span>
            <div className="card flex justify-between px-3 py-4">
              {semana.map((n) => (
                <div key={n.id} className="flex flex-col items-center gap-2">
                  <span className="text-[28px] leading-none">{carita(n.eficiencia).emoji}</span>
                  <span className="text-[20px] font-medium text-ink-3">{diaCorto(n)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {ayuda && (
          <div className="card flex items-center gap-4 px-5 py-4">
            <IconTile tint="bg-accent/15 text-accent">
              {turnoHoy?.responsable === familiar?.id ? (
                <Heart size={22} strokeWidth={STROKE} />
              ) : (
                <Users size={22} strokeWidth={STROKE} />
              )}
            </IconTile>
            <span className="text-[20px] text-ink-2">{ayuda}</span>
          </div>
        )}

        <BigButton
          tone={manana ? 'primary' : 'quiet'}
          icon={<Home size={22} strokeWidth={STROKE} />}
          onClick={onBack}
        >
          {manana ? 'Ir al inicio' : 'Volver al inicio'}
        </BigButton>
      </Body>
    </div>
  );
}
