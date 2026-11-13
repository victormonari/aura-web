import clsx from 'clsx';
import type { ReactNode } from 'react';

export type Tab = 'inicio' | 'vivo' | 'sabana' | 'consejos' | 'turnos' | 'config';

/** Inset grouped surface (iOS style). */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('card p-4', className)}>{children}</div>;
}

/** Hairline separator for grouped lists. */
export function Sep({ inset = 0 }: { inset?: number }) {
  return <div className="h-px bg-line" style={{ marginLeft: inset }} />;
}

/** Large iOS-style page title with optional subtitle. */
export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="px-1 pb-1 pt-2">
      <h1 className="title-lg text-ink">{children}</h1>
      {sub && <p className="mt-1 text-[15px] text-ink-2">{sub}</p>}
    </div>
  );
}

/** Small uppercase label above a group. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('eyebrow px-1', className)}>{children}</div>;
}

export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

export const TONE_TEXT: Record<Tone, string> = {
  good: 'text-green',
  warn: 'text-orange',
  bad: 'text-red',
  neutral: 'text-accent',
};

/** Icon in a 15 %-opacity rounded square. */
export function IconBadge({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-[10px]"
      style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
    >
      {children}
    </span>
  );
}

/** Apple Health-like metric: label + big number + unit. */
export function Tile({
  label,
  value,
  unit,
  hint,
  tone,
  icon,
  size = 'lg',
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  size?: 'lg' | 'md';
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-2">
        {tone && <span className={clsx('size-1.5 rounded-full bg-current', TONE_TEXT[tone])} />}
        {icon}
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span
          className={clsx(
            'font-bold tracking-tight text-ink tabular-nums',
            size === 'lg' ? 'text-[34px] leading-none' : 'text-[22px] leading-tight',
          )}
        >
          {value}
        </span>
        {unit && <span className="text-[15px] font-medium text-ink-2">{unit}</span>}
      </div>
      {hint && <div className="mt-1 text-[12px] text-ink-3">{hint}</div>}
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
  variant?: 'primary' | 'accent' | 'quiet' | 'danger';
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'btn px-4 py-2.5 text-[15px] disabled:opacity-40',
        variant === 'primary' && 'btn-primary',
        variant === 'accent' && 'btn-accent',
        variant === 'quiet' && 'btn-quiet',
        variant === 'danger' && 'btn-quiet text-red!',
        className,
      )}
    >
      {children}
    </button>
  );
}

export const FASE_COLOR: Record<string, string> = {
  despierta: '#ff453a',
  ligero: '#c4b8ff',
  profundo: '#7d6bff',
  rem: '#64d2ff',
};

/** Shared recharts styling (dark, minimal). */
export const AXIS_TICK = { fontSize: 11, fill: '#6e6e73' };
export const GRID_STROKE = 'rgba(255,255,255,0.06)';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Display name for a turno column (a_cargo_de): matching dependiente, else same-position one, else the key. */
export function nombreDependiente(key: string, idx: number, dependientes: { nombre: string }[]) {
  const match = dependientes.find((d) => d.nombre.toLowerCase().includes(key.toLowerCase()));
  return match?.nombre ?? dependientes[idx]?.nombre ?? capitalize(key);
}
