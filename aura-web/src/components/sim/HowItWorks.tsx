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
  const steps = stepsFor(cuidadora ? `${cuidadora.nombre} y su familia` : 'quien descansa y su familia');
  return (
    <div className="card p-4">
      <p className="eyebrow mb-4">Cómo funciona</p>
      <div className="flex items-start justify-between gap-1">
        {steps.map((s, i) => (
          <Fragment key={s.name}>
            {i > 0 && <ChevronRight size={14} strokeWidth={1.75} className="mt-3 shrink-0 text-ink-3" />}
            <div className="flex flex-1 flex-col items-center text-center">
              <img src={s.img} alt="" className="size-9 object-contain" />
              <span className="mt-2 text-[12px] font-semibold leading-tight">{s.name}</span>
              <span className="mt-0.5 text-[11px] leading-tight text-ink-3">{s.what}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
