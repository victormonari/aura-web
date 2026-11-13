import type { ReactNode } from 'react';

/**
 * Phone frame for the /demo page (titanium-like bezel, dynamic island).
 * On /cuidadora and /familia pass `bare` to fill the real device screen.
 * The app is dark-only; `dark` is kept for API compatibility.
 */
export function Phone({
  children,
  bare = false,
}: {
  children: ReactNode;
  dark?: boolean;
  bare?: boolean;
}) {
  if (bare) {
    return <div className="min-h-dvh w-full flex flex-col bg-bg text-ink">{children}</div>;
  }
  return (
    <div className="rounded-[56px] p-[10px] bg-gradient-to-b from-[#3a3a3c] to-[#1c1c1e] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
      <div className="relative w-[360px] h-[760px] overflow-hidden rounded-[46px] flex flex-col bg-bg text-ink">
        <div className="pointer-events-none absolute left-1/2 top-[10px] z-50 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
        <div className="h-[46px] shrink-0" />
        {children}
      </div>
    </div>
  );
}
