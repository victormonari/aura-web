import { CuidadoraApp } from '../../components/cuidadora/CuidadoraApp';
import { FamiliaApp } from '../../components/familia/FamiliaApp';
import { DemoFooter } from '../../components/sim/DemoFooter';
import { Simulator } from '../../components/sim/Simulator';
import { AuraProvider } from '../../lib/store';

export default function DemoPage() {
  return (
    <AuraProvider host>
      <div className="min-h-dvh bg-bg px-8 py-8 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(125,107,255,0.18),transparent)]">
        <header className="mx-auto mb-10 flex max-w-[1400px] items-center justify-between">
          <img src="/aura-logo-blanco.png" alt="Aura" className="h-10" />
          <p className="text-sm text-ink-3">Aura Rest · Aura TermoSleep · Aura Sensor</p>
        </header>
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-center gap-10">
          <section className="flex flex-col items-center gap-4">
            <p className="eyebrow">Quien descansa</p>
            <CuidadoraApp />
          </section>
          <section className="w-full max-w-[560px] flex-1">
            <p className="eyebrow mb-4 text-center">Aura TermoSleep · simulador</p>
            <Simulator />
          </section>
          <section className="flex flex-col items-center gap-4">
            <p className="eyebrow">Familia</p>
            <FamiliaApp />
          </section>
        </div>
        <DemoFooter />
      </div>
    </AuraProvider>
  );
}
