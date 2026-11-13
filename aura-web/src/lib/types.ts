export type Fase = 'despierta' | 'ligero' | 'profundo' | 'rem';
export type Etapa = 'induccion' | 'profundo' | 'despertar';
export type Escenario = 'mala' | 'buena';
export type FuenteSensor = 'xiaomi' | 'simulado';

export interface SabanaConfig {
  hogar_id: string;
  modo: 'automatico' | 'manual';
  temp_induccion: number;
  temp_profundo: number;
  temp_despertar: number;
  hora_induccion: string;
  hora_despertar: string;
  preferencia: 'fresca' | 'normal' | 'tibia';
}

export interface Noche {
  id: string;
  inicio: string;
  fin: string | null;
  estado: 'en_curso' | 'terminada';
  eficiencia: number | null;
  horas: number | null;
  despertares: number | null;
  latencia_min: number | null;
  pulso_prom: number | null;
  fuente_sensor: FuenteSensor;
}

export interface Miembro {
  id: string;
  nombre: string;
  rol: 'cuidadora' | 'hijo' | 'dependiente';
}

export interface Consejo {
  id: string;
  titulo: string;
  motivo: string | null;
  accion: 'ajustar_sabana' | 'tomar_turno' | 'mover_despertar' | 'conversar';
  estado: 'pendiente' | 'aplicado' | 'descartado';
}

export interface Turno {
  id: string;
  fecha: string;
  a_cargo_de: 'abuela' | 'nieto';
  responsable: string | null;
}

export interface Alerta {
  id: string;
  tipo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
}

export interface Punto {
  m: number;
  temp: number;
  obj: number;
  pulso: number;
  fase: Fase;
}

export interface Live {
  running: boolean;
  minute: number;
  fase: Fase;
  etapa: Etapa;
  pulso: number;
  temp: number;
  objetivo: number;
  ruido: number;
  fuente: FuenteSensor;
  escenario: Escenario;
  hist: Punto[];
  /** increments each time a night finishes, so remote screens can react */
  nochesTerminadas: number;
}
