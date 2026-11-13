import type { Sonido } from '../../lib/sound';
import type { Live, Miembro, Noche } from '../../lib/types';

export type Screen = 'inicio' | 'durmiendo' | 'sonidos' | 'respirar' | 'buenosdias' | 'descanso';

export const SONIDOS: { kind: Sonido; label: string; emoji: string }[] = [
  { kind: 'lluvia', label: 'Lluvia', emoji: '🌧️' },
  { kind: 'mar', label: 'Mar', emoji: '🌊' },
  { kind: 'ruido', label: 'Ruido suave', emoji: '🍃' },
  { kind: 'musica', label: 'Música', emoji: '🎵' },
];

export const sonidoLabel = (k: Sonido) => SONIDOS.find((s) => s.kind === k)?.label ?? '';

/** Face + phrase for a night. No percentages shown to the cuidadora. */
export function carita(eficiencia: number | null | undefined) {
  const e = Number(eficiencia ?? 0);
  if (e >= 85) return { emoji: '😊', frase: 'Descansaste bien' };
  if (e >= 75) return { emoji: '🙂', frase: 'Descansaste regular' };
  return { emoji: '😟', frase: 'Noche inquieta' };
}

/** 6.5 → "6 horas y media" */
export function horasTexto(h: number | null | undefined) {
  const v = Math.round(Number(h ?? 0) * 2) / 2;
  const ent = Math.floor(v);
  const media = v - ent >= 0.5;
  if (ent === 0) return media ? 'media hora' : 'muy poco';
  const base = ent === 1 ? '1 hora' : `${ent} horas`;
  return media ? `${base} y media` : base;
}

export function vecesTexto(n: number | null | undefined) {
  const v = Number(n ?? 0);
  if (v === 0) return 'No te despertaste en la noche';
  return v === 1 ? 'Te despertaste 1 vez' : `Te despertaste ${v} veces`;
}

/** Warm phrase about the TermoSleep sheet while sleeping. */
export function fraseCama(live: Live) {
  if (live.temp > live.objetivo + 0.3) return 'Tu cama se está refrescando';
  if (live.temp < live.objetivo - 0.3) return 'Tu cama se está entibiando';
  return 'Tu cama está en su punto';
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const diaCorto = (n: Noche) => DIAS[new Date(n.inicio).getDay()];

export function hoyLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "Buenas noches" + ", {nombre}" when the household has a cuidadora. */
export const saludo = (base: string, nombre?: string | null) => (nombre ? `${base}, ${nombre}` : base);

/** Name of the cared-for person for a turno column ('abuela' → matching dependiente). */
export function nombreDependiente(aCargoDe: string, dependientes: Miembro[]) {
  const d = dependientes.find((m) => m.nombre.toLowerCase().includes(aCargoDe.toLowerCase()));
  return d?.nombre ?? aCargoDe.charAt(0).toUpperCase() + aCargoDe.slice(1);
}
