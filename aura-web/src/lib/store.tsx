import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { connectSensor } from './sensor';
import {
  etapaAt,
  faseAt,
  latencia,
  NIGHT_MIN,
  objetivoFor,
  pulsoSimulado,
} from './sim';
import { HOGAR_ID, supabase } from './supabase';
import type {
  Alerta,
  Consejo,
  Escenario,
  Live,
  Miembro,
  Noche,
  SabanaConfig,
  Turno,
} from './types';

/** Seed ids (demo household). Components must NOT use these — use `cuidadora` / `familiar` from the store. */
const SEED_FAMILIAR_ID = '00000000-0000-0000-0000-0000000000b1';

export type Rol = 'cuidadora' | 'familia';

const ME_KEY = (rol: Rol) => `aura:me:${rol}`;

/** Remembered member id for a role on this device (no login — role picker). */
export function getSavedMe(rol: Rol): string | null {
  try {
    return localStorage.getItem(ME_KEY(rol));
  } catch {
    return null;
  }
}
export function saveMe(rol: Rol, id: string | null) {
  try {
    if (id) localStorage.setItem(ME_KEY(rol), id);
    else localStorage.removeItem(ME_KEY(rol));
  } catch {
    /* storage unavailable */
  }
}

/** Simulated minutes advanced per real second. 16 → a night in 30 s. */
export const SPEEDS = [
  { label: '×60', minPerSec: 1 },
  { label: '×240', minPerSec: 4 },
  { label: '×960 (noche en 30 s)', minPerSec: 16 },
];

const TICK_MS = 200;
const TEMP_INICIAL = 28.5;

const initialLive: Live = {
  running: false,
  minute: 0,
  fase: 'despierta',
  etapa: 'induccion',
  pulso: 70,
  temp: TEMP_INICIAL,
  objetivo: 25,
  ruido: 18,
  fuente: 'simulado',
  escenario: 'mala',
  hist: [],
  nochesTerminadas: 0,
};

type Cmd = { type: 'dormir' } | { type: 'levantar' };

export interface AuraStore {
  /** true on the page that runs the simulator (the laptop). */
  host: boolean;
  ready: boolean;
  live: Live;
  config: SabanaConfig | null;
  noches: Noche[]; // terminadas, newest first
  ultimaNoche: Noche | null;
  miembros: Miembro[];
  /** The person who sleeps on Aura TermoSleep (rol 'cuidadora'). */
  cuidadora: Miembro | null;
  /** The family member using the family app on this device (rol 'hijo'). */
  familiar: Miembro | null;
  /** People the family takes turns caring for (rol 'dependiente'). */
  dependientes: Miembro[];
  consejos: Consejo[];
  turnos: Turno[]; // current week, sorted
  alertas: Alerta[]; // unread first, newest first
  // simulator controls (host)
  speed: number;
  setSpeed: (i: number) => void;
  escenarioForzado: Escenario | null;
  setEscenarioForzado: (e: Escenario | null) => void;
  escenarioAuto: Escenario;
  // actions (work from any page; non-host pages forward to host)
  dormir: () => void;
  levantar: () => void;
  updateConfig: (patch: Partial<SabanaConfig>) => Promise<void>;
  aplicarConsejo: (c: Consejo) => Promise<void>;
  descartarConsejo: (c: Consejo) => Promise<void>;
  setTurno: (t: Turno, responsable: string | null) => Promise<void>;
  marcarAlertasLeidas: () => Promise<void>;
  resetDemo: () => Promise<void>;
  // Aura Sensor
  sensorNombre: string | null;
  conectarSensor: () => Promise<void>;
  usarSimulado: () => void;
  nombreDe: (id: string | null) => string;
}

const Ctx = createContext<AuraStore | null>(null);

export function useAura() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useAura must be used inside <AuraProvider>');
  return s;
}

