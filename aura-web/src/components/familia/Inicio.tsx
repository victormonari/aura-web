import { AlertTriangle, ChevronRight, Moon } from 'lucide-react';
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAura } from '../../lib/store';
import { Btn, Card, SectionTitle, type Tab, Tile, type Tone } from './ui';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const META = 85;

function effTone(e: number): Tone {
  if (e >= META) return 'good';
  if (e >= 75) return 'warn';
  return 'bad';
}

export function Inicio({ go }: { go: (t: Tab) => void }) {
  const { alertas, ultimaNoche: n, noches, live, marcarAlertasLeidas, cuidadora } = useAura();
  const nombre = cuidadora?.nombre ?? 'Tu familiar';
  const sinLeer = alertas.filter((a) => !a.leida);

  const data = noches
    .slice(0, 7)
    .reverse()
    .map((x) => ({
      dia: DIAS[new Date(x.inicio).getDay()],
      ef: Math.round(Number(x.eficiencia ?? 0)),
    }));

  const ef = n ? Math.round(Number(n.eficiencia ?? 0)) : null;
  const horas = n ? Number(n.horas ?? 0) : null;
  const desp = n?.despertares ?? null;
  const pulso = n?.pulso_prom ?? null;

  return (
    <div className="space-y-3">
      {sinLeer.length > 0 && (
        <div className="rounded-2xl bg-aura-sensor p-3 text-white shadow">
          <div className="flex items-start gap-2">
            <AlertTriangle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-extrabold">{sinLeer[0].mensaje}</div>
              <div className="text-xs opacity-90">Revisa los consejos para esta noche.</div>
            </div>
          </div>
          <Btn
            variant="ghost"
            className="mt-2 w-full border-white/40! bg-white! text-aura-sensor!"
            onClick={() => {
              void marcarAlertasLeidas();
              go('consejos');
            }}
          >
            Ver consejos <ChevronRight size={16} />
          </Btn>
        </div>
      )}

      {live.running && (
        <button
          type="button"
          onClick={() => go('vivo')}
          className="flex w-full items-center gap-3 rounded-2xl bg-aura-night p-3 text-left text-white"
        >
          <Moon size={22} className="text-aura-lilac" />
          <div className="flex-1">
            <div className="text-sm font-extrabold">{nombre} está durmiendo</div>
            <div className="text-xs text-aura-lilac">ver en vivo · ♥ {live.pulso} lpm</div>
          </div>
          <ChevronRight size={18} />
        </button>
      )}

      <SectionTitle sub="Datos de Aura Sensor + Aura TermoSleep">Última noche de {nombre}</SectionTitle>
      {n ? (
        <div className="grid grid-cols-2 gap-2">
          <Tile
            label="Eficiencia"
            value={`${ef} %`}
            hint={`meta ≥ ${META} %`}
            tone={effTone(ef ?? 0)}
          />
          <Tile
            label="Horas"
            value={`${horas?.toFixed(1)} h`}
            hint="dormidas"
            tone={horas !== null && horas >= 6.5 ? 'good' : horas !== null && horas >= 5.5 ? 'warn' : 'bad'}
          />
          <Tile
            label="Despertares"
            value={desp ?? '—'}
            hint="en la noche"
            tone={desp !== null && desp <= 1 ? 'good' : desp !== null && desp <= 3 ? 'warn' : 'bad'}
          />
          <Tile label="Pulso prom." value={`${pulso ?? '—'}`} hint="lpm" tone="neutral" />
        </div>
      ) : (
        <Card className="text-sm text-neutral-500">Aún no hay noches registradas.</Card>
      )}

      <Card>
        <div className="mb-1 text-sm font-bold text-aura-night">Eficiencia · últimos 7 días</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="dia" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <ReferenceLine
                y={META}
                stroke="#6741d9"
                strokeDasharray="4 3"
                label={{ value: 'meta 85 %', fontSize: 9, fill: '#6741d9', position: 'insideTopRight' }}
              />
              <Bar dataKey="ef" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {data.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.ef >= META ? '#12b886' : d.ef >= 75 ? '#f59f00' : '#e03131'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
