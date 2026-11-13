import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HOGAR_ID, supabase } from '../../lib/supabase';
import type { Miembro } from '../../lib/types';

/**
 * No-login identity: the person picks who they are from the household list.
 * The choice is remembered on this device (see saveMe in the store).
 */
export function PersonPicker({
  rol,
  titulo,
  subtitulo,
  onPick,
}: {
  rol: Miembro['rol'];
  titulo: string;
  subtitulo: string;
  onPick: (m: Miembro) => void;
}) {
  const [miembros, setMiembros] = useState<Miembro[] | null>(null);

  useEffect(() => {
    void supabase
      .from('miembros')
      .select('id,nombre,rol')
      .eq('hogar_id', HOGAR_ID)
      .eq('rol', rol)
      .then(({ data }) => setMiembros((data ?? []) as Miembro[]));
  }, [rol]);

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center px-6 pt-20 pb-12">
      <img src="/aura-simbolo.png" alt="" className="size-14" />
      <h1 className="mt-6 title-xl text-center">{titulo}</h1>
      <p className="mt-2 text-[17px] text-ink-2 text-center">{subtitulo}</p>
      <div className="mt-10 w-full max-w-md card overflow-hidden">
        {miembros === null && <p className="px-5 py-5 text-ink-3">Cargando…</p>}
        {miembros?.map((m, i) => (
          <div key={m.id}>
            {i > 0 && <div className="ml-5 h-px bg-line" />}
            <button
              type="button"
              onClick={() => onPick(m)}
              className="flex min-h-16 w-full items-center gap-4 px-5 py-4 text-left active:bg-surface-2"
            >
              <span className="grid size-10 place-items-center rounded-full bg-surface-2 text-[17px] font-semibold">
                {m.nombre.slice(0, 1)}
              </span>
              <span className="flex-1 text-[20px] font-medium">{m.nombre}</span>
              <ChevronRight className="size-5 text-ink-3" />
            </button>
          </div>
        ))}
      </div>
      <a href="/" className="mt-8 text-[17px] text-accent">
        Volver
      </a>
    </div>
  );
}
