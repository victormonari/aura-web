# Aura demo — brief for parallel agents

Course MVP demo (Gestión Tecnológica, PUJ Cali). Spanish UI. Must be demo-ready in ~1.5 h.
Ecosystem names: **Aura Rest** (app; family app = "Aura Rest Familia"), **Aura TermoSleep** (smart sheet, simulated), **Aura Sensor** (heart-rate band; Xiaomi Band via Web Bluetooth, else simulated).

Visual reference: `../AuraRest-mockups.excalidraw` (screens C1–C6, H1–H6, E1–E5, D1–D2). Logo/palette: `../logo/aura-logos.html`. Static images in `config/public/` (`/aura-logo.png`, `/aura-simbolo.png`, `/aura-rest-simbolo.png`, `/aura-termosleep-simbolo.png`, `/aura-sensor-simbolo.png`, and `-logo` / `-blanco` variants).

## Stack
Modern.js 3.11 (Rspack), React 19, Tailwind v4 (theme tokens in `src/routes/index.css`: `aura-violet #6741d9`, `aura-lilac #b197fc`, `aura-soft #e5dbff`, `aura-amber #f59f00`, `aura-night #25213d`, `aura-termo #0c8599`, `aura-sensor #e03131`; font Nunito), `lucide-react` icons, `recharts`, `clsx`. Supabase already wired.

## Shared contract — DO NOT change without telling the lead
- `src/lib/store.tsx` → `useAura()` gives state + actions (live sim state, config, noches, consejos, turnos, alertas, dormir/levantar, updateConfig, aplicarConsejo, setTurno, resetDemo, conectarSensor…). Read it first.
- `src/lib/sim.ts` (helpers: `horaSim`, `FASE_LABEL`, `ETAPA_LABEL`, `NIGHT_MIN`), `src/lib/sound.ts` (`playSound`, `stopSound`, `setVolume`, `speak`), `src/lib/types.ts`, `src/components/Phone.tsx` (`<Phone dark bare>` frame 360×740).
- Routes: `/` demo (host, 3 columns), `/marta`, `/karen` (bare phones for real devices). Already done in `src/routes/`.
- If you need a new store field/action, add it minimally and mention it in your final report.

## Rules
- Each agent edits ONLY its own folder (below). No new dependencies unless essential.
- Keep each file < ~250 lines; split into small components inside your folder.
- `npx tsc --noEmit -p .` must pass. Dev server already runs at http://localhost:8080 (do not start another; do not kill it).
- Do not run git commands. Do not commit.
- Spanish copy, warm tone, no medical jargon on Marta's side.

## Agent: marta → `src/components/marta/`
Implement `MartaApp({ bare })` (export kept). Caregiver, 60 years old: PASSIVE app. No messages, no alerts, no notifications, nothing to answer.
UX rules: text ≥ 20px, titles ≥ 28px, buttons ≥ 64px tall full-width, max 3 options per screen, icon + word always, "Volver" on every sub-screen, warm night mode (bg `aura-night`, no blue light) while sleeping. Optional 🔊 "Leer" button uses `speak()`.
Screens (internal state machine):
1. **Inicio**: "Buenas noches, Marta", bed status in words ("Tu cama está lista · 25 °C" from config/live), 3 big cards: 🌙 Dormir (calls `dormir()`), 🎵 Sonidos, ☀ Mi descanso.
2. **Durmiendo** (dark): moon, "Descansa, Marta", status phrase from `live.etapa`/temp ("Tu cama se está refrescando" / "Tu cama está en su punto" / "Tu cama se está entibiando"), current sound card with Parar, "Respirar conmigo" button, "Ya me levanté" (`levantar()`). Enter automatically when `live.running` becomes true (even if started from simulator); go to Buenos días when `live.nochesTerminadas` increments.
3. **Sonidos**: 4 tiles (Lluvia, Mar, Ruido suave, Música) → `playSound(kind, vol, minutes)`; timer chips 15/30/60 min (default 30); volume − / + ; Escuchar/Parar.
4. **Respirar** (dark): circle that grows 4 s (Inhala…) / shrinks 6 s (Exhala…), 60 s countdown, Terminar.
5. **Buenos días / Mi descanso**: from `ultimaNoche`: face + phrase (≥85 "😊 Descansaste bien", 75–85 "🙂 Descansaste regular", <75 "😟 Noche inquieta"), "Dormiste X horas", "Te despertaste N veces"; week row of 7 faces (from `noches`), passive line "Hoy {nombre} cuida a la abuela" if today's abuela turno responsable ≠ Marta (use `turnos`, `nombreDe`). No percentages.
Optional if time: C1 primer uso (2 questions) — skip unless done early.

