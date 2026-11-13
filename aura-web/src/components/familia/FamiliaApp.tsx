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
      <div className={clsx('relative flex min-h-0 flex-col bg-bg text-ink', bare ? 'h-dvh' : 'flex-1')}>
        <header className="flex items-center gap-2.5 px-5 pb-2 pt-2">
          <img src="/aura-simbolo.png" alt="" className="size-7" />
          <div className="flex-1 leading-tight">
            <div className="text-[15px] font-semibold text-ink">Aura Rest Familia</div>
            <div className="text-[12px] text-ink-3">{familiar?.nombre ?? ''}</div>
          </div>
          {live.running && (
            <span className="flex items-center gap-1.5 rounded-full bg-red/15 px-2.5 py-1 text-[11px] font-semibold text-red">
              <span className="size-1.5 animate-pulse rounded-full bg-red" />
              En vivo
            </span>
          )}
          <button
            type="button"
            aria-label="Configuración"
            onClick={() => setTab('config')}
            className={clsx(
              'grid size-9 place-items-center rounded-full transition',
              tab === 'config' ? 'bg-surface-2 text-ink' : 'text-ink-2 hover:bg-surface',
            )}
          >
            <Settings size={20} strokeWidth={1.75} />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-1">
          {!ready ? (
            <p className="p-8 text-center text-[15px] text-ink-3">Cargando…</p>
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

        <nav className="glass absolute inset-x-0 bottom-0 grid grid-cols-5 border-t border-line border-b-0! pb-5 pt-2">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={clsx(
                'relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors',
                tab === id ? 'text-accent' : 'text-ink-3',
              )}
            >
              <Icon size={22} strokeWidth={1.75} />
              {label}
              {id === 'consejos' && pendientes > 0 && (
                <span className="absolute -top-1 left-1/2 ml-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red px-1 text-[10px] font-semibold text-white">
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
