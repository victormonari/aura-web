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
    <div className="rounded-2xl border border-aura-sensor/25 bg-[#fff5f5] p-4">
      <div className="flex items-center gap-3">
        <img src="/aura-sensor-simbolo.png" alt="" className="h-10 w-10 object-contain" />
        <div className="flex-1">
          <div className="font-extrabold text-aura-night">Aura Sensor</div>
          <div className="flex items-center gap-1 text-sm text-neutral-600">
            {sensorNombre ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500" /> Conectado: {sensorNombre}
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-neutral-400" /> Usando pulso simulado
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-lg font-extrabold text-aura-sensor">
          <Heart size={18} className="animate-pulse" fill="currentColor" /> {live.pulso}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {sensorNombre ? (
          <button
            type="button"
            onClick={usarSimulado}
            className="flex-1 rounded-xl border-2 border-aura-sensor py-2 text-sm font-bold text-aura-sensor hover:bg-white"
          >
            Usar simulado
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void conectar()}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-aura-sensor py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50"
          >
            <Bluetooth size={16} /> {busy ? 'Buscando…' : 'Conectar Aura Sensor'}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-xs font-semibold text-aura-sensor">{error}</p>}
      {!error && !sensorNombre && (
        <p className="mt-2 text-xs text-neutral-500">Solo Chrome/Edge (Web Bluetooth).</p>
      )}
    </div>
  );
}
