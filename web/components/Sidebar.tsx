'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, History as HistoryIcon, RefreshCcw, LogOut } from 'lucide-react';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const NavItem = ({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon?: IconType;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm
        ${active ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}
      `}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
};

export default function Sidebar({ role = 'Admin' }: { role?: 'Admin' | 'User' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const menu = (
    <nav className="flex flex-col gap-1">
      {role === 'Admin' ? (
        <>
          <NavItem href="/admin" label="Home" icon={HomeIcon} onClick={() => setOpen(false)} />
          <NavItem href="/admin/history" label="History" icon={HistoryIcon} onClick={() => setOpen(false)} />
          <Link
            href="/concerts" 
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Switch to user
          </Link>
        </>
      ) : (
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Switch to Admin
        </Link>
      )}
    </nav>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border px-3 py-2 text-sm"
          aria-label="Open menu"
        >
          ☰
        </button>
        <span className="text-lg font-semibold">{role}</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-slate-200 p-4 md:sticky md:top-0 md:h-[100dvh]">
        <div>
          <div className="mb-6 text-2xl font-semibold">{role}</div>
          {menu}
        </div>

        <div className="mt-auto pt-6">
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:underline">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={`${role} menu`}>
          <button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label="Close menu overlay" />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white p-4 shadow-lg overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-2xl font-semibold">{role}</div>
              <button onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>

            {menu}

            <div className="mt-auto pt-6">
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:underline">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
