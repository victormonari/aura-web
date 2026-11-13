import clsx from 'clsx';
import type { ReactNode } from 'react';

export type Tab = 'inicio' | 'vivo' | 'sabana' | 'consejos' | 'turnos' | 'config';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm', className)}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-2">
      <h2 className="text-lg font-extrabold text-aura-night">{children}</h2>
      {sub && <p className="text-xs text-neutral-500">{sub}</p>}
    </div>
  );
}

export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

const TONE: Record<Tone, string> = {
  good: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warn: 'bg-amber-50 border-amber-200 text-amber-700',
  bad: 'bg-red-50 border-red-200 text-red-700',
  neutral: 'bg-aura-soft/50 border-aura-soft text-aura-violet',
};

export function Tile({
  label,
  value,
  hint,
  tone = 'neutral',
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <div className={clsx('rounded-2xl border p-3', TONE[tone])}>
      <div className="flex items-center gap-1 text-xs font-semibold opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold leading-tight">{value}</div>
      {hint && <div className="text-[11px] opacity-80">{hint}</div>}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-sm font-bold transition active:scale-95 disabled:opacity-50',
        variant === 'primary' && 'bg-aura-violet text-white hover:bg-aura-violet/90',
        variant === 'ghost' && 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50',
        variant === 'danger' && 'bg-aura-sensor text-white hover:bg-aura-sensor/90',
        className,
      )}
    >
      {children}
    </button>
  );
}

export const FASE_COLOR: Record<string, string> = {
  despierta: '#e03131',
  ligero: '#b197fc',
  profundo: '#6741d9',
  rem: '#0c8599',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Display name for a turno column (a_cargo_de): matching dependiente, else same-position one, else the key. */
export function nombreDependiente(key: string, idx: number, dependientes: { nombre: string }[]) {
  const match = dependientes.find((d) => d.nombre.toLowerCase().includes(key.toLowerCase()));
  return match?.nombre ?? dependientes[idx]?.nombre ?? capitalize(key);
}
