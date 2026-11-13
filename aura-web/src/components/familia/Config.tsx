import clsx from 'clsx';
import { Bluetooth, LogOut, RotateCcw, Users } from 'lucide-react';
import { useState } from 'react';
import { sensorSupported } from '../../lib/sensor';
import { useAura } from '../../lib/store';
import { Btn, Card, SectionTitle } from './ui';

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
      className={clsx('relative h-6 w-11 shrink-0 rounded-full transition', on ? 'bg-aura-violet' : 'bg-neutral-300')}
    >
      <span
        className={clsx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-5.5' : 'left-0.5')}
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
    <div className="space-y-3">
      <SectionTitle>Configuración</SectionTitle>

      <Card className="flex items-center gap-3">
        <img src="/aura-termosleep-simbolo.png" alt="" className="h-9 w-9" />
        <div className="flex-1">
          <div className="text-sm font-extrabold text-aura-night">Aura TermoSleep</div>
          <div className="text-xs text-emerald-700">TS-A21 · conectada ✓</div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <img src="/aura-sensor-simbolo.png" alt="" className="h-9 w-9" />
          <div className="flex-1">
            <div className="text-sm font-extrabold text-aura-night">Aura Sensor</div>
            <div className={clsx('text-xs', sensorNombre ? 'text-emerald-700' : 'text-neutral-500')}>
              {sensorNombre ? `${sensorNombre} · conectado ✓` : 'Usando pulso simulado'}
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          {!sensorNombre && (
            <Btn className="flex-1" onClick={() => void conectar()} disabled={busy}>
              <Bluetooth size={14} /> {busy ? 'Buscando…' : 'Conectar Aura Sensor'}
            </Btn>
          )}
          <Btn variant="ghost" className={clsx(sensorNombre && 'flex-1')} onClick={usarSimulado}>
            Usar simulado
          </Btn>
        </div>
        {error && <p className="mt-2 rounded-lg bg-red-50 p-2 text-xs text-aura-sensor">{error}</p>}
      </Card>

      <Card>
        <div className="mb-2 flex items-center gap-1 text-sm font-bold text-aura-night">
          <Users size={16} /> Familia
        </div>
        <ul className="divide-y divide-neutral-100">
          {miembros.map((m) => (
            <li key={m.id} className="flex items-center gap-2 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-aura-soft text-xs font-extrabold text-aura-violet">
                {m.nombre.charAt(0)}
              </span>
              <span className="flex-1 text-sm">
                {m.nombre}
                {m.id === familiar?.id && <span className="text-[11px] text-aura-violet"> · tú</span>}
              </span>
              <span className="text-[11px] text-neutral-500">{ROL[m.rol] ?? m.rol}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="mb-2 text-sm font-bold text-aura-night">Alertas</div>
        <div className="space-y-2">
          {reglas(nombre).map((r) => (
            <div key={r.label} className="flex items-center gap-2">
              <span className="flex-1 text-xs text-neutral-700">{r.label}</span>
              <Toggle initial={r.on} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-neutral-500">Las alertas solo llegan a la familia, nunca a {nombre}.</p>
      </Card>

      {onSalir && (
        <Btn variant="ghost" className="w-full py-3" onClick={onSalir}>
          <LogOut size={16} /> Cambiar de persona
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
        <RotateCcw size={16} /> {resetting ? 'Reiniciando…' : 'Reiniciar demo'}
      </Btn>
    </div>
  );
}
