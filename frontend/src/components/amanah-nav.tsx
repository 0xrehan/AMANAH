'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  UserRound,
  UserPlus,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const links = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Explore', href: '/explore', icon: Users },
  { label: 'My Connections', href: '/connections', icon: UserPlus },
  { label: 'Community', href: '/feed', icon: MessageSquare },
  { label: 'My Profile', href: '/dashboard#profile', icon: UserRound },
];

export default function AmanahNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    sessionStorage.removeItem('amanah_token');
    router.replace('/login');
  }

  function isActive(href: string) {
    if (href === '/dashboard#profile') return false;
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e9df] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="text-2xl font-extrabold tracking-wide text-[#07543d]">
          AMANAH
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive(href)
                  ? 'bg-[#e8f2eb] text-[#07543d]'
                  : 'text-[#53645a] hover:bg-[#f3f6f1] hover:text-[#07543d]'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-[#e1e7df] px-4 py-2.5 text-sm font-semibold text-[#53645a] transition hover:bg-[#f7f8f5]"
          >
            <LogOut size={17} />
            Log out
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-[#07543d] hover:bg-[#f3f6f1] lg:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#edf0e9] px-4 py-3 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive(href)
                    ? 'bg-[#e8f2eb] text-[#07543d]'
                    : 'text-[#53645a] hover:bg-[#f3f6f1]'
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#9b3939] hover:bg-red-50"
            >
              <LogOut size={19} />
              Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
