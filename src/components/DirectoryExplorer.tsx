"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import {
  SERVICES,
  SERVICE_CODES,
  SERVICE_ORDER,
  formatRp,
  minPrice,
  type Slug,
} from "@/lib/catalog";

export function DirectoryExplorer() {
  const [active, setActive] = useState<Slug>("pulsa");
  const service = SERVICES[active];
  const min = minPrice(active);

  return (
    <div className="sx-ex mt-10">
      <div className="sx-list">
        {SERVICE_ORDER.map((slug, index) => (
          <Link
            key={slug}
            href={`/checkout?s=${slug}`}
            className={`sx-row ${active === slug ? "on" : ""}`}
            onMouseEnter={() => setActive(slug)}
            onFocus={() => setActive(slug)}
          >
            <span className="sx-n">{String(index + 1).padStart(2, "0")}</span>
            <span className="sx-nm">{SERVICES[slug].name}</span>
            <span className="sx-cd">{SERVICE_CODES[slug]}</span>
            <span className="sx-go">
              <Icon name="arrow" className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <aside className="sx-panel hidden lg:flex">
        <div className="flex items-center justify-between">
          <span className="sx-big">
            <Icon name={service.icon} />
          </span>
          <span className="mono text-xs" style={{ color: "#9AA0AE" }}>
            {SERVICE_CODES[active]} · {service.catL.toUpperCase()}
          </span>
        </div>
        <h3 className="mt-10 text-4xl xl:text-5xl">{service.name}</h3>
        <p className="mt-3 text-lg" style={{ color: "#B5B9C3" }}>
          {service.desc}
        </p>
        <div className="mono mt-8 text-xs" style={{ color: "#9AA0AE" }}>
          TERSEDIA UNTUK
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {service.prov.slice(0, 6).map((provider) => (
            <span key={provider} className="sx-chip">
              {provider}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 pt-10">
          <div>
            <div className="mono text-xs" style={{ color: "#9AA0AE" }}>
              MULAI DARI
            </div>
            <div
              className="mt-1 text-3xl font-extrabold"
              style={{ color: "var(--lem)" }}
            >
              {min ? formatRp(min) : "Cek tagihan"}
            </div>
          </div>
          <Link href={`/checkout?s=${active}`} className="b b-lem">
            Pesan sekarang <Icon name="arrow" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
