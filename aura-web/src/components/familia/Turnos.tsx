import clsx from 'clsx';
import { useAura } from '../../lib/store';
import type { Turno } from '../../lib/types';
import { Card, nombreDependiente, SectionTitle } from './ui';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const KEYS: Turno['a_cargo_de'][] = ['abuela', 'nieto'];

function dia(fecha: string) {
  const d = new Date(`${fecha}T12:00:00`);
  return { nombre: DIAS[d.getDay()], num: d.getDate() };
}

export function Turnos() {
  const { turnos, setTurno, nombreDe, cuidadora, familiar, dependientes } = useAura();
  const COLS = KEYS.map((key, i) => ({ key, label: nombreDependiente(key, i, dependientes) }));
  const nombre = cuidadora?.nombre ?? 'tu familiar';
  const fechas = [...new Set(turnos.map((t) => t.fecha))].sort();
  const hoy = new Date().toLocaleDateString('en-CA');
  const deMama = turnos.filter((t) => t.responsable === cuidadora?.id).length;
  const total = turnos.length || 14;

  const Slot = ({ t }: { t?: Turno }) => {
    if (!t) return <div className="h-10" />;
    if (!t.responsable)
      return (
        <button
          type="button"
          disabled={!familiar}
          onClick={() => familiar && void setTurno(t, familiar.id)}
          className="h-10 w-full rounded-lg border-2 border-dashed border-aura-sensor bg-red-50 text-[11px] font-bold text-aura-sensor active:scale-95"
        >
          Libre · Tomar
        </button>
      );
    const mio = !!familiar && t.responsable === familiar.id;
    const mama = !!cuidadora && t.responsable === cuidadora.id;
    return (
      <button
        type="button"
        disabled={!mio}
        onClick={() => mio && void setTurno(t, null)}
        title={mio ? 'Toca para liberar' : undefined}
        className={clsx(
          'h-10 w-full rounded-lg text-[11px] font-bold',
          mio && 'bg-aura-violet text-white active:scale-95',
          mama && 'bg-aura-amber/20 text-amber-800',
          !mio && !mama && 'bg-neutral-100 text-neutral-600',
        )}
      >
        {mio ? `${familiar?.nombre} ✕` : nombreDe(t.responsable)}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <SectionTitle sub={`Quién cuida a ${COLS.map((c) => c.label).join(' y a ')} cada día`}>Turnos de la semana</SectionTitle>

      <Card>
        <div className="mb-1 flex justify-between text-xs font-bold text-aura-night">
          <span>Turnos de {nombre} esta semana</span>
          <span>
            {deMama} de {total}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100">
          <div
            className={clsx('h-full rounded-full', deMama > total / 2 ? 'bg-aura-sensor' : 'bg-aura-amber')}
            style={{ width: `${(deMama / total) * 100}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-neutral-500">
          Menos turnos para {nombre} = más descanso. Toma los libres que puedas.
        </p>
      </Card>

      <Card className="p-2">
        <div className="grid grid-cols-[52px_1fr_1fr] gap-1.5">
          <div />
          {COLS.map((c) => (
            <div key={c.key} className="text-center text-xs font-extrabold text-aura-night">
              {c.label}
            </div>
          ))}
          {fechas.map((f) => {
            const d = dia(f);
            return (
              <div key={f} className="contents">
                <div
                  className={clsx(
                    'flex flex-col items-center justify-center rounded-lg text-[11px] leading-tight',
                    f === hoy ? 'bg-aura-soft font-extrabold text-aura-violet' : 'text-neutral-600',
                  )}
                >
                  <span className="font-bold">{d.nombre}</span>
                  <span>{d.num}</span>
                </div>
                {COLS.map((c) => (
                  <Slot key={c.key} t={turnos.find((t) => t.fecha === f && t.a_cargo_de === c.key)} />
                ))}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 px-1 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-aura-amber/40" /> {nombre}</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-aura-violet" /> Tú (toca para liberar)</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm border border-dashed border-aura-sensor" /> Libre</span>
        </div>
      </Card>
    </div>
  );
}
