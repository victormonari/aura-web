import { AlertTriangle, ChevronRight, Moon } from 'lucide-react';
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAura } from '../../lib/store';
import { AXIS_TICK, Btn, Card, Eyebrow, IconBadge, SectionTitle, type Tab, Tile, type Tone } from './ui';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const META = 85;
const TONE_HEX: Record<Tone, string> = { good: '#30d158', warn: '#ff9f0a', bad: '#ff453a', neutral: '#a594ff' };

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
    <div className="space-y-4">
      <SectionTitle sub="Datos de Aura Sensor y Aura TermoSleep">Resumen</SectionTitle>

      {sinLeer.length > 0 && (
        <Card>
          <div className="flex items-start gap-3">
            <IconBadge color="#ff453a">
              <AlertTriangle size={18} strokeWidth={1.75} />
            </IconBadge>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-ink">{sinLeer[0].mensaje}</div>
              <div className="mt-0.5 text-[13px] text-ink-2">Revisa los consejos para esta noche.</div>
            </div>
          </div>
          <Btn
            className="mt-3 w-full"
            onClick={() => {
              void marcarAlertasLeidas();
              go('consejos');
            }}
          >
            Ver consejos
          </Btn>
        </Card>
      )}

      {live.running && (
        <button
          type="button"
          onClick={() => go('vivo')}
          className="card flex w-full items-center gap-3 p-4 text-left active:bg-surface-2"
        >
          <IconBadge color="#ffb340">
            <Moon size={18} strokeWidth={1.75} />
          </IconBadge>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-ink">{nombre} está durmiendo</div>
            <div className="text-[13px] text-ink-2">
              Ver en vivo · <span className="text-red">♥ {live.pulso}</span> lpm
            </div>
          </div>
          <ChevronRight size={18} className="text-ink-3" />
        </button>
      )}

      <Eyebrow className="pt-2">Última noche de {nombre}</Eyebrow>
      {n ? (
        <div className="grid grid-cols-2 gap-3">
          <Tile label="Eficiencia" value={ef} unit="%" hint={`Meta ≥ ${META} %`} tone={effTone(ef ?? 0)} />
          <Tile
            label="Horas"
            value={horas?.toFixed(1)}
            unit="h"
            hint="Dormidas"
            tone={horas !== null && horas >= 6.5 ? 'good' : horas !== null && horas >= 5.5 ? 'warn' : 'bad'}
          />
          <Tile
            label="Despertares"
            value={desp ?? '—'}
            hint="En la noche"
            tone={desp !== null && desp <= 1 ? 'good' : desp !== null && desp <= 3 ? 'warn' : 'bad'}
          />
          <Tile label="Pulso prom." value={pulso ?? '—'} unit="lpm" hint="Aura Sensor" />
        </div>
      ) : (
        <Card className="text-[15px] text-ink-2">Aún no hay noches registradas.</Card>
      )}

      <Card>
        <div className="flex items-baseline justify-between">
          <div className="text-[15px] font-semibold text-ink">Eficiencia</div>
          <div className="text-[12px] text-ink-3">Últimos 7 días</div>
        </div>
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 0, left: -28, bottom: 0 }}>
              <XAxis dataKey="dia" tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <YAxis domain={[50, 100]} ticks={[50, 75, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} />
              <ReferenceLine
                y={META}
                stroke="rgba(255,255,255,0.35)"
                strokeDasharray="3 4"
                label={{ value: `Meta ${META} %`, fontSize: 10, fill: '#a1a1a6', position: 'insideTopRight' }}
              />
              <Bar dataKey="ef" radius={[6, 6, 6, 6]} barSize={18} isAnimationActive={false}>
                {data.map((d, i) => (
                  <Cell key={i} fill={TONE_HEX[effTone(d.ef)]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
