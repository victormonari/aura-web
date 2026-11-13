import { Home, Moon } from 'lucide-react';
import { useAura } from '../../lib/store';
import { carita, diaCorto, horasTexto, hoyLocal, nombreDependiente, saludo, vecesTexto } from './helpers';
import { BigButton, Body, Title, TopBar } from './ui';

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

  return (
    <>
      <TopBar onBack={onBack} leer={leer} />
      <Body>
        <Title>{titulo}</Title>

        {ultimaNoche ? (
          <div className="rounded-3xl bg-amber-50 p-5 flex flex-col items-center gap-2 text-center">
            <span className="text-[80px] leading-none">{cara.emoji}</span>
            <span className="text-[28px] font-extrabold text-aura-night">{cara.frase}</span>
            <span className="text-xl text-neutral-700">Dormiste {horasTexto(ultimaNoche.horas)}</span>
            <span className="text-xl text-neutral-700">{vecesTexto(ultimaNoche.despertares)}</span>
          </div>
        ) : (
          <p className="text-xl text-neutral-700">{lineas[0]}</p>
        )}

        {semana.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold text-aura-night">Tu semana</span>
            <div className="flex justify-between rounded-3xl bg-aura-soft/60 px-2 py-3">
              {semana.map((n) => (
                <div key={n.id} className="flex flex-col items-center gap-1">
                  <span className="text-[30px] leading-none">{carita(n.eficiencia).emoji}</span>
                  <span className="text-xl font-bold text-aura-night">{diaCorto(n)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {ayuda && (
          <div className="rounded-3xl bg-aura-soft p-4 flex items-center gap-3 text-xl text-aura-night">
            <span className="text-[32px]">{turnoHoy?.responsable === familiar?.id ? '💜' : '🤝'}</span>
            <span>{ayuda}</span>
          </div>
        )}

        <BigButton tone={manana ? 'violet' : 'soft'} icon={manana ? <Home size={28} /> : <Moon size={28} />} onClick={onBack}>
          {manana ? 'Ir al inicio' : 'Volver al inicio'}
        </BigButton>
      </Body>
    </>
  );
}