## Agent: karen → `src/components/karen/`
Implement `KarenApp({ bare })`. Family app "Aura Rest Familia" — holds all complexity. Header with `/aura-simbolo.png` + "Aura Rest Familia" + "Karen". Bottom nav 5 tabs: Inicio · En vivo · Sábana · Consejos · Turnos (+ gear icon in header → Configuración).
1. **Inicio (H1)**: red alert banner if unread `alertas` (button "Ver consejos" → tab Consejos, and mark read); 4 tiles from `ultimaNoche` (Eficiencia vs meta ≥85 %, Horas, Despertares, Pulso prom.) color-coded; recharts bar chart of last 7 `noches` eficiencia with 85 % reference line. If `live.running`, a card "Mamá está durmiendo · ver en vivo".
2. **En vivo (H2)**: pulse tile (♥ `live.pulso` lpm, source "Aura Sensor ✓" if `live.fuente==='xiaomi'` else "simulado"), phase tile (`FASE_LABEL`), hour (`horaSim(live.minute)`), recharts line chart of `live.hist` temp vs objetivo, hypnogram strip colored by fase, button "▶ Simular noche" (calls `dormir()`) when not running.
3. **Sábana (H3)**: Aura TermoSleep config: modo Automático/Manual, 3 phase rows (Inducción/Profundo/Despertar tibio) with hour + temp −/+ 0.5 °C (range 13–43) → `updateConfig`; current temp/objetivo/ruido from `live`; "< 30 dB" badge.
4. **Consejos (H4)**: list `consejos`; each card title + motivo + action button ("Aplicar", "Tomar turno", "Lo haré" for conversar) → `aplicarConsejo`; "Descartar" → `descartarConsejo`; applied ones green "✓ Aplicado". Explain these change the sheet/turns, they are not sent to mamá.
5. **Turnos (H5)**: week grid (Lun–Dom × Abuela/Tomás) from `turnos`; free slots red dashed "Libre · Tomar" → `setTurno(t, KAREN_ID)`; Karen's slots tap to release; bar "Turnos de mamá esta semana X de 14".
6. **Configuración (H6)**: Aura TermoSleep "TS-A21 · conectada ✓"; Aura Sensor: `sensorNombre` or buttons "Conectar Aura Sensor" (`conectarSensor`, show error if unsupported) / "Usar simulado"; family list from `miembros`; alert rules (static toggles); button "Reiniciar demo" (`resetDemo`).

## Agent: sim → `src/components/sim/` (+ may polish `src/routes/page.tsx` layout only)
Implement `Simulator()` — center panel of demo page (D2 mockup): title with `/aura-termosleep-simbolo.png` "Simulador Aura TermoSleep"; animated bed visual whose color follows `live.temp` (≤25 blue/teal → 27 neutral → ≥30 amber), microchannel stripes, label of etapa; tiles: Temp actual, Objetivo, Fase, ♥ Pulso, Bomba (dB), Hora sim.; progress bar of the night; speed selector (`SPEEDS`, `speed`, `setSpeed`); scenario selector Auto (shows `escenarioAuto`) / Noche mala / Noche buena (`escenarioForzado`); buttons ▶ Iniciar noche (`dormir`), ■ Terminar (`levantar`), ↺ Reiniciar demo (`resetDemo`); Aura Sensor card: status + "Conectar Aura Sensor" (Web Bluetooth; Chrome only; catch errors) / "Usar simulado"; small "Cómo funciona" flow (Aura Sensor → Motor Aura Rest → Aura TermoSleep → Apps). Also add a footer on `/` with links to `/marta` and `/karen` and the LAN hint "abre en el celular: http://<ip>:8080/marta".

