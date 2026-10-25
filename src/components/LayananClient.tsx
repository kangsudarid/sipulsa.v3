"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import {
  CATEGORIES,
  SERVICES,
  SERVICE_CODES,
  SERVICE_ORDER,
  formatRp,
  minPrice,
  type Category,
} from "@/lib/catalog";

export function LayananClient() {
  const [cat, setCat] = useState<"all" | Category>("all");
  const [query, setQuery] = useState("");

  const term = query.toLowerCase().trim();
  const list = SERVICE_ORDER.filter((slug) => {
    const service = SERVICES[slug];
    if (cat !== "all" && service.cat !== cat) return false;
    if (!term) return true;
    return `${service.name} ${slug} ${service.desc} ${service.prov.join(" ")}`
      .toLowerCase()
      .includes(term);
  });

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Layanan" },
        ]}
      />
      <div className="tag mt-4">
        <b>[KATALOG]</b> &nbsp;{SERVICE_ORDER.length} layanan tersedia
      </div>
      <h1 className="mt-4 text-[40px] leading-[1.02] sm:text-6xl">
        Pilih layanannya,
        <br />
        sisanya biar kami.
      </h1>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
          <div className="relative">
            <span className="mut absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="search" />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="in pl-10"
              placeholder="cari layanan…"
              aria-label="Cari layanan"
            />
          </div>
          <div className="seg lg:flex-col">
            {CATEGORIES.map((category) => {
              const count =
                category.key === "all"
                  ? SERVICE_ORDER.length
                  : SERVICE_ORDER.filter(
                      (slug) => SERVICES[slug].cat === category.key,
                    ).length;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setCat(category.key)}
                  className={`${cat === category.key ? "on" : ""} lg:flex lg:w-full lg:justify-between`}
                >
                  {category.label}
                  <span className="ml-2 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="pn hidden p-4 lg:block">
            <div className="tag">// status</div>
            <div className="live mt-3">
              <i />
              {SERVICE_ORDER.length}/{SERVICE_ORDER.length} layanan online
            </div>
            <p className="mut mt-2 text-sm">
              Proses rata-rata ±5 detik per transaksi.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <span className="tag">
              <b>{list.length}</b> hasil
            </span>
            <span className="tag hidden sm:inline">urut: populer</span>
          </div>

          {list.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((slug) => {
                const service = SERVICES[slug];
                const min = minPrice(slug);
                return (
                  <Link
                    key={slug}
                    href={`/checkout?s=${slug}`}
                    className="pn group flex flex-col gap-5 p-5 transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#292F3D]"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-lg transition group-hover:bg-[#F3E64B]"
                        style={{ background: "var(--ink)", color: "var(--lem)" }}
                      >
                        <span className="transition group-hover:text-[#292F3D]">
                          <Icon name={service.icon} />
                        </span>
                      </span>
                      <span
                        className="mono rounded px-2 py-1 text-[11px] font-bold"
                        style={{ border: "1px solid var(--line2)" }}
                      >
                        {SERVICE_CODES[slug]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl">{service.name}</h3>
                      <p className="mut mt-1 text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                    <dl
                      className="mono mt-auto grid grid-cols-2 gap-y-1.5 pt-4 text-xs"
                      style={{ borderTop: "1px dashed var(--line2)" }}
                    >
                      <dt className="mut">mulai</dt>
                      <dd className="text-right font-bold">
                        {min ? formatRp(min) : "by tagihan"}
                      </dd>
                      <dt className="mut">provider</dt>
                      <dd className="text-right font-bold">{service.prov.length}</dd>
                      <dt className="mut">kategori</dt>
                      <dd className="text-right font-bold">{service.catL}</dd>
                    </dl>
                    <span className="b b-out w-full group-hover:bg-[#292F3D] group-hover:text-[#F3E64B]">
                      Buka checkout <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="pn p-8 text-center sm:col-span-2 xl:col-span-3">
              <div className="mono">
                0 hasil untuk &quot;{query}&quot;
              </div>
              <p className="mut mt-1 text-sm">
                Coba kata kunci lain, misal &quot;token&quot; atau
                &quot;diamond&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
