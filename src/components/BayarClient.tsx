"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { SERVICES, formatRp } from "@/lib/catalog";
import {
  ADMIN_WA,
  PAID_MESSAGE,
  QRIS_IMAGE,
  findOrder,
  formatDate,
  waLink,
  type Order,
} from "@/lib/store";

export function BayarClient() {
  const search = useSearchParams();
  const id = (search.get("id") ?? "").trim().toUpperCase();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrder(id ? findOrder(id) ?? null : null);
  }, [id]);

  const copyId = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (order === undefined) {
    return (
      <main className="box no-foot pb-bar pt-8">
        <div className="pn mono mut p-8 text-sm">memuat pesanan…</div>
      </main>
    );
  }

  if (order === null) {
    return (
      <main className="box no-foot pt-8">
        <div className="pn tick4 mx-auto max-w-xl p-8 text-center">
          <div
            className="mx-auto grid h-12 w-12 place-items-center rounded-xl"
            style={{ background: "var(--lem)", color: "var(--ink)" }}
          >
            <Icon name="search" />
          </div>
          <h1 className="mt-5 text-3xl">Pesanan tidak ditemukan</h1>
          <p className="mut mt-2 text-sm">
            Kode pesanan tidak ada di browser ini. Buat pesanan baru, atau cek
            kode SNX kamu di halaman lacak.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/layanan" className="b b-ink">
              Pilih layanan
            </Link>
            <Link href="/lacak" className="b b-out">
              Lacak pesanan
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const service = SERVICES[order.slug];
  const waMessage = paidLink(order);

  return (
    <>
      <main className="box no-foot pb-bar pt-8">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Lacak", href: "/lacak" },
            { label: "Pembayaran" },
          ]}
        />

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-4">
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-xl"
              style={{ background: "var(--ink)", color: "var(--lem)" }}
            >
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-4xl leading-none sm:text-5xl">
                {paid ? "Pembayaran diterima" : "Selesaikan pembayaran"}
              </h1>
              <p className="mut mt-2">
                {order.product} · {order.item}
              </p>
            </div>
          </div>
          <span
            className="mono w-fit rounded px-2.5 py-1.5 text-xs font-bold"
            style={
              paid
                ? { background: "var(--lem)", color: "var(--ink)" }
                : { border: "1px solid var(--line2)", color: "var(--ink)" }
            }
          >
            ● {paid ? "SEDANG DIPROSES" : "MENUNGGU PEMBAYARAN"}
          </span>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <section className="pn tick4 p-5 sm:p-7">
            {paid ? (
              <div className="py-6 text-center">
                <span
                  className="mx-auto grid h-16 w-16 place-items-center rounded-2xl"
                  style={{ background: "var(--lem)", color: "var(--ink)" }}
                >
                  <Icon name="check" className="h-8 w-8" />
                </span>
                <h2 className="mx-auto mt-6 max-w-md text-3xl leading-tight sm:text-4xl">
                  {PAID_MESSAGE}
                </h2>
                <p className="mut mx-auto mt-3 max-w-md text-sm leading-relaxed">
                  Pembayaran QRIS kamu akan dicek tim kami, lalu pesanan
                  diteruskan ke provider. Pantau statusnya lewat kode{" "}
                  <b className="mono" style={{ color: "var(--ink)" }}>
                    {order.id}
                  </b>
                  .
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  <Link href={`/lacak?id=${order.id}`} className="b b-ink">
                    Lacak pesanan <Icon name="arrow" />
                  </Link>
                  <a
                    href={waMessage}
                    target="_blank"
                    rel="noreferrer"
                    className="b b-out"
                  >
                    <Icon name="chat" className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="tag">
                      <b>[QRIS]</b> &nbsp;scan &amp; bayar
                    </div>
                    <div className="mono mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                      {formatRp(order.amount)}
                    </div>
                    <div className="mono mut mt-1 text-xs">
                      {order.id} · {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <span className="live">
                    <i />
                    menunggu
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <div
                    className="w-full max-w-[280px] shrink-0 rounded-xl bg-white p-3"
                    style={{ border: "1px solid var(--line2)" }}
                  >
                    <img
                      src={QRIS_IMAGE}
                      alt="Kode QRIS untuk pembayaran pesanan"
                      className="block h-auto w-full rounded-md"
                      width={520}
                      height={520}
                    />
                    <div className="mono mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-mut">
                      <span>QRIS</span>
                      <span>semua bank &amp; e-wallet</span>
                    </div>
                  </div>
                  <ol className="mono w-full space-y-3 text-[13px] leading-relaxed">
                    {[
                      "Buka aplikasi bank atau e-wallet pilihanmu.",
                      "Pilih menu bayar QRIS, lalu scan kode di samping.",
                      `Periksa nominal ${formatRp(order.amount)} dan selesaikan pembayaran.`,
                      'Tekan "Saya sudah bayar" setelah transaksi berhasil.',
                    ].map((step, index) => (
                      <li key={step} className="flex gap-3">
                        <span
                          className="grid h-6 w-6 shrink-0 place-items-center rounded text-[11px] font-bold"
                          style={{ background: "var(--lem)", color: "var(--ink)" }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <button type="button" className="b b-ink mt-7 w-full" onClick={() => setPaid(true)}>
                  Saya sudah bayar
                </button>
                <a
                  href={waMessage}
                  target="_blank"
                  rel="noreferrer"
                  className="b b-out mt-2 w-full"
                >
                  <Icon name="chat" className="h-4 w-4" /> Konfirmasi via WhatsApp
                </a>
                <p className="tag mt-3 text-center normal-case">
                  pembayaran dicek manual · simpan kode {order.id}
                </p>
              </>
            )}
          </section>

          <aside className="pn p-6">
            <div className="flex items-center justify-between">
              <span className="tag">
                <b>RINGKASAN</b>
              </span>
              <button
                type="button"
                onClick={copyId}
                className="mono flex items-center gap-1 text-xs font-semibold"
                style={{ color: "var(--ink)" }}
                aria-label="Salin kode pesanan"
              >
                <Icon name="copy" className="h-3.5 w-3.5" />
                {copied ? "tersalin" : "salin"}
              </button>
            </div>
            <div className="rc mt-4">
              {[
                ["kode", order.id],
                ["modul", order.product],
                ["provider", order.provider],
                ["item", order.item],
                ["tujuan", order.target],
                ["metode", order.method],
              ].map(([label, value]) => (
                <div key={label} className="ln">
                  <span className="mut">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-3 flex items-end justify-between pt-4"
              style={{ borderTop: "2px solid var(--ink)" }}
            >
              <span className="tag">total</span>
              <span className="mono text-3xl font-bold">
                {formatRp(order.amount)}
              </span>
            </div>
            <div
              className="mono mt-5 rounded-lg p-3 text-[11px] leading-relaxed"
              style={{ background: "var(--lem)", color: "var(--ink)" }}
            >
              // MODE SIMULASI · pembayaran QRIS diverifikasi manual oleh tim.
              Simpan kode pesanan untuk melacak status.
            </div>
            <p className="mut mt-4 text-xs">
              Butuh bantuan? WhatsApp {ADMIN_WA}.
            </p>
          </aside>
        </div>
      </main>

      <div className="fbar lg:hidden">
        <div className="min-w-0 flex-1">
          <div className="mono truncate text-[11px]" style={{ color: "#9AA0AE" }}>
            {paid ? `› ${order.id} · sedang diproses` : `› ${order.id} · QRIS`}
          </div>
          <div className="mono text-lg font-bold" style={{ color: "#F3E64B" }}>
            {formatRp(order.amount)}
          </div>
        </div>
        {paid ? (
          <Link href={`/lacak?id=${order.id}`} className="b b-lem">
            Lacak
          </Link>
        ) : (
          <button type="button" className="b b-lem" onClick={() => setPaid(true)}>
            Saya sudah bayar
          </button>
        )}
      </div>
    </>
  );
}

const paidLink = (order: Order) =>
  waLink(
    `Halo, saya sudah bayar pesanan ${order.id} sebesar ${formatRp(order.amount)}. Mohon dicek ya.`,
  );
