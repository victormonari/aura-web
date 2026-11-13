import clsx from 'clsx';
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
    <div className="space-y-3">
      <SectionTitle sub={`Según cómo durmió ${nombre} estas noches`}>Consejos</SectionTitle>
      <div className="flex gap-2 rounded-xl bg-aura-soft/60 p-2 text-[11px] text-aura-violet">
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>
          Estos consejos cambian la sábana o los turnos de la familia. No se le envían a {nombre}: solo
          nota que descansa mejor.
        </span>
      </div>

      {visibles.length === 0 && (
        <Card className="text-sm text-neutral-500">No hay consejos por ahora. ¡Todo va bien!</Card>
      )}

      {visibles.map((c) => {
        const ok = c.estado === 'aplicado';
        return (
          <Card key={c.id} className={clsx(ok && 'border-emerald-200 bg-emerald-50')}>
            <div className="text-sm font-extrabold text-aura-night">{c.titulo}</div>
            {c.motivo && <p className="mt-0.5 text-xs text-neutral-600">{c.motivo}</p>}
            {ok ? (
              <div className="mt-2 flex items-center gap-1 text-sm font-bold text-emerald-700">
                <Check size={16} /> Aplicado
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <Btn
                  className="flex-1"
                  disabled={busy === c.id}
                  onClick={() => void run(c.id, () => aplicarConsejo(c))}
                >
                  {busy === c.id ? '…' : ACCION_LABEL[c.accion]}
                </Btn>
                <Btn
                  variant="ghost"
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
