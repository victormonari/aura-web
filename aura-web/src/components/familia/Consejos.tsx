import { Check, Info } from 'lucide-react';
import { useState } from 'react';
import { useAura } from '../../lib/store';
import type { Consejo } from '../../lib/types';
import { Btn, Card, SectionTitle } from './ui';

const ACCION_LABEL: Record<Consejo['accion'], string> = {
  ajustar_sabana: 'Aplicar',
  mover_despertar: 'Aplicar',
  tomar_turno: 'Tomar turno',
  conversar: 'Lo haré',
};

export function Consejos() {
  const { consejos, aplicarConsejo, descartarConsejo, cuidadora } = useAura();
  const nombre = cuidadora?.nombre ?? 'tu familiar';
  const [busy, setBusy] = useState<string | null>(null);
  const visibles = consejos.filter((c) => c.estado !== 'descartado');

  const run = async (id: string, fn: () => Promise<void>) => {
    setBusy(id);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle sub={`Según cómo durmió ${nombre} estas noches`}>Consejos</SectionTitle>

      <div className="flex gap-2.5 px-1 text-[13px] leading-snug text-ink-2">
        <Info size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent" />
        <span>
          Estos consejos cambian la sábana o los turnos de la familia. No se le envían a {nombre}: solo
          nota que descansa mejor.
        </span>
      </div>

      {visibles.length === 0 && (
        <Card className="text-[15px] text-ink-2">No hay consejos por ahora. ¡Todo va bien!</Card>
      )}

      {visibles.map((c) => {
        const ok = c.estado === 'aplicado';
        return (
          <Card key={c.id}>
            <div className="text-[17px] font-semibold leading-snug text-ink">{c.titulo}</div>
            {c.motivo && <p className="mt-1 text-[14px] leading-snug text-ink-2">{c.motivo}</p>}
            {ok ? (
              <div className="mt-3 flex items-center gap-1.5 text-[15px] font-semibold text-green">
                <Check size={18} strokeWidth={2.25} /> Aplicado
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <Btn
                  className="flex-1"
                  disabled={busy === c.id}
                  onClick={() => void run(c.id, () => aplicarConsejo(c))}
                >
                  {busy === c.id ? '…' : ACCION_LABEL[c.accion]}
                </Btn>
                <Btn
                  variant="quiet"
                  disabled={busy === c.id}
                  onClick={() => void run(c.id, () => descartarConsejo(c))}
                >
                  Descartar
                </Btn>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
