# Ecosistema Aura

> Quien cuida también merece ser cuidado.

MVP del proyecto de **Gestión Tecnológica** — Especialización en Sistemas Gerenciales de Ingeniería, Pontificia Universidad Javeriana Cali (noviembre 2026).
Equipo: Jaime Guanga, Sebastián Vera y Víctor Morales.

Aura ayuda a una mujer cuidadora de 60 años a descansar sin medicamentos y reparte el cuidado de la casa entre su familia.

| Producto | Qué es | En el MVP |
|---|---|---|
| **Aura Rest** | App de quien descansa: dormir, sonidos, mi descanso. Pasiva, sin mensajes ni alertas. | Real (`/cuidadora`) |
| **Aura Rest Familia** | App de la familia: tablero, sábana, consejos que se aplican, turnos de cuidado. | Real (`/familia`) |
| **Aura TermoSleep** | Sábana termorreguladora (inducción → profundo → despertar tibio). | Simulada |
| **Aura Sensor** | Sensor de pulso. | Xiaomi Smart Band vía Web Bluetooth (Chrome) o simulado |

## Contenido

- `aura-web/` — web app (Modern.js 3 + Rspack, React 19, Tailwind v4, Supabase).
- `aura-web/supabase/migrations/` — esquema de base de datos con datos de ejemplo.
- `AuraRest-mockups.excalidraw` — mockups (abrir en [excalidraw.com](https://excalidraw.com)).
- `logo/` — logo y submarcas (SVG/PNG) y hoja de marca.
- Documentos del curso: trabajo final (.docx), pitch (.pptx), project charter y Gantt (.xlsx).

## Correr local

```bash
cd aura-web
cp .env.example .env   # SUPABASE_URL y SUPABASE_ANON_KEY (publishable key)
pnpm install
pnpm dev               # http://localhost:8080
```

Rutas: `/` elegir rol · `/cuidadora` · `/familia` · `/demo` (presentación: ambas apps + simulador de la sábana).

La noche simulada corre en la página `/demo`; los celulares que abran `/cuidadora` y `/familia` se sincronizan en vivo vía Supabase Realtime.

> Demo académica: las políticas de la base son abiertas. No usar datos reales de salud.
