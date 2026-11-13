import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { useAura } from '../../lib/store';

const stepsFor = (apps: string) => [
  { img: '/aura-sensor-simbolo.png', name: 'Aura Sensor', what: 'mide el pulso' },
  { img: '/aura-rest-simbolo.png', name: 'Motor Aura Rest', what: 'detecta la fase' },
  { img: '/aura-termosleep-simbolo.png', name: 'Aura TermoSleep', what: 'ajusta la temperatura' },
  { img: '/aura-simbolo.png', name: 'Apps', what: apps },
];

export function HowItWorks() {
  const { cuidadora } = useAura();
  const STEPS = stepsFor(cuidadora ? `${cuidadora.nombre} y su familia` : 'quien descansa y su familia');
  return (
    <div className="rounded-2xl bg-[#f8f6ff] p-4">
      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-aura-violet">Cómo funciona</h3>
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((s, i) => (
          <Fragment key={s.name}>
            {i > 0 && <ChevronRight size={18} className="shrink-0 text-aura-lilac" />}
            <div className="flex flex-1 flex-col items-center text-center">
              <img src={s.img} alt="" className="h-9 w-9 object-contain" />
              <span className="mt-1 text-xs font-bold leading-tight text-aura-night">{s.name}</span>
              <span className="text-[11px] leading-tight text-neutral-500">{s.what}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
