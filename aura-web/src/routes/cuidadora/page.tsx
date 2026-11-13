import { useEffect, useState } from 'react';
import { CuidadoraApp } from '../../components/cuidadora/CuidadoraApp';
import { PersonPicker } from '../../components/roles/PersonPicker';
import { AuraProvider, getSavedMe, saveMe } from '../../lib/store';

export default function CuidadoraPage() {
  const [me, setMe] = useState<string | null | undefined>(undefined);
  useEffect(() => setMe(getSavedMe('cuidadora')), []);
  if (me === undefined) return null;
  if (!me) {
    return (
      <PersonPicker
        rol="cuidadora"
        titulo="¿Quién eres?"
        subtitulo="Toca tu nombre"
        onPick={(m) => {
          saveMe('cuidadora', m.id);
          setMe(m.id);
        }}
      />
    );
  }
  return (
    <AuraProvider>
      <CuidadoraApp bare />
    </AuraProvider>
  );
}
