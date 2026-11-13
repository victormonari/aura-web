import { Heart, Play } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ETAPA_LABEL, FASE_LABEL, horaSim, NIGHT_MIN } from '../../lib/sim';
import { useAura } from '../../lib/store';
import { AXIS_TICK, Btn, Card, FASE_COLOR, GRID_STROKE, SectionTitle, Tile } from './ui';

export function EnVivo() {
  const { live, dormir, cuidadora } = useAura();
  const xiaomi = live.fuente === 'xiaomi';
  const data = live.hist.map((p) => ({ ...p, hora: horaSim(p.m) }));

  return (
    <div className="space-y-4">
      <SectionTitle
        sub={
          live.running
            ? `Etapa de la sábana: ${ETAPA_LABEL[live.etapa]}`
            : `${cuidadora?.nombre ?? 'Tu familiar'} no está durmiendo ahora`
        }
      >
        En vivo
      </SectionTitle>

      <div className="card p-5">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-red">
          <Heart size={14} strokeWidth={2} className={live.running ? 'animate-pulse fill-current' : 'fill-current'} />
          Pulso
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[48px] font-bold leading-none tracking-tight tabular-nums">
            {Math.round(live.pulso)}
          </span>
          <span className="text-[17px] text-ink-2">lpm</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-ink-3">
          <span className={xiaomi ? 'size-1.5 rounded-full bg-green' : 'size-1.5 rounded-full bg-ink-3'} />
          {xiaomi ? 'Aura Sensor ✓' : 'simulado'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Tile label="Fase" value={FASE_LABEL[live.fase]} size="md" hint={live.running ? 'Del sueño' : '—'} />
        <Tile label="Hora" value={horaSim(live.minute)} size="md" hint="Simulada" />
      </div>

      {!live.running && (
        <Btn variant="accent" className="w-full py-3.5 text-[17px]" onClick={dormir}>
          <Play size={16} className="fill-current" /> Simular noche
        </Btn>
      )}

      <Card>
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-semibold text-ink">Temperatura</span>
          <span className="text-[13px] tabular-nums text-ink-2">
            <span className="text-teal">{live.temp.toFixed(1)}°</span> → {live.objetivo.toFixed(1)}°
          </span>
        </div>
        <div className="mt-3 h-40">
          {data.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 6, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="hora"
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis domain={[22, 32]} ticks={[22, 27, 32]} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#2c2c2e', border: 'none', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#a1a1a6' }}
                  itemStyle={{ color: '#f5f5f7' }}
                />
                <Line dataKey="temp" name="Actual" stroke="#64d2ff" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line
                  dataKey="obj"
                  name="Objetivo"
                  stroke="#ffb340"
                  strokeWidth={1.5}
                  strokeDasharray="3 4"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-[13px] text-ink-3">
              La gráfica aparece cuando empieza la noche.
            </div>
          )}
        </div>
        <div className="mt-2 flex gap-4 text-[12px] text-ink-2">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-teal" /> Actual</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-3 rounded bg-amber" /> Objetivo</span>
        </div>
      </Card>

      <Card>
        <div className="text-[15px] font-semibold text-ink">Fases del sueño</div>
        <div className="relative mt-3 h-7 w-full overflow-hidden rounded-lg bg-surface-2">
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
        <div className="mt-1.5 flex justify-between text-[11px] text-ink-3">
          <span>{horaSim(0)}</span>
          <span>{horaSim(NIGHT_MIN)}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-2">
          {(Object.keys(FASE_LABEL) as (keyof typeof FASE_LABEL)[]).map((f) => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: FASE_COLOR[f] }} />
              {FASE_LABEL[f]}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
