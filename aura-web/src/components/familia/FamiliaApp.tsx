import clsx from 'clsx';
import { CalendarDays, Home, Lightbulb, Radio, Settings, Thermometer } from 'lucide-react';
import { useState } from 'react';
import { useAura } from '../../lib/store';
import { Phone } from '../Phone';
import { Config } from './Config';
import { Consejos } from './Consejos';
import { EnVivo } from './EnVivo';
import { Inicio } from './Inicio';
import { Sabana } from './Sabana';
import { Turnos } from './Turnos';
import type { Tab } from './ui';

const NAV: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'vivo', label: 'En vivo', icon: Radio },
  { id: 'sabana', label: 'Sábana', icon: Thermometer },
  { id: 'consejos', label: 'Consejos', icon: Lightbulb },
  { id: 'turnos', label: 'Turnos', icon: CalendarDays },
];

/** Family app "Aura Rest Familia" (any family member): dashboards, sheet config, advice and shifts. */
export function FamiliaApp({ bare = false, onSalir }: { bare?: boolean; onSalir?: () => void }) {
  const [tab, setTab] = useState<Tab>('inicio');
  const { ready, consejos, live, familiar } = useAura();
  const pendientes = consejos.filter((c) => c.estado === 'pendiente').length;

  return (
    <Phone bare={bare}>
      <div className={clsx('flex flex-col bg-neutral-50', bare ? 'h-dvh' : 'h-full')}>
        <header className="flex items-center gap-2 border-b border-neutral-200 bg-white px-4 pb-2 pt-4">
          <img src="/aura-simbolo.png" alt="" className="h-8 w-8" />
          <div className="flex-1 leading-tight">
            <div className="text-sm font-extrabold text-aura-violet">Aura Rest Familia</div>
            <div className="text-xs text-neutral-500">{familiar?.nombre ?? ''}</div>
          </div>
          {live.running && (
            <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-aura-sensor">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aura-sensor" />
              EN VIVO
            </span>
          )}
          <button
            type="button"
            aria-label="Configuración"
            onClick={() => setTab('config')}
            className={clsx(
              'rounded-full p-2 hover:bg-aura-soft',
              tab === 'config' ? 'bg-aura-soft text-aura-violet' : 'text-neutral-500',
            )}
          >
            <Settings size={20} />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-3">
          {!ready ? (
            <p className="p-6 text-center text-sm text-neutral-500">Cargando…</p>
          ) : (
            <>
              {tab === 'inicio' && <Inicio go={setTab} />}
              {tab === 'vivo' && <EnVivo />}
              {tab === 'sabana' && <Sabana />}
              {tab === 'consejos' && <Consejos />}
              {tab === 'turnos' && <Turnos />}
              {tab === 'config' && <Config onSalir={onSalir} />}
            </>
          )}
        </main>

        <nav className="grid grid-cols-5 border-t border-neutral-200 bg-white pb-2 pt-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={clsx(
                'relative flex flex-col items-center gap-0.5 py-1 text-[10px] font-bold',
                tab === id ? 'text-aura-violet' : 'text-neutral-400',
              )}
            >
              <Icon size={20} />
              {label}
              {id === 'consejos' && pendientes > 0 && (
                <span className="absolute right-3 top-0 rounded-full bg-aura-sensor px-1.5 text-[9px] text-white">
                  {pendientes}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </Phone>
  );
}
