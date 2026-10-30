"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { ADMIN_WA, WA_LINK } from "@/lib/store";

type Faq = {
  cat: "Pembayaran" | "Pesanan" | "Akun";
  q: string;
  a: string;
};

const FAQS: Faq[] = [
  {
    cat: "Pembayaran",
    q: "Bagaimana cara membayar pesanan?",
    a: "Semua pesanan dibayar lewat QRIS. Setelah pesanan dibuat, kamu diarahkan ke halaman pembayaran berisi kode QRIS. Scan pakai aplikasi bank atau e-wallet apa pun: BCA, Mandiri, BRI, DANA, OVO, GoPay, ShopeePay, dan lainnya.",
  },
  {
    cat: "Pembayaran",
    q: "Kode QRIS-nya ada di mana?",
    a: "Di halaman pembayaran yang muncul setelah checkout. Kalau halaman itu tertutup, buka lagi lewat kode SNX di halaman Lacak.",
  },
  {
    cat: "Pembayaran",
    q: "Apakah ada biaya tambahan?",
    a: "Tidak. QRIS tanpa biaya tambahan. Total yang tampil di order preview adalah jumlah akhir yang kamu bayar.",
  },
  {
    cat: "Pembayaran",
    q: "Sudah bayar, tapi status belum berubah?",
    a: "Pembayaran dicek manual oleh tim. Tekan tombol Saya sudah bayar, lalu kirim kode SNX ke WhatsApp support. Status pesanan akan diperbarui menjadi Sedang diproses.",
  },
  {
    cat: "Pesanan",
    q: "Berapa lama transaksi diproses?",
    a: "Rata-rata ±5 detik setelah pembayaran diverifikasi. Setiap tahapnya bisa kamu pantau di halaman Lacak.",
  },
  {
    cat: "Pesanan",
    q: "Nomor tujuan salah input, bisa dibatalkan?",
    a: "Pesanan yang sudah diteruskan ke provider tidak bisa ditarik. Selalu cek kolom tujuan di order preview sebelum menekan tombol bayar.",
  },
  {
    cat: "Pesanan",
    q: "Transaksi gagal, bagaimana dananya?",
    a: "Refund berjalan otomatis ke metode pembayaran awal, maksimal 1x24 jam. Kode SNX tetap bisa dipakai untuk melacak status pengembalian.",
  },
  {
    cat: "Pesanan",
    q: "Di mana kode token PLN ditampilkan?",
    a: "Di halaman Lacak transaksi, pada detail pesanan. Simpan kode SNX supaya kamu bisa membuka detailnya kapan saja.",
  },
  {
    cat: "Akun",
    q: "Perlu registrasi untuk bertransaksi?",
    a: "Tidak. Sistem berjalan tanpa akun. Kode SNX adalah satu-satunya kunci untuk melacak transaksi.",
  },
  {
    cat: "Akun",
    q: "Kenapa log transaksi saya kosong?",
    a: "Log tersimpan di browser perangkat yang dipakai. Ganti perangkat atau hapus data browser akan mengosongkan log, tapi kode SNX tetap bisa dicari.",
  },
  {
    cat: "Akun",
    q: "Bagaimana cara melacak pesanan?",
    a: "Buka halaman Lacak, masukkan kode SNX yang muncul di halaman pembayaran. Status terakhir dan rincian pesanan langsung tampil.",
  },
];

const CATEGORIES = ["Semua", "Pembayaran", "Pesanan", "Akun"] as const;

export function BantuanClient() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Semua");
  const [query, setQuery] = useState("");

  const term = query.toLowerCase().trim();
  const results = FAQS.map((faq, index) => ({ ...faq, index })).filter((faq) => {
    if (category !== "Semua" && faq.cat !== category) return false;
    if (!term) return true;
    return `${faq.q} ${faq.a}`.toLowerCase().includes(term);
  });

  return (
    <main className="box pt-10">
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Bantuan" },
        ]}
      />
      <div className="tag mt-4">
        <b>[DOCS]</b> &nbsp;Pusat bantuan
      </div>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="text-[40px] leading-[1.02] sm:text-6xl">
            Semua panduan,
            <br />
            satu tempat.
          </h1>
          <p className="mut mt-4 max-w-lg text-lg">
            Temukan informasi yang kamu butuhkan tanpa harus mencari ke mana-mana.
          </p>

          <div className="relative mt-6">
            <span className="mut absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="search" />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="in pl-10"
              placeholder="cari: refund, token, qris…"
              aria-label="Cari bantuan"
            />
          </div>

          <div className="seg mt-3">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={category === item ? "on" : ""}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="pn mt-6 overflow-hidden">
            <div
              className="tag flex justify-between px-4 py-3"
              style={{ background: "rgba(41,47,61,.04)" }}
            >
              <span>
                <b>{results.length}</b> entri
              </span>
              <span>{category.toLowerCase()}</span>
            </div>
            {results.length ? (
              results.map((faq) => (
                <details key={faq.index} className="qa">
                  <summary>
                    <span className="font-semibold">{faq.q}</span>
                    <span className="pm">
                      <Icon name="plus" />
                    </span>
                  </summary>
                  <div className="ans">{faq.a}</div>
                </details>
              ))
            ) : (
              <div className="mono mut p-6 text-sm" style={{ borderTop: "1px solid var(--line)" }}>
                › 0 hasil untuk &quot;{query}&quot;. Hubungi support di samping.
              </div>
            )}
          </div>
        </div>

        <aside id="kontak" className="scroll-mt-24 lg:pt-24">
          <div
            className="pn dark tick4 p-6 lg:sticky lg:top-24"
            style={{ boxShadow: "8px 8px 0 var(--lem)" }}
          >
            <div className="tag" style={{ color: "#F3E64B" }}>
              // support channel
            </div>
            <h2 className="mt-3 text-2xl">Butuh manusia sungguhan?</h2>
            <p className="mt-2 text-sm" style={{ color: "#B8BCC6" }}>
              Tim support online 08.00–22.00 WIB. Sertakan kode SNX supaya
              kasusmu langsung ditangani.
            </p>
            <div className="mt-5 space-y-2">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-white/10"
                style={{ border: "1px solid rgba(247,247,242,.15)" }}
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-md"
                  style={{ background: "#F3E64B", color: "#292F3D" }}
                >
                  <Icon name="chat" />
                </span>
                <span>
                  <b className="block">WhatsApp</b>
                  <span className="mono text-xs" style={{ color: "#9AA0AE" }}>
                    {ADMIN_WA}
                  </span>
                </span>
              </a>
              <Link
                href="/lacak"
                className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-white/10"
                style={{ border: "1px solid rgba(247,247,242,.15)" }}
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-md"
                  style={{ background: "#F3E64B", color: "#292F3D" }}
                >
                  <Icon name="search" />
                </span>
                <span>
                  <b className="block">Lacak transaksi</b>
                  <span className="mono text-xs" style={{ color: "#9AA0AE" }}>
                    cek status pakai kode SPL
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
