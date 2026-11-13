import { useEffect, useRef, useState } from 'react';
import { useAura } from '../../lib/store';
import { playSound, type Sonido, setVolume, stopSound } from '../../lib/sound';
import { Phone } from '../Phone';
import { Descanso } from './Descanso';
import { Durmiendo } from './Durmiendo';
import type { Screen } from './helpers';
import { Inicio } from './Inicio';
import { Respirar } from './Respirar';
import { type SonidoState, Sonidos } from './Sonidos';

/**
 * Caregiver app (cuidadora role, ~60 years old). Passive by design: no messages, alerts or
 * notifications — only big, warm screens driven by the shared store.
 */
export function CuidadoraApp({ bare = false }: { bare?: boolean }) {
  const { live } = useAura();
  const [screen, setScreen] = useState<Screen>('inicio');
  const [sonido, setSonido] = useState<SonidoState>({ kind: 'lluvia', minutos: 30, vol: 0.5 });
  const [sonando, setSonando] = useState<Sonido | null>(null);
  const stopTimer = useRef<number | null>(null);

  // Follow the night even when it is started/ended from the simulator or another device.
  const prev = useRef({ running: live.running, noches: live.nochesTerminadas });
  useEffect(() => {
    const p = prev.current;
    if (live.running && !p.running) setScreen('durmiendo');
    if (!live.running && p.running && live.nochesTerminadas > p.noches) setScreen('buenosdias');
    prev.current = { running: live.running, noches: live.nochesTerminadas };
  }, [live.running, live.nochesTerminadas]);

  const clearTimer = () => {
    if (stopTimer.current) window.clearTimeout(stopTimer.current);
    stopTimer.current = null;
  };

  const play = (s: SonidoState) => {
    playSound(s.kind, s.vol, s.minutos);
    setSonando(s.kind);
    clearTimer();
    // playSound stops itself after the timer; mirror that in the UI.
    stopTimer.current = window.setTimeout(() => setSonando(null), s.minutos * 60_000);
  };

  const parar = () => {
    stopSound();
    clearTimer();
    setSonando(null);
  };

  const cambiarSonido = (s: SonidoState) => {
    if (sonando) setVolume(s.vol);
    setSonido(s);
  };

  useEffect(
    () => () => {
      clearTimer();
      stopSound();
    },
    [],
  );

  // Sub-screens return to the night screen while sleeping, otherwise to Inicio.
  const volver = () => setScreen(live.running ? 'durmiendo' : 'inicio');
  const dark = live.running || screen === 'durmiendo' || screen === 'respirar';

  return (
    <Phone dark={dark} bare={bare}>
      {screen === 'inicio' && <Inicio go={setScreen} />}
      {screen === 'durmiendo' && <Durmiendo go={setScreen} sonando={sonando} onParar={parar} />}
      {screen === 'sonidos' && (
        <Sonidos
          dark={dark}
          state={sonido}
          setState={cambiarSonido}
          sonando={sonando}
          onPlay={play}
          onParar={parar}
          onBack={volver}
        />
      )}
      {screen === 'respirar' && <Respirar onBack={volver} />}
      {(screen === 'buenosdias' || screen === 'descanso') && (
        <Descanso manana={screen === 'buenosdias'} onBack={() => setScreen('inicio')} />
      )}
    </Phone>
  );
}
