import Link from "next/link";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";

const INSTAGRAM_URL = "https://www.instagram.com/sublimecoquetelaria/";
const WHATSAPP_URL = "https://wa.me/5561991581775";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] px-6 py-10 text-[var(--color-text-secondary)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-light)]"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-light)]"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>

        <p className="text-xs font-light tracking-wide text-[var(--color-text-secondary)]">
          © 2026 - Sublime Coquetelaria
        </p>

        <p className="text-xs font-light tracking-wide">
          Site criado e desenvolvido por{" "}
          <a
            href="https://carolribeiros.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-light)]"
          >
            Carol Ribeiro
          </a>
        </p>

        <Link
          href="/painel"
          className="text-[10px] tracking-wide text-[var(--color-text-secondary)]/30 transition-opacity hover:text-[var(--color-text-secondary)]/70"
        >
          Acesso Fernando
        </Link>
      </div>
    </footer>
  );
}
