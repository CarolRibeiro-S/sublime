"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import MobileMenu from "@/components/MobileMenu";

const NAV_LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/drinks", label: "Drinks" },
  { href: "/agenda", label: "Agenda" },
  { href: "/avaliacoes", label: "Avaliações" },
];

const INSTAGRAM_URL = "https://www.instagram.com/sublimecoquetelaria/";
const WHATSAPP_URL = "https://wa.me/5561991581775";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-bg)]/90 backdrop-blur-md shadow-[0_1px_0_rgba(212,160,23,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" aria-label="Sublime">
          <Image
            src="/images/sublime-logo.svg"
            alt="Sublime"
            width={151}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-light tracking-wide text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-gold-light)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[var(--color-gold)] opacity-60 transition-opacity hover:opacity-100"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-[var(--color-gold)] opacity-60 transition-opacity hover:opacity-100"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="opacity-80 transition-opacity hover:opacity-100 md:hidden"
          >
            <Image
              src="/images/icons/menu-glass.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}
