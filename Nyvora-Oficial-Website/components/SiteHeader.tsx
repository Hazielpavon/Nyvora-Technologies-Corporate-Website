"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { navigation } from "@/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    firstLinkRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="site-container flex h-[4.25rem] items-center justify-between gap-6">
        <Link
          className="-ml-1 block shrink-0 rounded-md p-1"
          href="/"
          aria-label="Nyvora Technologies, página principal"
        >
          <BrandLogo className="w-[8.5rem] md:w-[9.5rem]" sizes="152px" highPriority />
        </Link>

        <button
          ref={toggleRef}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink md:hidden"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">{isOpen ? "Cerrar" : "Abrir"} navegación</span>
          <span aria-hidden="true">{isOpen ? "Cerrar" : "Menú"}</span>
          {isOpen ? <X aria-hidden="true" size={18} /> : <List aria-hidden="true" size={18} />}
        </button>

        <nav
          id="primary-navigation"
          aria-label="Navegación principal"
          className={`${isOpen ? "flex" : "hidden"} absolute inset-x-0 top-full border-b border-line bg-bg px-5 pb-6 pt-2 md:static md:flex md:border-0 md:bg-transparent md:p-0`}
        >
          <ul className="flex w-full flex-col gap-1 md:flex-row md:items-center md:gap-1">
            {navigation.map((item, index) => {
              const isCurrent = pathname === item.href;
              const isContact = item.href === "/contact";
              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={
                      isContact
                        ? "mt-2 inline-flex min-h-11 items-center rounded-full bg-button px-5 text-[0.9375rem] font-medium text-button-ink transition-transform duration-200 active:scale-[0.98] md:ml-3 md:mt-0"
                        : `flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] transition-colors duration-200 ${
                            isCurrent
                              ? "font-medium text-ink md:bg-surface"
                              : "text-ink-soft hover:text-ink"
                          }`
                    }
                  >
                    <span translate={item.label === "Myke" ? "no" : undefined}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
