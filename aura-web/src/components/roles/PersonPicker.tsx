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
    <div className="min-h-dvh bg-[#f3f0ff] flex flex-col items-center px-6 py-10">
      <img src="/aura-logo.png" alt="Aura" className="h-20" />
      <h1 className="mt-8 text-3xl font-extrabold text-center">{titulo}</h1>
      <p className="mt-2 text-lg text-neutral-500 text-center">{subtitulo}</p>
      <div className="mt-8 w-full max-w-sm flex flex-col gap-4">
        {miembros === null && <p className="text-center text-neutral-500">Cargando…</p>}
        {miembros?.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onPick(m)}
            className="min-h-16 rounded-2xl bg-white px-6 py-4 text-left text-2xl font-bold shadow-sm ring-1 ring-aura-soft hover:ring-aura-violet active:scale-[0.99]"
          >
            {m.nombre}
          </button>
        ))}
      </div>
      <a href="/" className="mt-10 text-lg text-aura-violet font-semibold">
        ← Volver
      </a>
    </div>
  );
}
