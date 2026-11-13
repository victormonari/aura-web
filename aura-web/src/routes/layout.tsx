import { Outlet } from '@modern-js/runtime/router';
import './index.css';

export default function Layout() {
  return (
    <div className="font-sans antialiased">
      <Outlet />
    </div>
  );
}
