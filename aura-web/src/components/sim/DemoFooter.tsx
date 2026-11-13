import { ChevronRight, Moon, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Footer of the demo page: links to the bare phone routes + LAN hint. */
export function DemoFooter() {
  const [base, setBase] = useState('http://<ip>:8080');
  useEffect(() => {
    const { hostname, port, protocol } = window.location;
    const local = hostname === 'localhost' || hostname === '127.0.0.1';
    setBase(local ? `http://<ip>:${port || '8080'}` : `${protocol}//${hostname}${port ? `:${port}` : ''}`);
  }, []);

  return (
    <footer className="mx-auto mt-14 flex max-w-md flex-col items-center gap-4 pb-6 text-center">
      <div className="card w-full overflow-hidden text-left">
        <a href="/cuidadora" className="flex items-center gap-3 px-4 py-3.5 active:bg-surface-2">
          <span className="grid size-8 place-items-center rounded-xl bg-amber/15">
            <Moon className="size-4 text-amber" strokeWidth={1.75} />
          </span>
          <span className="flex-1 text-[15px]">Abrir Aura Rest (quien descansa)</span>
          <ChevronRight className="size-4 text-ink-3" />
        </a>
        <div className="ml-[60px] h-px bg-line" />
        <a href="/familia" className="flex items-center gap-3 px-4 py-3.5 active:bg-surface-2">
          <span className="grid size-8 place-items-center rounded-xl bg-accent/15">
            <Users className="size-4 text-accent" strokeWidth={1.75} />
          </span>
          <span className="flex-1 text-[15px]">Abrir Aura Rest Familia</span>
          <ChevronRight className="size-4 text-ink-3" />
        </a>
      </div>
      <p className="text-[13px] text-ink-2">
        Abre en el celular: <span className="font-mono text-ink">{base}/cuidadora</span> ·{' '}
        <span className="font-mono text-ink">{base}/familia</span>
      </p>
      <p className="text-[12px] text-ink-3">
        Misma red Wi-Fi · &lt;ip&gt; = IP local del portátil (<span className="font-mono">ipconfig getifaddr en0</span>)
      </p>
    </footer>
  );
}
