import clsx from 'clsx';
import { ArrowLeft, Volume2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { speak } from '../../lib/sound';

/** Big full-width button: always icon + word, ≥ 64px tall. */
export function BigButton({
  icon,
  children,
  onClick,
  tone = 'violet',
  className,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
  tone?: 'violet' | 'soft' | 'amber' | 'night' | 'ghost';
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full min-h-16 rounded-3xl px-5 py-4 flex items-center justify-center gap-3',
        'text-[22px] font-extrabold transition active:scale-[0.98]',
        tone === 'violet' && 'bg-aura-violet text-white shadow-lg',
        tone === 'soft' && 'bg-aura-soft text-aura-night',
        tone === 'amber' && 'bg-aura-amber text-aura-night',
        tone === 'night' && 'bg-white/10 text-amber-50 border-2 border-amber-200/30',
        tone === 'ghost' && 'bg-neutral-100 text-neutral-800',
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

/** "Volver" on every sub-screen + optional 🔊 "Leer". */
export function TopBar({
  onBack,
  leer,
  dark = false,
}: {
  onBack?: () => void;
  leer?: string;
  dark?: boolean;
}) {
  const chip = clsx(
    'min-h-14 px-4 rounded-2xl flex items-center gap-2 text-xl font-bold',
    dark ? 'bg-white/10 text-amber-50' : 'bg-aura-soft text-aura-night',
  );
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5">
      {onBack ? (
        <button type="button" onClick={onBack} className={chip}>
          <ArrowLeft size={24} />
          Volver
        </button>
      ) : (
        <img src="/aura-rest-simbolo.png" alt="Aura Rest" className="h-12 w-12" />
      )}
      {leer && (
        <button type="button" onClick={() => speak(leer)} className={chip}>
          <Volume2 size={24} />
          Leer
        </button>
      )}
    </div>
  );
}

export function Title({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <h1
      className={clsx(
        'text-[32px] leading-tight font-extrabold',
        dark ? 'text-amber-50' : 'text-aura-night',
      )}
    >
      {children}
    </h1>
  );
}

/** Scrollable body so it fits both the 360×740 frame and real phones. */
export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('flex-1 overflow-y-auto px-5 pb-6 pt-4 flex flex-col gap-5', className)}>
      {children}
    </div>
  );
}
