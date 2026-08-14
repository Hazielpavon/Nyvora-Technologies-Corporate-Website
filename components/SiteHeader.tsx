"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content";
import styles from "./SiteHeader.module.css";

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
    <header className={styles.header}>
      <div className={`site-container ${styles.inner}`}>
        <Link className={styles.brand} href="/" aria-label="Nyvora Technologies, página principal">
          <Image
            className={styles.brandLogo}
            src="/nyvora-logo.png"
            alt=""
            width={2048}
            height={768}
            priority
            sizes="(max-width: 920px) 150px, 180px"
          />
        </Link>

        <button
          ref={toggleRef}
          className={styles.menuButton}
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">{isOpen ? "Cerrar" : "Abrir"} navegación</span>
          <span className={styles.menuLabel} aria-hidden="true">
            {isOpen ? "Cerrar" : "Menú"}
          </span>
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <nav
          id="primary-navigation"
          className={`${styles.navigation} ${isOpen ? styles.navigationOpen : ""}`}
          aria-label="Navegación principal"
        >
          <ul className={styles.navigationList}>
            {navigation.map((item, index) => {
              const isCurrent = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    className={item.href === "/contact" ? styles.contactLink : styles.navigationLink}
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
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
