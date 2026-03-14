import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../utils/theme-context';

function SunIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <title>Sun</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <title>Moon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );
}

function SystemIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <title>System</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v-1.013a2.25 2.25 0 00-.75-2.25H3.75a2.25 2.25 0 00-2.25 2.25v.013A2.25 2.25 0 003 18.25v1.5A2.25 2.25 0 005.25 22h13.5A2.25 2.25 0 0021 19.75v-1.5a2.25 2.25 0 00-.75-1.637 2.25 2.25 0 00-.75-2.25H9.75a2.25 2.25 0 00-.75 2.25zM6 6.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75A.75.75 0 013.75 3h1.5a.75.75 0 01.75.75v2.25zm0 9a.75.75 0 01.75.75h1.5a.75.75 0 01.75-.75v-2.25a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v2.25zm9-9a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v2.25a.75.75 0 00.75.75h1.5zm.75 9v2.25a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V15a.75.75 0 00-.75-.75H14.25a.75.75 0 00-.75.75v.75z"
      />
    </svg>
  );
}

const THEME_OPTIONS = [
  { value: 't3-dark', label: 'Dark', icon: MoonIcon },
  { value: 't3-light', label: 'Light', icon: SunIcon },
  { value: 'system', label: 'System', icon: SystemIcon },
];

export default function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const currentOption = THEME_OPTIONS.find((o) => o.value === theme) || THEME_OPTIONS[0];
  const CurrentIcon = currentOption.icon;
  const isDark = effectiveTheme === 't3-dark';

  const ariaLabel =
    theme === 'system'
      ? 'Theme: System (currently ' + (isDark ? 'dark' : 'light') + ')'
      : `Theme: ${currentOption.label}`;

  return (
    <div ref={containerRef} className={`dropdown dropdown-end ${open ? 'dropdown-open' : ''}`}>
      <button
        type="button"
        tabIndex={0}
        className="btn btn-ghost btn-circle btn-sm rounded-full hover:bg-base-200/80 transition-all duration-200"
        onClick={() => setOpen((o) => !o)}
        aria-label={ariaLabel}
        title={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <CurrentIcon className="h-5 w-5" />
      </button>
      <ul
        className="menu dropdown-content bg-base-200/95 backdrop-blur-xl rounded-2xl border border-base-300/50 shadow-xl p-2 z-50 mt-2 w-44"
        aria-label="Theme selection"
      >
        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = theme === opt.value;
          return (
            <li key={opt.value}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={active}
                className={`flex items-center gap-3 rounded-xl font-medium ${active ? 'bg-primary/15 text-primary' : ''}`}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{opt.label}</span>
                {active && (
                  <span className="ml-auto text-primary" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
