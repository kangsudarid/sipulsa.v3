"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { SERVICES, formatRp } from "@/lib/catalog";
import {
  WA_LINK,
  formatDate,
  formatTime,
  loadOrders,
  type Order,
} from "@/lib/store";

export function LacakClient() {
  const search = useSearchParams();
  const idParam = (search.get("id") ?? "").trim().toUpperCase();
  const [query, setQuery] = useState(idParam);
  const [active, setActive] = useState(idParam);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = query.trim().toUpperCase();
    setQuery(next);
    setActive(next);
    if (next) {
      window.history.replaceState(null, "", `/lacak?id=${encodeURIComponent(next)}`);
    } else {
      window.history.replaceState(null, "", "/lacak");
    }
  };

  const order = active ? orders.find((entry) => entry.id === active) : undefined;

  const select = (entry: Order) => {
    setQuery(entry.id);
    setActive(entry.id);
    window.history.replaceState(null, "", `/lacak?id=${entry.id}`);
    document
      .getElementById("hasil")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="box no-foot pb-12 pt-10 lg:pb-0">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Lacak" },
        ]}
      />
      <div className="tag mt-4">
        <b>[TRACKER]</b> &nbsp;Status transaksi real-time
      </div>
      <h1 className="mt-4 text-[40px] leading-[1.02] sm:text-6xl">
        Lacak setiap
        <br />
        transaksi, <span className="hl">detik per detik.</span>
      </h1>

      <form onSubmit={submit} className="pn tick4 mt-8 flex max-w-2xl gap-2 p-2">
        <span className="mono grid place-items-center pl-3 text-lg font-bold">#</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mono min-w-0 flex-1 bg-transparent text-base uppercase outline-none sm:text-lg"
          placeholder="SNX-XXXXXX"
          autoComplete="off"
          aria-label="Kode transaksi"
        />
        <button type="submit" className="b b-ink">
          Lacak
        </button>
      </form>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div id="hasil">
          {!active ? (
            <div className="pn p-8 text-center">
              <div className="mono mut text-sm">
                › menunggu input kode transaksi…
              </div>
              {!orders.length && (
                <Link href="/layanan" className="b b-ink mt-5">
                  Buat transaksi pertama
                </Link>
              )}
            </div>
          ) : !order ? (
            <div className="pn p-8">
              <div className="mono font-bold">404 · {active}</div>
              <p className="mut mt-2 text-sm">
                Kode tidak ditemukan di perangkat ini. Pastikan kodenya benar dan
                kamu memakai browser yang sama saat transaksi.
              </p>
            </div>
          ) : (
            <OrderResult order={order} />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Log perangkat ini</h2>
            <span className="tag">max 5</span>
          </div>
          <div className="pn mt-4 overflow-hidden">
            {orders.length ? (
              orders.slice(0, 5).map((entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => select(entry)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#F3E64B]"
                  style={
                    index
                      ? { borderTop: "1px solid var(--line)" }
                      : undefined
                  }
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md"
                    style={{ background: "var(--ink)", color: "var(--lem)" }}
                  >
                    <Icon
                      name={SERVICES[entry.slug]?.icon ?? "receipt"}
                      className="h-4 w-4"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{entry.item}</span>
                    <span className="mono mut block text-xs">{entry.id}</span>
                  </span>
                  <span className="mono text-sm font-bold">
                    {formatRp(entry.amount)}
                  </span>
                </button>
              ))
            ) : (
              <div className="mono mut p-5 text-sm">
                › log kosong.{" "}
                <Link href="/layanan" className="font-bold" style={{ color: "var(--ink)" }}>
                  mulai transaksi →
                </Link>
              </div>
            )}
          </div>
          <div
            className="mono mt-4 rounded-lg p-4 text-xs leading-relaxed"
            style={{ background: "var(--lem)", color: "var(--ink)", border: "1px solid var(--ink)" }}
          >
            // MODE SIMULASI · transaksi tersimpan di browser ini. Pembayaran
            QRIS diverifikasi manual oleh tim, lalu status diperbarui.
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noreferrer"
            className="b b-out mt-3 w-full"
          >
            <Icon name="chat" className="h-4 w-4" /> Tanya status via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

function OrderResult({ order }: { order: Order }) {
  const events = [
    {
      title: "Pesanan dibuat",
      detail: `checkout ${order.method}`,
      time: formatTime(order.createdAt),
      pending: false,
    },
    {
      title: "Pembayaran dikonfirmasi",
      detail: `${formatRp(order.amount)} · dicek manual`,
      time: formatTime(order.createdAt + 1800),
      pending: false,
    },
    {
      title: "Sedang diproses",
      detail: `${order.provider} · ${order.item}`,
      time: formatTime(order.createdAt + 2600),
      pending: true,
    },
  ];

  const lines: [string, string][] = [
    ["modul", order.product],
    ["provider", order.provider],
    ["item", order.item],
    ["tujuan", order.target],
    ["harga", formatRp(order.amount)],
    ["metode", order.method],
    ["status", "Sedang diproses"],
  ];

  return (
    <article className="pn tick4 ani overflow-hidden">
      <div
        className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6"
        style={{ background: "var(--ink)", color: "#F7F7F2" }}
      >
        <div>
          <div className="mono text-xs" style={{ color: "#9AA0AE" }}>
            {order.product} · {formatDate(order.createdAt)}
          </div>
          <div className="mono mt-1 text-2xl font-bold sm:text-3xl" style={{ color: "#F3E64B" }}>
            {order.id}
          </div>
        </div>
        <span
          className="mono rounded px-2.5 py-1.5 text-xs font-bold"
          style={{ background: "#F3E64B", color: "#292F3D" }}
        >
          ● SEDANG DIPROSES
        </span>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="p-5 sm:p-6">
          {events.map((event, index) => (
            <div
              key={event.title}
              className={`ev ${event.pending ? "pending" : ""} ani`}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <span className="dt">
                <Icon
                  name={event.pending ? "clock" : "check"}
                  className="h-3 w-3"
                />
              </span>
              <div className="flex justify-between gap-2">
                <b className="text-[15px]">{event.title}</b>
                <span className="mono mut text-xs">{event.time}</span>
              </div>
              <div className="mut text-sm">{event.detail}</div>
            </div>
          ))}
        </div>

        <div
          className="mono p-5 text-[13px] md:border-l sm:p-6"
          style={{ borderColor: "var(--line)" }}
        >
          {lines.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 py-2"
              style={{ borderBottom: "1px dashed var(--line2)" }}
            >
              <span className="mut">{label}</span>
              <span className="text-right font-semibold break-all">{value}</span>
            </div>
          ))}
          <div className="flex items-end justify-between pt-4">
            <span className="mut">total</span>
            <span className="text-2xl font-bold">{formatRp(order.amount)}</span>
          </div>
          <div className="mut mt-4 text-xs">
            pesanan diteruskan ke provider. Status berikutnya dikirim lewat
            WhatsApp.
          </div>
        </div>
      </div>
    </article>
  );
}