function addMinutes(hhmm: string, delta: number) {
  const [h, m] = hhmm.split(':').map(Number);
  const t = (((h * 60 + m + delta) % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

/** Local calendar date (YYYY-MM-DD), not UTC — Colombia evenings would roll over otherwise. */
export function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AuraProvider({
  host = false,
  familiarId,
  children,
}: {
  host?: boolean;
  /** Selected family member (family app). Defaults to the first one. */
  familiarId?: string | null;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState<Live>(initialLive);
  const [config, setConfig] = useState<SabanaConfig | null>(null);
  const [nochesAll, setNochesAll] = useState<Noche[]>([]);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [consejos, setConsejos] = useState<Consejo[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [speed, setSpeed] = useState(2);
  const [escenarioForzado, setEscenarioForzado] = useState<Escenario | null>(
    null,
  );
  const [sensorNombre, setSensorNombre] = useState<string | null>(null);

  const channel = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const realPulse = useRef<number | null>(null);
  const nightId = useRef<string | null>(null);
  const acc = useRef({ awake: 0, wakes: 0, pulsoSum: 0, ticks: 0, lastFase: 'despierta' as string });
  const liveRef = useRef(live);
  liveRef.current = live;

  // ---------- data loading ----------
  const load = useCallback(async () => {
    const [cfg, n, m, c, t, a] = await Promise.all([
      supabase.from('sabana_config').select('*').eq('hogar_id', HOGAR_ID).single(),
      supabase.from('noches').select('*').eq('hogar_id', HOGAR_ID).order('inicio', { ascending: false }).limit(30),
      supabase.from('miembros').select('id,nombre,rol').eq('hogar_id', HOGAR_ID),
      supabase.from('consejos').select('*').eq('hogar_id', HOGAR_ID).order('created_at'),
      supabase.from('turnos').select('*').eq('hogar_id', HOGAR_ID).order('fecha').order('a_cargo_de'),
      supabase.from('alertas').select('*').eq('hogar_id', HOGAR_ID).order('created_at', { ascending: false }),
    ]);
    if (cfg.data) setConfig(cfg.data as SabanaConfig);
    setNochesAll((n.data ?? []) as Noche[]);
    setMiembros((m.data ?? []) as Miembro[]);
    setConsejos((c.data ?? []) as Consejo[]);
    setTurnos(((t.data ?? []) as Turno[]).slice(-14));
    setAlertas(
      ((a.data ?? []) as Alerta[]).sort((x, y) => Number(x.leida) - Number(y.leida)),
    );
    setReady(true);
  }, []);

  // ---------- realtime ----------
  const hostCmd = useRef<(c: Cmd) => void>(() => {});
  useEffect(() => {
    void load();
    const ch = supabase.channel('aura-live', { config: { broadcast: { self: false } } });
    ch.on('broadcast', { event: 'live' }, ({ payload }) => {
      if (!host) setLive(payload as Live);
    });
    ch.on('broadcast', { event: 'cmd' }, ({ payload }) => {
      if (host) hostCmd.current(payload as Cmd);
    });
    for (const table of ['noches', 'sabana_config', 'alertas', 'consejos', 'turnos']) {
      ch.on('postgres_changes', { event: '*', schema: 'public', table }, () => void load());
    }
    ch.subscribe();
    channel.current = ch;
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [host, load]);

  const noches = useMemo(() => nochesAll.filter((n) => n.estado === 'terminada'), [nochesAll]);
  const ultimaNoche = noches[0] ?? null;
  const cuidadora = miembros.find((m) => m.rol === 'cuidadora') ?? null;
  const familiares = miembros.filter((m) => m.rol === 'hijo');
  const familiar =
    familiares.find((m) => m.id === familiarId) ??
    familiares.find((m) => m.id === SEED_FAMILIAR_ID) ??
    familiares[0] ??
    null;
  const dependientes = miembros.filter((m) => m.rol === 'dependiente');
  const nombreCuidadora = cuidadora?.nombre ?? 'Tu familiar';

  const escenarioAuto: Escenario = consejos.some(
    (c) => c.estado === 'aplicado' && c.accion !== 'conversar',
  )
    ? 'buena'
    : 'mala';

  // ---------- simulator (host only) ----------
  const finishNight = useCallback(async () => {
    const l = liveRef.current;
    const a = acc.current;
    const total = Math.max(l.minute, 1);
    const sleepMin = Math.max(total - a.awake, 0);
    const eficiencia = Math.round((sleepMin / total) * 1000) / 10;
    const row = {
      fin: new Date().toISOString(),
      estado: 'terminada',
      eficiencia,
      horas: Math.round((sleepMin / 60) * 100) / 100,
      despertares: a.wakes,
      latencia_min: latencia(l.escenario),
      pulso_prom: Math.round(a.pulsoSum / Math.max(a.ticks, 1)),
    };
    setLive((p) => ({ ...p, running: false, nochesTerminadas: p.nochesTerminadas + 1 }));
    if (nightId.current) {
      await supabase.from('noches').update(row).eq('id', nightId.current);
    }
    nightId.current = null;
    // Alert the family (never Marta) after two low nights in a row.
    const prev = noches[0];
    if (eficiencia < 75 && prev && Number(prev.eficiencia) < 75) {
      await supabase.from('alertas').insert({
        hogar_id: HOGAR_ID,
        tipo: 'sueno_bajo',
        mensaje: `${nombreCuidadora} durmió poco 2 noches (${Math.round(Number(prev.eficiencia))} % y ${Math.round(eficiencia)} %)`,
      });
    }
    await load();
  }, [load, noches, nombreCuidadora]);

  const dormirHost = useCallback(async () => {
    if (liveRef.current.running) return;
    const escenario = escenarioForzado ?? escenarioAuto;
    acc.current = { awake: 0, wakes: 0, pulsoSum: 0, ticks: 0, lastFase: 'despierta' };
    setLive((p) => ({
      ...initialLive,
      nochesTerminadas: p.nochesTerminadas,
      running: true,
      escenario,
      fuente: realPulse.current ? 'xiaomi' : 'simulado',
      objetivo: objetivoFor('induccion', config),
    }));
    const { data } = await supabase
      .from('noches')
      .insert({ hogar_id: HOGAR_ID, fuente_sensor: realPulse.current ? 'xiaomi' : 'simulado' })
      .select('id')
      .single();
    nightId.current = data?.id ?? null;
  }, [config, escenarioAuto, escenarioForzado]);

  hostCmd.current = (c) => {
    if (c.type === 'dormir') void dormirHost();
    if (c.type === 'levantar' && liveRef.current.running) void finishNight();
  };

  useEffect(() => {
    if (!host || !live.running) return;
    const id = window.setInterval(() => {
      const prev = liveRef.current;
      const step = (SPEEDS[speed].minPerSec * TICK_MS) / 1000;
      const minute = Math.min(prev.minute + step, NIGHT_MIN);
      const fase = faseAt(minute, prev.escenario);
      const etapa = etapaAt(minute);
      const objetivo = objetivoFor(etapa, config);
      const delta = Math.max(Math.min(objetivo - prev.temp, 0.1 * step), -0.1 * step);
      const temp = Math.round((prev.temp + delta) * 100) / 100;
      const pulso = realPulse.current ?? pulsoSimulado(fase, minute);
      const ruido = Math.abs(objetivo - temp) > 0.2 ? 22 + Math.random() * 3 : 17 + Math.random();

      const a = acc.current;
      if (fase === 'despierta') a.awake += step;
      if (fase === 'despierta' && a.lastFase !== 'despierta' && minute > latencia(prev.escenario)) a.wakes++;
      a.lastFase = fase;
      a.pulsoSum += pulso;
      a.ticks++;

      const bucket = Math.floor(minute / 5);
      const newPoint = bucket !== Math.floor(prev.minute / 5) || prev.hist.length === 0;
      const hist = newPoint
        ? [...prev.hist, { m: Math.round(minute), temp, obj: objetivo, pulso, fase }]
        : prev.hist;
      if (newPoint && nightId.current) {
        void supabase.from('lecturas').insert({
          noche_id: nightId.current,
          pulso,
          fase,
          temp_actual: temp,
          temp_objetivo: objetivo,
          ruido_db: Math.round(ruido * 10) / 10,
        });
      }
      const next: Live = {
        ...prev,
        minute,
        fase,
        etapa,
        objetivo,
        temp,
        pulso,
        ruido,
        hist,
        fuente: realPulse.current ? 'xiaomi' : 'simulado',
      };
      setLive(next);
      liveRef.current = next;
      if (minute >= NIGHT_MIN) void finishNight();
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [host, live.running, speed, config, finishNight]);

  // Host broadcasts live state so phones on other devices stay in sync.
  useEffect(() => {
    if (!host) return;
    void channel.current?.send({ type: 'broadcast', event: 'live', payload: live });
  }, [host, live]);

  // ---------- actions ----------
  const send = (c: Cmd) =>
    void channel.current?.send({ type: 'broadcast', event: 'cmd', payload: c });

  const dormir = () => (host ? void dormirHost() : send({ type: 'dormir' }));
  const levantar = () =>
    host ? live.running && void finishNight() : send({ type: 'levantar' });

  const updateConfig = async (patch: Partial<SabanaConfig>) => {
    setConfig((c) => (c ? { ...c, ...patch } : c));
    await supabase
      .from('sabana_config')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('hogar_id', HOGAR_ID);
  };

  const aplicarConsejo = async (c: Consejo) => {
    if (c.accion === 'ajustar_sabana' && config) {
      await updateConfig({
        temp_induccion: Number(config.temp_induccion) - 1,
        hora_induccion: addMinutes(config.hora_induccion, -30),
      });
    }
    if (c.accion === 'mover_despertar' && config) {
      await updateConfig({ hora_despertar: addMinutes(config.hora_despertar, -15) });
    }
    if (c.accion === 'tomar_turno') {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      await supabase
        .from('turnos')
        .upsert(
          { hogar_id: HOGAR_ID, fecha: isoDate(manana), a_cargo_de: 'abuela', responsable: familiar?.id ?? null },
          { onConflict: 'hogar_id,fecha,a_cargo_de' },
        );
    }
    await supabase
      .from('consejos')
      .update({ estado: 'aplicado', aplicado_por: familiar?.id ?? null })
      .eq('id', c.id);
    await load();
  };

  const descartarConsejo = async (c: Consejo) => {
    await supabase.from('consejos').update({ estado: 'descartado' }).eq('id', c.id);
    await load();
  };

  const setTurno = async (t: Turno, responsable: string | null) => {
    setTurnos((ts) => ts.map((x) => (x.id === t.id ? { ...x, responsable } : x)));
    await supabase.from('turnos').update({ responsable }).eq('id', t.id);
  };

  const marcarAlertasLeidas = async () => {
    await supabase.from('alertas').update({ leida: true }).eq('hogar_id', HOGAR_ID);
    await load();
  };

  const resetDemo = async () => {
    // Keep the 7 seeded nights (oldest), drop everything created during the demo.
    const all = [...nochesAll].sort((a, b) => a.inicio.localeCompare(b.inicio));
    const extra = all.slice(7).map((n) => n.id);
    if (extra.length) await supabase.from('noches').delete().in('id', extra);
    await supabase.from('consejos').update({ estado: 'pendiente', aplicado_por: null }).eq('hogar_id', HOGAR_ID);
    await supabase.from('alertas').delete().eq('hogar_id', HOGAR_ID);
    await supabase.from('alertas').insert({
      hogar_id: HOGAR_ID,
      tipo: 'sueno_bajo',
      mensaje: `${nombreCuidadora} durmió poco 2 noches (68 % y 71 %)`,
    });
    await supabase
      .from('sabana_config')
      .update({
        temp_induccion: 25,
        temp_profundo: 26,
        temp_despertar: 30,
        hora_induccion: '21:30',
        hora_despertar: '05:15',
        modo: 'automatico',
      })
      .eq('hogar_id', HOGAR_ID);
    const seed: Record<'abuela' | 'nieto', (string | null)[]> = {
      abuela: ['a1', 'b1', 'b2', null, 'b1', 'a1', 'b2'],
      nieto: ['a1', 'a1', 'b3', 'b3', null, 'b3', 'a1'],
    };
    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const rows = (['abuela', 'nieto'] as const).flatMap((k) =>
      seed[k].map((r, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return {
          hogar_id: HOGAR_ID,
          fecha: isoDate(d),
          a_cargo_de: k,
          responsable: r ? `00000000-0000-0000-0000-0000000000${r}` : null,
        };
      }),
    );
    await supabase.from('turnos').upsert(rows, { onConflict: 'hogar_id,fecha,a_cargo_de' });
    setEscenarioForzado(null);
    setLive((p) => ({ ...initialLive, nochesTerminadas: p.nochesTerminadas }));
    await load();
  };

  const conectarSensor = async () => {
    const name = await connectSensor(
      (bpm) => {
        realPulse.current = bpm;
        if (!liveRef.current.running) setLive((p) => ({ ...p, pulso: bpm, fuente: 'xiaomi' }));
      },
      () => {
        realPulse.current = null;
        setSensorNombre(null);
      },
    );
    setSensorNombre(name);
  };

  const usarSimulado = () => {
    realPulse.current = null;
    setSensorNombre(null);
  };

  const nombreDe = (id: string | null) =>
    id ? (miembros.find((m) => m.id === id)?.nombre ?? '—') : 'Libre';

  const value: AuraStore = {
    host,
    ready,
    live,
    config,
    noches,
    ultimaNoche,
    miembros,
    cuidadora,
    familiar,
    dependientes,
    consejos,
    turnos,
    alertas,
    speed,
    setSpeed,
    escenarioForzado,
    setEscenarioForzado,
    escenarioAuto,
    dormir,
    levantar,
    updateConfig,
    aplicarConsejo,
    descartarConsejo,
    setTurno,
    marcarAlertasLeidas,
    resetDemo,
    sensorNombre,
    conectarSensor,
    usarSimulado,
    nombreDe,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
