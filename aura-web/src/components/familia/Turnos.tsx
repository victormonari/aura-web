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
  const deCuidadora = turnos.filter((t) => t.responsable === cuidadora?.id).length;
  const total = turnos.length || 14;
  const pesada = deCuidadora > total / 2;

  const slot = (t?: Turno) => {
    if (!t) return <div className="h-11" />;
    if (!t.responsable)
      return (
        <button
          type="button"
          disabled={!familiar}
          onClick={() => familiar && void setTurno(t, familiar.id)}
          className="h-11 w-full rounded-xl border border-dashed border-red/60 text-[12px] font-semibold text-red active:scale-95"
        >
          Libre · Tomar
        </button>
      );
    const mio = !!familiar && t.responsable === familiar.id;
    const deElla = !!cuidadora && t.responsable === cuidadora.id;
    return (
      <button
        type="button"
        disabled={!mio}
        onClick={() => mio && void setTurno(t, null)}
        title={mio ? 'Toca para liberar' : undefined}
        className={clsx(
          'flex h-11 w-full items-center justify-center gap-1.5 rounded-xl text-[12px] font-semibold',
          mio ? 'bg-accent/15 text-accent active:scale-95' : 'bg-surface-2 text-ink-2',
        )}
      >
        {deElla && <span className="size-1.5 rounded-full bg-amber" />}
        {mio ? `${familiar?.nombre} ✕` : nombreDe(t.responsable)}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <SectionTitle sub={`Quién cuida a ${COLS.map((c) => c.label).join(' y a ')} cada día`}>Turnos</SectionTitle>

      <Card>
        <div className="text-[13px] font-semibold text-ink-2">Turnos de {nombre} esta semana</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className={clsx('text-[34px] font-bold leading-none tracking-tight tabular-nums', pesada ? 'text-red' : 'text-ink')}>
            {deCuidadora}
          </span>
          <span className="text-[15px] text-ink-2">de {total}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className={clsx('h-full rounded-full transition-all', pesada ? 'bg-red' : 'bg-amber')}
            style={{ width: `${(deCuidadora / total) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[13px] text-ink-3">
          Menos turnos para {nombre} = más descanso. Toma los libres que puedas.
        </p>
      </Card>

      <Card className="p-3">
        <div className="grid grid-cols-[48px_1fr_1fr] gap-2">
          <div />
          {COLS.map((c) => (
            <div key={c.key} className="eyebrow text-center normal-case! tracking-normal! text-[13px]! text-ink-2!">
              {c.label}
            </div>
          ))}
          {fechas.map((f) => {
            const d = dia(f);
            const esHoy = f === hoy;
            return (
              <div key={f} className="contents">
                <div className="flex flex-col items-center justify-center leading-tight">
                  <span className={clsx('text-[11px] font-semibold', esHoy ? 'text-accent' : 'text-ink-3')}>{d.nombre}</span>
                  <span
                    className={clsx(
                      'mt-0.5 grid size-6 place-items-center rounded-full text-[13px] font-semibold tabular-nums',
                      esHoy ? 'bg-accent text-[#0b0820]' : 'text-ink',
                    )}
                  >
                    {d.num}
                  </span>
                </div>
                {COLS.map((c) => (
                  <div key={c.key}>{slot(turnos.find((t) => t.fecha === f && t.a_cargo_de === c.key))}</div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 px-1 text-[12px] text-ink-3">
          <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-amber" /> {nombre}</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-accent/60" /> Tú (toca para liberar)</span>
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm border border-dashed border-red" /> Libre</span>
        </div>
      </Card>
    </div>
  );
}
