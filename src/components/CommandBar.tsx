"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "./Icon";
import {
  SERVICES,
  SERVICE_ORDER,
  SERVICE_CODES,
  detectOperator,
  normalizePhone,
  type Slug,
} from "@/lib/catalog";

const CHIPS: { slug: Slug; label: string }[] = [
  { slug: "pulsa", label: "Pulsa" },
  { slug: "paket-data", label: "Kuota" },
  { slug: "pln", label: "Token PLN" },
  { slug: "game", label: "Game" },
  { slug: "e-wallet", label: "E-wallet" },
];

export function CommandBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  const isPhone = /^[\d\s+-]+$/.test(trimmed) && digits.length >= 4;
  const operator = isPhone ? detectOperator(trimmed) : null;
  const phone = isPhone ? normalizePhone(trimmed) : "";
  const query = trimmed.toLowerCase();

  const hits = !isPhone && trimmed
    ? SERVICE_ORDER.filter((slug) => {
        const service = SERVICES[slug];
        return `${service.name} ${slug} ${service.catL} ${service.desc} ${service.prov.join(" ")}`
          .toLowerCase()
          .includes(query);
      })
    : [];

  const start = () => {
    if (isPhone && operator) router.push(`/checkout?s=pulsa&n=${phone}`);
    else if (hits.length) router.push(`/checkout?s=${hits[0]}`);
    else inputRef.current?.focus();
  };

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <form
        className="hx-cmd"
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
      >
        <span className="hx-ic" aria-hidden="true">
          <Icon name="search" />
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none sm:text-lg"
          placeholder="Ketik nomor HP atau nama layanan…"
          autoComplete="off"
          aria-label="Nomor HP atau nama layanan"
        />
        <button
          type="submit"
          className="b b-ink hx-go min-h-[48px]"
          aria-label="Mulai"
        >
          <span className="hidden sm:inline">Mulai</span> <Icon name="arrow" />
        </button>
      </form>

      {trimmed && (
        <div className="pn mt-3 p-3 text-left">
          {isPhone ? (
            operator ? (
              <div
                className="flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center"
                style={{ background: "var(--lem)" }}
              >
                <div className="mono flex-1 text-sm">
                  <b>{operator}</b> terdeteksi · {phone}
                </div>
                <div className="flex gap-2">
                  <Link
                    className="b b-ink min-h-[40px] flex-1 py-2"
                    href={`/checkout?s=pulsa&n=${phone}`}
                  >
                    Isi pulsa
                  </Link>
                  <Link
                    className="b b-out min-h-[40px] flex-1 py-2"
                    href={`/checkout?s=paket-data&n=${phone}`}
                  >
                    Paket data
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mono mut p-3 text-sm">
                Prefix {phone.slice(0, 4)} belum dikenali. Cek lagi nomornya.
              </div>
            )
          ) : hits.length ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {hits.map((slug) => (
                <Link key={slug} href={`/checkout?s=${slug}`} className="sel flex items-center gap-3">
                  <span
                    className="mono rounded px-1.5 py-0.5 text-xs font-bold"
                    style={{ background: "var(--lem)", color: "var(--ink)" }}
                  >
                    {SERVICE_CODES[slug]}
                  </span>
                  <span className="flex-1 font-semibold">{SERVICES[slug].name}</span>
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mono mut p-3 text-sm">
              Tidak ada modul &quot;{trimmed}&quot;. Coba: pulsa, pln, game.
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {CHIPS.map((chip) => (
          <Link key={chip.slug} href={`/checkout?s=${chip.slug}`} className="hx-chip">
            {chip.label}
          </Link>
        ))}
        <Link href="/layanan" className="hx-chip">
          Semua →
        </Link>
      </div>
    </div>
  );
}
