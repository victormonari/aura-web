import { FamiliaApp } from '../../components/familia/FamiliaApp';
import { CuidadoraApp } from '../../components/cuidadora/CuidadoraApp';
import { DemoFooter } from '../../components/sim/DemoFooter';
import { Simulator } from '../../components/sim/Simulator';
import { AuraProvider } from '../../lib/store';

export default function DemoPage() {
  return (
    <AuraProvider host>
      <div className="min-h-dvh bg-[#f3f0ff] p-6">
        <header className="mb-6 flex items-center gap-4">
          <img src="/aura-logo.png" alt="Aura" className="h-14" />
          <p className="text-neutral-500">Demo · Aura Rest + Aura TermoSleep + Aura Sensor</p>
        </header>
        <div className="flex flex-wrap items-start justify-center gap-8">
          <section className="flex flex-col items-center gap-2">
            <h2 className="font-bold text-aura-violet">App de quien descansa · /cuidadora</h2>
            <CuidadoraApp />
          </section>
          <section className="w-full max-w-[560px] flex-1">
            <Simulator />
          </section>
          <section className="flex flex-col items-center gap-2">
            <h2 className="font-bold text-blue-700">App de la familia · /familia</h2>
            <FamiliaApp />
          </section>
        </div>
        <DemoFooter />
      </div>
    </AuraProvider>
  );
}
