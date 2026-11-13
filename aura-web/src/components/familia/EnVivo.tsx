import { Heart, Play } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ETAPA_LABEL, FASE_LABEL, horaSim, NIGHT_MIN } from '../../lib/sim';
import { useAura } from '../../lib/store';
import { Btn, Card, FASE_COLOR, SectionTitle, Tile } from './ui';

export function EnVivo() {
  const { live, dormir, cuidadora } = useAura();
  const xiaomi = live.fuente === 'xiaomi';
  const data = live.hist.map((p) => ({ ...p, hora: horaSim(p.m) }));

  return (
    <div className="space-y-3">
      <SectionTitle sub={live.running ? `Etapa de la sábana: ${ETAPA_LABEL[live.etapa]}` : `${cuidadora?.nombre ?? 'Tu familiar'} no está durmiendo ahora`}>
        En vivo
      </SectionTitle>

      <div className="grid grid-cols-3 gap-2">
        <Tile
          label="Pulso"
          icon={<Heart size={12} className="fill-current" />}
          value={<span className="text-xl">{Math.round(live.pulso)}</span>}
          hint={xiaomi ? 'lpm · Aura Sensor ✓' : 'lpm · simulado'}
          tone="bad"
        />
        <Tile
          label="Fase"
          value={<span className="text-xl">{FASE_LABEL[live.fase]}</span>}
          hint={live.running ? 'del sueño' : '—'}
        />
        <Tile label="Hora" value={<span className="text-base">{horaSim(live.minute)}</span>} hint="simulada" />
      </div>

      {!live.running && (
        <Btn className="w-full py-3" onClick={dormir}>
          <Play size={16} className="fill-current" /> Simular noche
        </Btn>
      )}

      <Card>
        <div className="mb-1 flex items-center justify-between text-sm font-bold text-aura-night">
          <span>Temperatura de la sábana</span>
          <span className="text-xs font-semibold text-aura-termo">
            {live.temp.toFixed(1)} → {live.objetivo.toFixed(1)} °C
          </span>
        </div>
        <div className="h-36">
          {data.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#f1f3f5" vertical={false} />
                <XAxis dataKey="hora" tick={{ fontSize: 9 }} interval="preserveStartEnd" minTickGap={30} />
                <YAxis domain={[22, 32]} tick={{ fontSize: 10 }} />
                <Line dataKey="temp" name="Actual" stroke="#0c8599" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line dataKey="obj" name="Objetivo" stroke="#f59f00" strokeDasharray="4 3" dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">
              La gráfica aparece cuando empieza la noche.
            </div>
          )}
        </div>
        <div className="mt-1 flex gap-3 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-aura-termo" /> Actual</span>
          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-aura-amber" /> Objetivo</span>
        </div>
      </Card>

      <Card>
        <div className="mb-2 text-sm font-bold text-aura-night">Hipnograma</div>
        <div className="relative h-6 w-full overflow-hidden rounded-md bg-neutral-100">
          {live.hist.map((p, i) => {
            const next = live.hist[i + 1]?.m ?? live.minute;
            return (
              <div
                key={i}
                className="absolute top-0 h-full"
                style={{
                  left: `${(p.m / NIGHT_MIN) * 100}%`,
                  width: `${(Math.max(next - p.m, 1) / NIGHT_MIN) * 100}%`,
                  background: FASE_COLOR[p.fase],
                }}
              />
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
          <span>{horaSim(0)}</span>
          <span>{horaSim(NIGHT_MIN)}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-neutral-600">
          {(Object.keys(FASE_LABEL) as (keyof typeof FASE_LABEL)[]).map((f) => (
            <span key={f} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm" style={{ background: FASE_COLOR[f] }} />
              {FASE_LABEL[f]}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
