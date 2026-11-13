import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BigButton, Body, Title, TopBar } from './ui';

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

  return (
    <>
      <TopBar dark onBack={onBack} leer="Respira conmigo. Inhala cuatro segundos, exhala seis." />
      <Body className="items-center text-center">
        <Title dark>Respira conmigo</Title>
        <div className="relative h-64 w-64 flex items-center justify-center">
          <div
            className="absolute rounded-full bg-aura-lilac/30 border-4 border-amber-200/40"
            style={{
              width: grande ? 240 : 110,
              height: grande ? 240 : 110,
              transition: `width ${grande ? INHALA : EXHALA}s ease-in-out, height ${grande ? INHALA : EXHALA}s ease-in-out`,
            }}
          />
          <span className="relative text-[28px] font-extrabold text-amber-50">
            {terminado ? 'Muy bien' : inhala ? 'Inhala…' : 'Exhala…'}
          </span>
        </div>
        <p className="text-xl text-amber-100/90">
          {terminado ? 'Listo, ya puedes descansar' : `Quedan ${restante} segundos`}
        </p>
        <BigButton tone="amber" icon={<Check size={28} />} onClick={onBack}>
          Terminar
        </BigButton>
      </Body>
    </>
  );
}
