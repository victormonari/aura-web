import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BigButton, Body, STROKE, Title, TopBar } from './ui';

const INHALA = 4;
const EXHALA = 6;
const TOTAL = 60;

/** Guided breathing: circle grows 4 s, shrinks 6 s, for 60 s. */
export function Respirar({ onBack }: { onBack: () => void }) {
  const [t, setT] = useState(0); // elapsed seconds
  const [ready, setReady] = useState(false); // start small so the first inhale animates

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setReady(true));
    const id = window.setInterval(() => setT((x) => x + 1), 1000);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  const terminado = t >= TOTAL;
  const ciclo = t % (INHALA + EXHALA);
  const inhala = ciclo < INHALA;
  const restante = Math.max(TOTAL - t, 0);

  // Each phase transition sets the target size; CSS animates over the phase length.
  const grande = ready && inhala && !terminado;

  const dur = grande ? INHALA : EXHALA;

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-black">
      <TopBar night onBack={onBack} leer="Respira conmigo. Inhala cuatro segundos, exhala seis." />
      <Body className="items-center text-center gap-6">
        <Title night center eyebrow="Un minuto">
          Respira conmigo
        </Title>
        <div className="relative size-72 flex items-center justify-center">
          {/* soft glow + thin ring, like Apple Breathe but warmer */}
          <div
            className="absolute rounded-full bg-[radial-gradient(circle,rgba(165,148,255,0.28),rgba(255,179,64,0.08)_70%,transparent)]"
            style={{
              width: grande ? 270 : 120,
              height: grande ? 270 : 120,
              transition: `width ${dur}s ease-in-out, height ${dur}s ease-in-out`,
            }}
          />
          <div
            className="absolute rounded-full border border-accent/30"
            style={{
              width: grande ? 220 : 100,
              height: grande ? 220 : 100,
              transition: `width ${dur}s ease-in-out, height ${dur}s ease-in-out`,
            }}
          />
          <span className="relative text-[28px] font-semibold tracking-tight text-ink-2">
            {terminado ? 'Muy bien' : inhala ? 'Inhala…' : 'Exhala…'}
          </span>
        </div>
        <p className="text-[20px] text-ink-3 tabular-nums">
          {terminado ? 'Listo, ya puedes descansar' : `Quedan ${restante} segundos`}
        </p>
        <BigButton tone="night" icon={<Check size={24} strokeWidth={STROKE} />} onClick={onBack}>
          Terminar
        </BigButton>
      </Body>
    </div>
  );
}
