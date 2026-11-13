import { Bluetooth, Heart } from 'lucide-react';
import { useState } from 'react';
import { sensorSupported } from '../../lib/sensor';
import { useAura } from '../../lib/store';

export function SensorCard() {
  const { sensorNombre, conectarSensor, usarSimulado, live } = useAura();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const conectar = async () => {
    setError(null);
    if (!sensorSupported()) {
      setError('Este navegador no soporta Bluetooth. Usa Chrome o Edge en computador o Android.');
      return;
    }
    setBusy(true);
    try {
      await conectarSensor();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(
        /cancel/i.test(msg)
          ? 'Conexión cancelada.'
          : `No se pudo conectar: ${msg}. Activa "compartir ritmo cardiaco" en la banda.`,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-red/15">
          <Heart className="size-5 text-red" strokeWidth={1.75} />
        </span>
        <div className="flex-1">
          <p className="text-[17px] font-semibold">Aura Sensor</p>
          <p className="flex items-center gap-1.5 text-[13px] text-ink-2">
            <span className={sensorNombre ? 'size-1.5 rounded-full bg-green' : 'size-1.5 rounded-full bg-ink-3'} />
            {sensorNombre ? `Conectado · ${sensorNombre}` : 'Pulso simulado'}
          </p>
        </div>
        <p className="text-[28px] font-bold leading-none tracking-tight text-red tabular-nums">
          {live.pulso}
          <span className="ml-1 text-[13px] font-semibold text-ink-2">lpm</span>
        </p>
      </div>
      <div className="h-px bg-line" />
      {sensorNombre ? (
        <button
          type="button"
          onClick={usarSimulado}
          className="w-full px-4 py-3.5 text-left text-[15px] text-red active:bg-surface-2"
        >
          Usar simulado
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void conectar()}
          disabled={busy}
          className="flex w-full items-center gap-2 px-4 py-3.5 text-left text-[15px] text-accent active:bg-surface-2 disabled:opacity-50"
        >
          <Bluetooth size={16} strokeWidth={1.75} />
          {busy ? 'Buscando…' : 'Conectar Aura Sensor'}
          <span className="ml-auto text-[12px] text-ink-3">Chrome / Edge</span>
        </button>
      )}
      {error && <p className="px-4 pb-3.5 text-[13px] text-red">{error}</p>}
    </div>
  );
}