## UPDATE 2 — apps are per ROLE, not per person (read this, it overrides names above)
Real product: no app is "Marta's" or "Karen's". Any household, any names.
- Folders renamed: `src/components/marta/` → `src/components/cuidadora/` (export `CuidadoraApp`), `src/components/karen/` → `src/components/familia/` (export `FamiliaApp`).
- Routes now: `/` role chooser (done), `/cuidadora` (person picker → CuidadoraApp bare), `/familia` (person picker → `FamiliaApp bare onSalir`), `/demo` (old 3-column host page). Done by lead in `src/routes/`.
- Store: `MARTA_ID` / `KAREN_ID` REMOVED. Use `cuidadora` (Miembro of the person who sleeps), `familiar` (Miembro using the family app on this device), `dependientes` (people cared for, e.g. abuela/nieto) and `nombreDe(id)` from `useAura()`.
- NO hardcoded names anywhere: no "Marta", "Karen", "Mamá", "Tomás", "abuela" as a person name. Use `cuidadora.nombre`, `familiar.nombre`. Family copy refers to the cared-for person by name ("Marta durmió poco" comes from data), not "Mamá". For turno columns use `dependientes` names (turno.a_cargo_de 'abuela' → first dependiente whose name matches, else capitalize a_cargo_de).
- `FamiliaApp` props: `{ bare?: boolean; onSalir?: () => void }` — show "Cambiar de persona" (calls onSalir) in Configuración when provided.
- Turnos "Tomar": `setTurno(t, familiar.id)`; "mine" = responsable === familiar.id; "cuidadora's load" = responsable === cuidadora.id.
- Demo page labels already generic. Sim/footer links must point to `/cuidadora` and `/familia` (and `/demo` is the page itself).

## UPDATE 3 — Dark, Apple-like redesign (overrides all visual rules above)
Goal: minimal, elegant, premium dark UI in the spirit of iOS / Apple Health / Apple Sleep. Less color, more space, perfect typography.
Design system already in `src/routes/index.css` (read it): tokens `bg` (#000), `surface` (#1c1c1e), `surface-2` (#2c2c2e), `surface-3`, `line` (hairline), `ink` / `ink-2` / `ink-3` (text), accents `accent` (Aura violet #a594ff), `amber` (moon), `teal` (TermoSleep), `red` (Sensor/alerts), `green`, `orange`. Utility classes: `.card` (grouped surface, 22px radius, hairline), `.card-2`, `.glass` (frosted bar), `.eyebrow` (small uppercase label), `.title-xl` (34px), `.title-lg` (28px), `.btn` + `.btn-primary` (white pill) / `.btn-accent` / `.btn-quiet`. Font: SF Pro system stack (already `font-sans`).
Rules:
- Pure dark everywhere (`bg-bg text-ink`). No light backgrounds, no pastel blocks, no colored full-card fills. Color only as small accents: icon tints in a 15%-opacity rounded square (e.g. `bg-amber/15 text-amber`), status dots, numbers, chart strokes.
- iOS patterns: inset grouped lists with hairline separators (`h-px bg-line`), large titles, SF-like weights (semibold 600 / bold 700, tracking-tight on big numbers), pill buttons, frosted tab bar (`.glass`) with thin icons (lucide strokeWidth 1.75) and 10–11px labels.
- Generous spacing (px-5, gap-3/4), 22px card radius, no heavy shadows, no borders except hairlines.
- Logos on dark: use `/aura-logo-blanco.png`, `/aura-rest-logo-blanco.png`, etc.; symbols (`/aura-simbolo.png`…) work on dark.
- Big metrics like Apple Health: label (`.eyebrow` or 13px ink-2) + large number (34–48px bold) + unit (ink-2).
- Recharts: no grid or very faint (`stroke rgba(255,255,255,0.06)`), axis ticks `#6e6e73` 11px, no axis lines, rounded bars, accent/teal strokes, dark tooltip.
- The phone frame already adds a 46px status-bar spacer on /demo; inside, start content directly (no extra top padding beyond ~8px).
- Keep all existing behavior, data wiring and store usage. Keep caregiver accessibility (text ≥ 20px, targets ≥ 64px, max 3 options, icon + word) — elegant but large: think Apple "Sleep" bedtime screen, very calm, mostly black with a soft amber/violet glow.
- Caregiver night mode: pure black, dim amber moon, ink-2 text, no bright whites (use ink-2) to protect sleep.
