import clsx from 'clsx';
import type { ReactNode } from 'react';

/** Phone frame used on the demo page. On /marta and /karen pass `bare` to fill the real screen. */
export function Phone({
  children,
  dark = false,
  bare = false,
}: {
  children: ReactNode;
  dark?: boolean;
  bare?: boolean;
}) {
  if (bare) {
    return (
      <div
        className={clsx(
          'min-h-dvh w-full flex flex-col',
          dark ? 'bg-aura-night text-white' : 'bg-white text-neutral-900',
        )}
      >
        {children}
      </div>
    );
  }
  return (
    <div className="rounded-[48px] border-[10px] border-neutral-900 shadow-2xl bg-neutral-900">
      <div
        className={clsx(
          'relative w-[360px] h-[740px] overflow-hidden rounded-[38px] flex flex-col transition-colors duration-700',
          dark ? 'bg-aura-night text-white' : 'bg-white text-neutral-900',
        )}
      >
        {children}
      </div>
    </div>
  );
}
