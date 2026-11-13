-- Ecosistema Aura · esquema demo (Aura Rest + Aura TermoSleep + Aura Sensor)
-- DEMO ONLY: RLS policies are fully open to the anon key. Do not store real health data.

create extension if not exists pgcrypto;

-- Hogar (una familia)
create table if not exists hogares (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  created_at timestamptz default now()
);

-- Personas del hogar: cuidadora, hijos, abuela, nieto
create table if not exists miembros (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid references hogares(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('cuidadora','hijo','dependiente')),
  created_at timestamptz default now()
);

-- Plan de la sábana Aura TermoSleep (lo edita el hijo/a)
create table if not exists sabana_config (
  hogar_id uuid primary key references hogares(id) on delete cascade,
  modo text not null default 'automatico' check (modo in ('automatico','manual')),
  temp_induccion numeric(4,1) not null default 25.0,
  temp_profundo numeric(4,1) not null default 26.0,
  temp_despertar numeric(4,1) not null default 30.0,
  hora_induccion time not null default '21:30',
  hora_despertar time not null default '05:15',
  preferencia text not null default 'fresca' check (preferencia in ('fresca','normal','tibia')),
  updated_at timestamptz default now()
);

-- Una noche de sueño
create table if not exists noches (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid references hogares(id) on delete cascade,
  inicio timestamptz default now(),
  fin timestamptz,
  estado text not null default 'en_curso' check (estado in ('en_curso','terminada')),
  eficiencia numeric(5,2),          -- % (meta >= 85)
  horas numeric(4,2),
  despertares int,
  latencia_min int,
  pulso_prom int,
  fuente_sensor text default 'simulado' check (fuente_sensor in ('xiaomi','simulado'))
);

-- Lecturas en vivo (Aura Sensor + Aura TermoSleep), ~1 por segundo simulado
create table if not exists lecturas (
  id bigint generated always as identity primary key,
  noche_id uuid references noches(id) on delete cascade,
  ts timestamptz default now(),
  pulso int,
  fase text check (fase in ('despierta','ligero','profundo','rem')),
  temp_actual numeric(4,1),
  temp_objetivo numeric(4,1),
  ruido_db numeric(4,1)
);
create index if not exists lecturas_noche_ts on lecturas(noche_id, ts);

-- Alertas para el hijo/a (nunca para la cuidadora)
create table if not exists alertas (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid references hogares(id) on delete cascade,
  tipo text not null,               -- 'sueno_bajo','sabana_desconectada','sensor_desconectado'
  mensaje text not null,
  leida boolean default false,
  created_at timestamptz default now()
);

-- Consejos que el hijo/a aplica
create table if not exists consejos (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid references hogares(id) on delete cascade,
  titulo text not null,
  motivo text,
  accion text not null check (accion in ('ajustar_sabana','tomar_turno','mover_despertar','conversar')),
  estado text not null default 'pendiente' check (estado in ('pendiente','aplicado','descartado')),
  aplicado_por uuid references miembros(id),
  created_at timestamptz default now()
);

-- Turnos de cuidado (abuela / nieto)
create table if not exists turnos (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid references hogares(id) on delete cascade,
  fecha date not null,
  a_cargo_de text not null check (a_cargo_de in ('abuela','nieto')),
  responsable uuid references miembros(id),   -- null = libre
  unique (hogar_id, fecha, a_cargo_de)
);

-- RLS abierto para demo (anon key)
do $$
declare t text;
begin
  foreach t in array array['hogares','miembros','sabana_config','noches','lecturas','alertas','consejos','turnos'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists demo_all on %I', t);
    execute format('create policy demo_all on %I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Realtime: los dos celulares se sincronizan en vivo
alter publication supabase_realtime add table lecturas, noches, sabana_config, alertas, consejos, turnos;

-- Datos semilla: familia de la demo
insert into hogares (id, nombre) values ('00000000-0000-0000-0000-000000000001', 'Familia de Marta')
  on conflict do nothing;
insert into miembros (id, hogar_id, nombre, rol) values
  ('00000000-0000-0000-0000-0000000000a1','00000000-0000-0000-0000-000000000001','Marta','cuidadora'),
  ('00000000-0000-0000-0000-0000000000b1','00000000-0000-0000-0000-000000000001','Karen','hijo'),
  ('00000000-0000-0000-0000-0000000000b2','00000000-0000-0000-0000-000000000001','Jhon','hijo'),
  ('00000000-0000-0000-0000-0000000000b3','00000000-0000-0000-0000-000000000001','Sebastián','hijo'),
  ('00000000-0000-0000-0000-0000000000c1','00000000-0000-0000-0000-000000000001','Abuela','dependiente'),
  ('00000000-0000-0000-0000-0000000000c2','00000000-0000-0000-0000-000000000001','Tomás','dependiente')
  on conflict do nothing;
insert into sabana_config (hogar_id) values ('00000000-0000-0000-0000-000000000001') on conflict do nothing;

-- Últimas 7 noches (historial para el tablero H1)
insert into noches (hogar_id, inicio, fin, estado, eficiencia, horas, despertares, latencia_min, pulso_prom)
select '00000000-0000-0000-0000-000000000001',
       (current_date - g) + time '21:40', (current_date - g + 1) + time '05:30', 'terminada',
       v.ef, v.h, v.d, v.l, v.p
from (values (7,80,6.5,3,25,66),(6,74,6.0,4,30,67),(5,78,6.3,3,28,65),(4,88,7.1,1,15,62),
             (3,82,6.7,2,20,64),(2,68,5.5,5,40,69),(1,71,5.7,4,35,68)) as v(g,ef,h,d,l,p);

insert into alertas (hogar_id, tipo, mensaje) values
  ('00000000-0000-0000-0000-000000000001','sueno_bajo','Mamá durmió poco 2 noches (68 % y 71 %)');

insert into consejos (hogar_id, titulo, motivo, accion) values
  ('00000000-0000-0000-0000-000000000001','Enfriar la cama 30 min antes','Tarda en dormirse (35 min)','ajustar_sabana'),
  ('00000000-0000-0000-0000-000000000001','Toma el turno de la abuela mañana','Se despertó 2 veces por ella','tomar_turno'),
  ('00000000-0000-0000-0000-000000000001','Adelantar despertar tibio 15 min','Se levanta antes de la alarma','mover_despertar'),
  ('00000000-0000-0000-0000-000000000001','Hablar con ella: café antes de 4 p. m.','Consejo para conversar, no se envía','conversar');

insert into turnos (hogar_id, fecha, a_cargo_de, responsable)
select '00000000-0000-0000-0000-000000000001',
       date_trunc('week', current_date)::date + d,
       t.c,
       ('00000000-0000-0000-0000-' || t.r0)::uuid
from generate_series(0,6) d
cross join lateral (values
  ('abuela', (array['0000000000a1','0000000000b1','0000000000b2',null,'0000000000b1','0000000000a1','0000000000b2'])[d+1]),
  ('nieto',  (array['0000000000a1','0000000000a1','0000000000b3','0000000000b3',null,'0000000000b3','0000000000a1'])[d+1])
) as t(c, r0)
on conflict do nothing;
