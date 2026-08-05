"use client";

import Link from "next/link";
import { useEffect } from "react";

type NavLink = { href: string; label: string };

export default function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--color-bg)] transition-all duration-300 md:hidden ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar menu"
        className="fixed right-6 top-6 z-[70] text-[var(--color-gold)] opacity-80 transition-opacity hover:opacity-100"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <path d="M5 5 L19 19 M19 5 L5 19" />
        </svg>
      </button>

      <nav className="flex flex-col items-center gap-9">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-[family-name:var(--font-heading)] text-2xl text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-light)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
