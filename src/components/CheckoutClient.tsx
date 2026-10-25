"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import {
  SERVICES,
  SERVICE_CODES,
  SERVICE_ORDER,
  detectOperator,
  formatRp,
  isSlug,
  normalizePhone,
  simulateBill,
  type ProductItem,
  type Slug,
} from "@/lib/catalog";
import { newOrderId, saveOrder, type Order } from "@/lib/store";

export function CheckoutClient() {
  const search = useSearchParams();
  const slugParam = search.get("s");
  const slug = isSlug(slugParam) ? slugParam : "pulsa";
  const prefill = search.get("n") ?? "";

  return <CheckoutForm key={`${slug}:${prefill}`} slug={slug} prefill={prefill} />;
}

function CheckoutForm({ slug, prefill }: { slug: Slug; prefill: string }) {
  const router = useRouter();
  const service = SERVICES[slug];

  const [target, setTarget] = useState(prefill);
  const [provider, setProvider] = useState<string | null>(
    !service.detect && service.prov.length === 1 ? service.prov[0] : null,
  );
  const [item, setItem] = useState<ProductItem | null>(null);

  const operator = service.detect ? detectOperator(target) : null;
  const activeProvider = service.detect ? operator : provider;
  const digits = target.replace(/\D/g, "");

  useEffect(() => {
    setItem(null);
  }, [activeProvider]);

  const bill =
    service.bill && provider && digits.length >= 6
      ? simulateBill(slug, provider, target)
      : null;

  const effectiveItem: ProductItem | null = service.bill
    ? bill
      ? { n: `Tagihan ${bill.periode}`, p: bill.total }
      : null
    : item;

  const targetOk =
    service.targetType === "phone"
      ? normalizePhone(target).length >= 10 && (!service.detect || !!operator)
      : target.trim().length >= 5;
  const providerOk = service.detect ? !!operator : !!provider;
  const ready = targetOk && providerOk && !!effectiveItem;

  const total = effectiveItem?.p ?? 0;

  const items = (() => {
    if (service.bill) {
      if (!bill) {
        return (
          <p className="mono mut text-sm">
            › menunggu {!provider ? "provider + " : ""}ID pelanggan (min. 6
            digit)…
          </p>
        );
      }
      return (
        <>
          <div
            className="mono rounded-lg p-4 text-sm"
            style={{ background: "var(--ink)", color: "#F7F7F2" }}
          >
            <div className="flex justify-between">
              <span style={{ color: "#9AA0AE" }}>GET /tagihan</span>
              <span style={{ color: "#2BB673" }}>200 OK</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-2">
              <span style={{ color: "#9AA0AE" }}>nama</span>
              <span className="text-right">{bill.nama}</span>
              <span style={{ color: "#9AA0AE" }}>periode</span>
              <span className="text-right">{bill.periode}</span>
              <span style={{ color: "#9AA0AE" }}>tagihan</span>
              <span className="text-right">{formatRp(bill.tagihan)}</span>
              <span style={{ color: "#9AA0AE" }}>admin</span>
              <span className="text-right">{formatRp(bill.admin)}</span>
              <span style={{ color: "#9AA0AE" }}>total</span>
              <span className="text-right font-bold" style={{ color: "#F3E64B" }}>
                {formatRp(bill.total)}
              </span>
            </div>
          </div>
          <p className="tag mt-2 normal-case">› data simulasi</p>
        </>
      );
    }

    if (!activeProvider || !service.items) {
      return (
        <p className="mono mut text-sm">
          ›{" "}
          {service.detect
            ? "masukkan nomor HP untuk memuat nominal"
            : "pilih provider dulu"}
          …
        </p>
      );
    }

    const list = service.items[activeProvider] ?? [];
    return (
      <div className="grid grid-cols-2 gap-2.5 pt-1 md:grid-cols-3">
        {list.map((option, index) => (
          <button
            key={option.n}
            type="button"
            onClick={() => setItem(option)}
            className={`sel ${item?.n === option.n ? "on" : ""}`}
          >
            {index === 2 && <span className="hot">HOT</span>}
            <div className="text-[15px] font-semibold leading-tight">
              {option.n}
            </div>
            {option.sub && (
              <div className="mono mt-1 text-[11px] opacity-60">{option.sub}</div>
            )}
            <div className="pr mt-2 text-sm">{formatRp(option.p)}</div>
          </button>
        ))}
      </div>
    );
  })();

  const helper = service.detect
    ? operator
      ? `› operator: ${operator.toLowerCase()}`
      : normalizePhone(target).length >= 4
        ? "› prefix tidak dikenali"
        : "› prefix dibaca otomatis (08xx / 62xx)"
    : service.bill
      ? "› tagihan ditarik otomatis setelah ID valid (simulasi)"
      : service.targetType === "phone"
        ? "› pakai nomor yang terdaftar di akun e-wallet"
        : "› pastikan ID sudah benar";

  const hint = !targetOk
    ? `› isi ${service.label.toLowerCase()}`
    : !providerOk
      ? "› pilih provider"
      : !effectiveItem
        ? service.bill
          ? "› menunggu tagihan"
          : "› pilih nominal"
        : `› ${effectiveItem.n} · QRIS`;

  const blocks: { key: string; title: string; ok: boolean; body: React.ReactNode }[] = [
    {
      key: "t",
      title: service.label,
      ok: targetOk,
      body: (
        <>
          <div className="relative">
            <input
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="in pr-32"
              inputMode={service.targetType === "phone" ? "numeric" : "text"}
              placeholder={service.ph}
              aria-label={service.label}
            />
            {service.detect && operator && (
              <span
                className="mono absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-bold"
                style={{ background: "var(--lem)", color: "var(--ink)" }}
              >
                ● {operator}
              </span>
            )}
          </div>
          <p className="tag mt-2 normal-case">{helper}</p>
        </>
      ),
    },
  ];

  if (!service.detect) {
    blocks.push({
      key: "p",
      title:
        slug === "bpjs" ? "Kelas" : slug === "game" ? "Game" : "Provider",
      ok: !!provider,
      body: (
        <div className="seg sm:flex-wrap">
          {service.prov.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setProvider(option)}
              className={provider === option ? "on" : ""}
            >
              {option}
            </button>
          ))}
        </div>
      ),
    });
  }

  blocks.push({
    key: "i",
    title: service.bill ? "Tagihan" : "Nominal",
    ok: !!effectiveItem,
    body: items,
  });

  blocks.push({
    key: "m",
    title: "Pembayaran",
    ok: !!effectiveItem,
    body: (
      <>
        <div className="sel on flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-items-center rounded-lg"
            style={{ background: "var(--lem)", color: "var(--ink)" }}
          >
            <Icon name="qr" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">QRIS</span>
            <span className="mono block text-[11px] opacity-60">
              semua bank &amp; e-wallet · tanpa biaya
            </span>
          </span>
          <Icon name="check" className="h-4 w-4" />
        </div>
        <p className="tag mt-3 normal-case">
          › setelah pesanan dibuat, kode QRIS muncul di halaman pembayaran
        </p>
      </>
    ),
  });

  const previewLines = [
    ["modul", `${SERVICE_CODES[slug]} ${service.name}`],
    [service.detect ? "operator" : "provider", activeProvider || "—"],
    ["item", effectiveItem?.n || "—"],
    ["tujuan", target || "—"],
    ["harga", effectiveItem ? formatRp(effectiveItem.p) : "—"],
    ["metode", "QRIS"],
    ["biaya", "gratis"],
  ];

  const pay = () => {
    if (!ready || !effectiveItem || !activeProvider) return;
    const id = newOrderId();
    const order: Order = {
      id,
      slug,
      product: service.name,
      provider: activeProvider,
      item: effectiveItem.n,
      target:
        service.targetType === "phone" ? normalizePhone(target) : target.trim(),
      amount: effectiveItem.p,
      method: "QRIS",
      status: "processing",
      createdAt: Date.now(),
    };
    saveOrder(order);
    router.push(`/bayar?id=${id}`);
  };

  return (
    <>
      <main className="box no-foot pb-bar pt-8">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Layanan", href: "/layanan" },
            { label: `${SERVICE_CODES[slug]} · ${service.name}` },
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
              <h1 className="text-4xl leading-none sm:text-5xl">{service.name}</h1>
              <p className="mut mt-2">{service.desc}</p>
            </div>
          </div>
          <div className="mono flex flex-wrap gap-2 text-xs">
            <span className="pn rounded px-2 py-1">±5 dtk</span>
            <span className="pn rounded px-2 py-1">↺ auto-refund</span>
            <span className="pn rounded px-2 py-1">● 24/7</span>
          </div>
        </div>

        <div className="seg mt-6">
          {SERVICE_ORDER.map((option) => (
            <Link
              key={option}
              href={`/checkout?s=${option}`}
              className={option === slug ? "on" : ""}
            >
              {SERVICE_CODES[option]} · {SERVICES[option].name}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <section key={block.key} className="pn blk p-5 sm:p-6">
                <div className="hd">
                  <span className={`n ${block.ok ? "ok" : ""}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl">{block.title}</h2>
                </div>
                <div className="mt-4">{block.body}</div>
              </section>
            ))}
          </div>

          <aside className="sticky top-24 hidden lg:block">
            <div className="pn tick4 p-6">
              <div className="flex items-center justify-between">
                <span className="tag">
                  <b>ORDER PREVIEW</b>
                </span>
                <span className="live">
                  <i />
                  siap
                </span>
              </div>
              <div className="rc mt-4">
                {previewLines.map(([label, value]) => (
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
                <span className="mono text-3xl font-bold">{formatRp(total)}</span>
              </div>
              <button type="button" className="b b-ink mt-5 w-full" disabled={!ready} onClick={pay}>
                Eksekusi pembayaran
              </button>
              <p className="tag mt-3 text-center normal-case">
                tanpa akun · bayar QRIS · auto-refund
              </p>
            </div>
          </aside>
        </div>
      </main>

      <div className="fbar lg:hidden">
        <div className="min-w-0 flex-1">
          <div className="mono truncate text-[11px]" style={{ color: "#9AA0AE" }}>
            {hint}
          </div>
          <div className="mono text-lg font-bold" style={{ color: "#F3E64B" }}>
            {formatRp(total)}
          </div>
        </div>
        <button type="button" className="b b-lem" disabled={!ready} onClick={pay}>
          Bayar
        </button>
      </div>
    </>
  );
}
