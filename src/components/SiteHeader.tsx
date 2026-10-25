"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/lacak", label: "Lacak" },
  { href: "/bantuan", label: "Bantuan" },
];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="top">
        <div className="box relative flex h-16 items-center gap-6">
          <Logo />
          <nav
            className="nv absolute left-1/2 hidden -translate-x-1/2 gap-1 lg:flex"
            aria-label="Navigasi utama"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? "on" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="live hidden xl:inline-flex">
              <i />
              SEMUA SISTEM NORMAL
            </span>
            <Link
              href="/layanan"
              className="b b-ink hidden min-h-[40px] py-2 lg:inline-flex"
            >
              Mulai transaksi
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="pn grid h-11 w-11 place-items-center rounded-lg lg:hidden"
              aria-label="Buka menu"
              aria-expanded={open}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="ovl" role="dialog" aria-modal="true" aria-label="Menu navigasi">
          <div className="flex h-12 items-center justify-between">
            <span className="tag" style={{ color: "#F3E64B" }}>
              // MENU
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-lg"
              style={{ border: "1px solid rgba(247,247,242,.2)" }}
              aria-label="Tutup menu"
            >
              <Icon name="x" />
            </button>
          </div>
          <nav className="mt-6" aria-label="Navigasi mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                className={`ol ${isActive(item.href) ? "on" : ""}`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <span className="live" style={{ color: "#F7F7F2" }}>
              <i />
              SEMUA SISTEM NORMAL
            </span>
            <Link
              href="/layanan"
              className="b b-lem mt-4 w-full text-lg"
              style={{ minHeight: 56 }}
            >
              Mulai transaksi <Icon name="arrow" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
