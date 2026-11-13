import { useEffect, useState } from 'react';
import { FamiliaApp } from '../../components/familia/FamiliaApp';
import { PersonPicker } from '../../components/roles/PersonPicker';
import { AuraProvider, getSavedMe, saveMe } from '../../lib/store';

export default function FamiliaPage() {
  const [me, setMe] = useState<string | null | undefined>(undefined);
  useEffect(() => setMe(getSavedMe('familia')), []);
  if (me === undefined) return null;
  if (!me) {
    return (
      <PersonPicker
        rol="hijo"
        titulo="¿Quién eres?"
        subtitulo="Elige tu nombre para entrar a Aura Rest Familia"
        onPick={(m) => {
          saveMe('familia', m.id);
          setMe(m.id);
        }}
      />
    );
  }
  return (
    <AuraProvider familiarId={me}>
      <FamiliaApp
        bare
        onSalir={() => {
          saveMe('familia', null);
          setMe(null);
        }}
      />
    </AuraProvider>
  );
}
