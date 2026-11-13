import type { Escenario, Etapa, Fase, SabanaConfig } from './types';

/** A simulated night: 21:40 → 05:40 (480 minutes). */
export const NIGHT_MIN = 480;
export const START_MIN_OF_DAY = 21 * 60 + 40;

interface Plan {
  latencia: number;
  wakes: number[];
  wakeLen: number;
}

// Tuned so a "bad" night lands ~70 % efficiency and a "good" one ~88 %
// (charter goal: >= 85 %).
const PLANS: Record<Escenario, Plan> = {
  mala: { latencia: 38, wakes: [110, 170, 230, 290, 350, 410], wakeLen: 18 },
  buena: { latencia: 20, wakes: [260], wakeLen: 35 },
};

export function latencia(esc: Escenario) {
  return PLANS[esc].latencia;
}

export function faseAt(m: number, esc: Escenario): Fase {
  const p = PLANS[esc];
  if (m < p.latencia) return 'despierta';
  if (p.wakes.some((w) => m >= w && m < w + p.wakeLen)) return 'despierta';
  const c = (m - p.latencia) % 90;
  if (c < 30) return 'ligero';
  if (c < 70) return 'profundo';
  return 'rem';
}

export function etapaAt(m: number): Etapa {
  if (m < 90) return 'induccion';
  if (m >= NIGHT_MIN - 25) return 'despertar';
  return 'profundo';
}

export function objetivoFor(etapa: Etapa, cfg: SabanaConfig | null) {
  if (!cfg) return etapa === 'induccion' ? 25 : etapa === 'profundo' ? 26 : 30;
  if (etapa === 'induccion') return Number(cfg.temp_induccion);
  if (etapa === 'profundo') return Number(cfg.temp_profundo);
  return Number(cfg.temp_despertar);
}

const PULSO_BASE: Record<Fase, number> = {
  despierta: 74,
  ligero: 63,
  profundo: 56,
  rem: 67,
};

export function pulsoSimulado(fase: Fase, m: number) {
  return Math.round(
    PULSO_BASE[fase] + Math.sin(m / 7) * 2 + (Math.random() - 0.5) * 3,
  );
}

export function horaSim(m: number) {
  const total = (START_MIN_OF_DAY + Math.floor(m)) % (24 * 60);
  const h = Math.floor(total / 60);
  const min = total % 60;
  const suf = h >= 12 ? 'p. m.' : 'a. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${suf}`;
}

export const FASE_LABEL: Record<Fase, string> = {
  despierta: 'Despierta',
  ligero: 'Ligero',
  profundo: 'Profundo',
  rem: 'REM',
};

export const ETAPA_LABEL: Record<Etapa, string> = {
  induccion: 'Inducción',
  profundo: 'Profundo',
  despertar: 'Despertar tibio',
};
