import clsx from 'clsx';
import { Bluetooth, LogOut, RotateCcw } from 'lucide-react';
import { Fragment, useState } from 'react';
import { sensorSupported } from '../../lib/sensor';
import { useAura } from '../../lib/store';
import { Btn, Eyebrow, SectionTitle, Sep } from './ui';

const ROL: Record<string, string> = {
  cuidadora: 'Cuidadora',
  hijo: 'Familia',
  dependiente: 'Al cuidado',
};

const reglas = (nombre: string) => [
  { label: `Avisarme si ${nombre} duerme poco 2 noches seguidas`, on: true },
  { label: 'Avisarme si quedan turnos libres mañana', on: true },
  { label: 'Resumen semanal los domingos', on: false },
];

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      className={clsx('relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors', on ? 'bg-green' : 'bg-surface-3')}
    >
      <span
        className={clsx(
          'absolute top-[2px] size-[27px] rounded-full bg-white shadow transition-all',
          on ? 'left-[22px]' : 'left-[2px]',
        )}
      />
    </button>
  );
}

export function Config({ onSalir }: { onSalir?: () => void }) {
  const { sensorNombre, conectarSensor, usarSimulado, miembros, resetDemo, cuidadora, familiar } = useAura();
  const nombre = cuidadora?.nombre ?? 'tu familiar';
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);

  const conectar = async () => {
    setError(null);
    if (!sensorSupported()) {
      setError('Este navegador no soporta Bluetooth. Usa Chrome en computador o Android.');
      return;
    }
    setBusy(true);
    try {
      await conectarSensor();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo conectar el Aura Sensor.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Configuración</SectionTitle>

      <Eyebrow className="pt-2">Dispositivos</Eyebrow>
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <img src="/aura-termosleep-simbolo.png" alt="" className="size-9" />
          <div className="flex-1">
            <div className="text-[16px] font-semibold text-ink">Aura TermoSleep</div>
            <div className="text-[13px] text-ink-2">TS-A21</div>
          </div>
          <span className="flex items-center gap-1.5 text-[13px] text-green">
            <span className="size-1.5 rounded-full bg-green" /> conectada ✓
          </span>
        </div>
        <Sep inset={64} />
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <img src="/aura-sensor-simbolo.png" alt="" className="size-9" />
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-ink">Aura Sensor</div>
              <div className={clsx('text-[13px]', sensorNombre ? 'text-green' : 'text-ink-2')}>
                {sensorNombre ? `${sensorNombre} · conectado ✓` : 'Usando pulso simulado'}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {!sensorNombre && (
              <Btn variant="accent" className="flex-1" onClick={() => void conectar()} disabled={busy}>
                <Bluetooth size={16} strokeWidth={1.75} /> {busy ? 'Buscando…' : 'Conectar Aura Sensor'}
              </Btn>
            )}
            <Btn variant="quiet" className={clsx(sensorNombre && 'flex-1')} onClick={usarSimulado}>
              Usar simulado
            </Btn>
          </div>
          {error && <p className="mt-2 text-[13px] text-red">{error}</p>}
        </div>
      </div>

      <Eyebrow className="pt-2">Familia</Eyebrow>
      <div className="card overflow-hidden">
        {miembros.map((m, i) => (
          <Fragment key={m.id}>
            {i > 0 && <Sep inset={60} />}
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-8 place-items-center rounded-full bg-surface-3 text-[14px] font-semibold text-ink">
                {m.nombre.charAt(0)}
              </span>
              <span className="flex-1 text-[16px] text-ink">
                {m.nombre}
                {m.id === familiar?.id && <span className="text-[13px] text-accent"> · tú</span>}
              </span>
              <span className="text-[13px] text-ink-3">{ROL[m.rol] ?? m.rol}</span>
            </div>
          </Fragment>
        ))}
      </div>

      <Eyebrow className="pt-2">Alertas</Eyebrow>
      <div className="card overflow-hidden">
        {reglas(nombre).map((r, i) => (
          <Fragment key={r.label}>
            {i > 0 && <Sep inset={16} />}
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex-1 text-[15px] leading-snug text-ink">{r.label}</span>
              <Toggle initial={r.on} />
            </div>
          </Fragment>
        ))}
      </div>
      <p className="-mt-2 px-1 text-[13px] text-ink-3">Las alertas solo llegan a la familia, nunca a {nombre}.</p>

      <div className="space-y-2 pt-2">
        {onSalir && (
          <Btn variant="quiet" className="w-full py-3" onClick={onSalir}>
            <LogOut size={16} strokeWidth={1.75} /> Cambiar de persona
          </Btn>
        )}
        <Btn
          variant="danger"
          className="w-full py-3"
          disabled={resetting}
          onClick={async () => {
            setResetting(true);
            try {
              await resetDemo();
            } finally {
              setResetting(false);
            }
          }}
        >
          <RotateCcw size={16} strokeWidth={1.75} /> {resetting ? 'Reiniciando…' : 'Reiniciar demo'}
        </Btn>
      </div>
    </div>
  );
}
