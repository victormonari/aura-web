import { Smartphone } from 'lucide-react';
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
    <footer className="mt-10 flex flex-col items-center gap-2 text-sm text-neutral-600">
      <div className="flex gap-3">
        <a href="/cuidadora" className="flex items-center gap-1 rounded-full bg-white px-4 py-2 font-bold text-aura-violet shadow hover:bg-aura-soft">
          <Smartphone size={16} /> Abrir Aura Rest (quien descansa)
        </a>
        <a href="/familia" className="flex items-center gap-1 rounded-full bg-white px-4 py-2 font-bold text-blue-700 shadow hover:bg-blue-50">
          <Smartphone size={16} /> Abrir Aura Rest Familia
        </a>
      </div>
      <p>
        Abre en el celular: <code className="rounded bg-white px-1.5 py-0.5">{base}/cuidadora</code> ·{' '}
        <code className="rounded bg-white px-1.5 py-0.5">{base}/familia</code>
      </p>
      <p className="text-xs text-neutral-400">
        (misma red Wi-Fi; &lt;ip&gt; = IP local del portátil, p. ej. con <code>ipconfig getifaddr en0</code>)
      </p>
    </footer>
  );
}
