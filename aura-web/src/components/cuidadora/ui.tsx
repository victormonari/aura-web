import clsx from 'clsx';
import { ChevronLeft, Volume2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { speak } from '../../lib/sound';

export const STROKE = 1.75;

/**
 * Large pill button: always icon + word, ≥ 64px tall.
 * `night` tones avoid bright whites so the screen stays calm while sleeping.
 */
export function BigButton({
  icon,
  children,
  onClick,
  tone = 'primary',
  className,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
  tone?: 'primary' | 'accent' | 'quiet' | 'night' | 'amber';
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'btn w-full min-h-16 px-6 text-[20px]',
        tone === 'primary' && 'btn-primary',
        tone === 'accent' && 'btn-accent',
        tone === 'quiet' && 'btn-quiet',
        tone === 'night' && 'bg-surface text-ink-2 border border-line',
        tone === 'amber' && 'bg-amber/15 text-amber',
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

/** Small tinted rounded square holding an icon (iOS settings style). */
export function IconTile({
  children,
  tint,
  size = 'md',
}: {
  children: ReactNode;
  tint: string; // e.g. 'bg-amber/15 text-amber'
  size?: 'md' | 'lg';
}) {
  return (
    <span
      className={clsx(
        'grid shrink-0 place-items-center rounded-2xl',
        size === 'lg' ? 'size-14' : 'size-12',
        tint,
      )}
    >
      {children}
    </span>
  );
}

/** "Volver" on every sub-screen + optional "Leer" (speaks the screen). */
export function TopBar({
  onBack,
  leer,
  night = false,
}: {
  onBack?: () => void;
  leer?: string;
  night?: boolean;
}) {
  const quiet = night ? 'text-ink-3' : 'text-ink-2';
  return (
    <div className="flex items-center justify-between gap-3 px-3 pt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className={clsx(
            'min-h-16 pl-1 pr-4 flex items-center gap-1 text-[20px] font-medium',
            night ? 'text-ink-2' : 'text-accent',
          )}
        >
          <ChevronLeft size={30} strokeWidth={2} />
          Volver
        </button>
      ) : (
        <span className="flex min-h-16 items-center pl-2">
          <img src="/aura-rest-simbolo.png" alt="Aura Rest" className="size-9 opacity-90" />
        </span>
      )}
      {leer && (
        <button
          type="button"
          onClick={() => speak(leer)}
          className={clsx('min-h-16 px-4 flex items-center gap-2 text-[20px] font-medium', quiet)}
        >
          <Volume2 size={24} strokeWidth={STROKE} />
          Leer
        </button>
      )}
    </div>
  );
}

export function Title({
  children,
  eyebrow,
  night = false,
  center = false,
}: {
  children: ReactNode;
  eyebrow?: string;
  night?: boolean;
  center?: boolean;
}) {
  return (
    <div className={clsx('flex flex-col gap-1', center && 'items-center text-center')}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className={clsx('title-xl', night ? 'text-ink-2' : 'text-ink')}>{children}</h1>
    </div>
  );
}

/** Hairline separator inside grouped lists, inset past the icon. */
export const Separator = () => <div className="ml-[84px] h-px bg-line" />;

/** Scrollable body so it fits both the /demo frame and real phones. */
export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('flex-1 min-h-0 overflow-y-auto px-5 pb-8 pt-2 flex flex-col gap-4 [&>*]:shrink-0', className)}>
      {children}
    </div>
  );
}
