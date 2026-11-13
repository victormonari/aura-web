// Generated sleep sounds (no audio files needed) using Web Audio.
export type Sonido = 'lluvia' | 'mar' | 'ruido' | 'musica';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: AudioNode[] = [];
let timers: number[] = [];

function noiseBuffer(c: AudioContext) {
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function noiseSource(c: AudioContext) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  src.start();
  nodes.push(src);
  return src;
}

export function stopSound() {
  for (const t of timers) clearTimeout(t);
  timers = [];
  for (const n of nodes) {
    try {
      (n as AudioScheduledSourceNode).stop?.();
    } catch {
      /* already stopped */
    }
    n.disconnect();
  }
  nodes = [];
}

export function setVolume(v: number) {
  if (master) master.gain.value = v;
}

export function playSound(kind: Sonido, volume: number, minutes: number) {
  stopSound();
  ctx ??= new AudioContext();
  void ctx.resume();
  const c = ctx;
  master = c.createGain();
  master.gain.value = volume;
  master.connect(c.destination);
  nodes.push(master);

  if (kind === 'ruido') {
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 1200;
    noiseSource(c).connect(f).connect(master);
    nodes.push(f);
  }

  if (kind === 'lluvia') {
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 2500;
    f.Q.value = 0.6;
    noiseSource(c).connect(f).connect(master);
    nodes.push(f);
  }

  if (kind === 'mar') {
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 600;
    const g = c.createGain();
    g.gain.value = 0.5;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.12; // one wave every ~8 s
    const lfoGain = c.createGain();
    lfoGain.gain.value = 0.45;
    lfo.connect(lfoGain).connect(g.gain);
    lfo.start();
    noiseSource(c).connect(f).connect(g).connect(master);
    nodes.push(f, g, lfo, lfoGain);
  }

  if (kind === 'musica') {
    // Slow, soft pad cycling through four chords.
    const chords = [
      [220, 277.2, 329.6],
      [196, 246.9, 293.7],
      [174.6, 220, 261.6],
      [196, 246.9, 329.6],
    ];
    const oscs = [0, 1, 2].map(() => {
      const o = c.createOscillator();
      o.type = 'sine';
      const g = c.createGain();
      g.gain.value = 0.18;
      o.connect(g).connect(master!);
      o.start();
      nodes.push(o, g);
      return o;
    });
    let i = 0;
    const step = () => {
      chords[i % chords.length].forEach((hz, k) =>
        oscs[k].frequency.setTargetAtTime(hz, c.currentTime, 1.2),
      );
      i++;
      timers.push(window.setTimeout(step, 6000));
    };
    step();
  }

  timers.push(window.setTimeout(stopSound, minutes * 60_000));
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-CO';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
