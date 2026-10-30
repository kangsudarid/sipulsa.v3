import Link from "next/link";
import { CommandBar } from "@/components/CommandBar";
import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { Icon } from "@/components/Icon";
import { SERVICE_ORDER } from "@/lib/catalog";

const BENEFITS = [
  {
    icon: "bolt" as const,
    title: "Otomatis 24/7",
    body: "Diproses detik itu juga, kapan pun.",
  },
  {
    icon: "search" as const,
    title: "Bisa dilacak",
    body: "Setiap pesanan punya kode SNX.",
  },
  {
    icon: "user" as const,
    title: "Tanpa akun",
    body: "Langsung pesan, tanpa daftar.",
  },
];

const SPECS = [
  { icon: "bolt" as const, value: "±5s", body: "rata-rata waktu proses" },
  { icon: "refund" as const, value: "auto", body: "refund jika transaksi gagal" },
  { icon: "receipt" as const, value: "SNX-ID", body: "setiap order punya kode lacak" },
  { icon: "user" as const, value: "0", body: "registrasi yang dibutuhkan" },
];

export default function HomePage() {
  return (
    <main>
      <section className="box pt-12 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <Link href="/layanan" className="hx-pill">
            <span className="hx-new">BARU</span> {SERVICE_ORDER.length} layanan,
            tanpa akun, bayar QRIS gratis <Icon name="arrow" />
          </Link>
          <h1 className="mt-7 text-[44px] leading-[1] sm:text-7xl lg:text-[88px]">
            Isi ulang &amp; tagihan,
            <br />
            <span className="hx-u">tanpa ribet.</span>
          </h1>
          <p className="mut mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
            Pulsa, kuota, e-wallet, token listrik, voucher game, sampai cicilan.
            Ketik nomor atau nama layanan, bayar, beres.
          </p>
        </div>

        <CommandBar />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6 lg:mt-20">
          <div className="hx-card dark flex flex-col p-6 md:col-span-3 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="tag" style={{ color: "#9AA0AE" }}>
                Transaksi
              </span>
              <span className="hx-ok">● Berhasil</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: "var(--lem)", color: "var(--ink)" }}
              >
                <Icon name="phone" />
              </span>
              <div>
                <div className="font-bold">Pulsa Telkomsel</div>
                <div className="mono text-xs" style={{ color: "#9AA0AE" }}>
                  0812 •••• 4488
                </div>
              </div>
            </div>
            <div className="mt-auto flex items-end justify-between pt-8">
              <div>
                <div className="mono text-xs" style={{ color: "#9AA0AE" }}>
                  TOTAL
                </div>
                <div className="text-3xl font-extrabold tracking-tight">Rp51.250</div>
              </div>
              <div className="text-right">
                <div className="mono text-xs" style={{ color: "#9AA0AE" }}>
                  WAKTU
                </div>
                <div className="mono font-bold" style={{ color: "var(--lem)" }}>
                  4,8 dtk
                </div>
              </div>
            </div>
          </div>

          <div
            className="hx-card p-6 md:col-span-3 lg:col-span-2"
            style={{ background: "var(--lem)", borderColor: "var(--lem)", color: "#292F3D" }}
          >
            <span className="tag" style={{ color: "#292F3D" }}>
              Kenapa Sipulsa
            </span>
            <div className="mt-5 space-y-4">
              {BENEFITS.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <Icon name={benefit.icon} />
                  <div>
                    <b>{benefit.title}</b>
                    <div className="text-sm opacity-75">{benefit.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hx-card flex flex-col p-6 md:col-span-6 lg:col-span-2">
            <span className="tag">Pembayaran</span>
            <div
              className="mt-5 flex items-center gap-4 rounded-xl p-4"
              style={{ border: "1px solid var(--line)" }}
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-lg"
                style={{ background: "var(--ink)", color: "var(--lem)" }}
              >
                <Icon name="qr" />
              </span>
              <div className="min-w-0">
                <div className="font-bold">QRIS</div>
                <div className="mono text-[11px] text-mut">
                  semua bank &amp; e-wallet · tanpa biaya
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-mut">
              Satu kode untuk BCA, Mandiri, DANA, OVO, GoPay, dan aplikasi
              lainnya.
            </p>
            <div
              className="mt-auto grid grid-cols-3 border-t pt-6 text-center"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="pt-4">
                <div className="text-2xl font-extrabold">9</div>
                <div className="tag text-[10px]">Layanan</div>
              </div>
              <div className="pt-4">
                <div className="text-2xl font-extrabold">24/7</div>
                <div className="tag text-[10px]">Online</div>
              </div>
              <div className="pt-4">
                <div className="text-2xl font-extrabold">0</div>
                <div className="tag text-[10px]">Akun wajib</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="box pt-24">
        <div className="rv flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-4xl sm:text-5xl">
            Semua layanan,
            <br className="sm:hidden" /> satu tempat bayar.
          </h2>
          <Link href="/layanan" className="b b-out self-start md:self-auto">
            Lihat katalog lengkap
          </Link>
        </div>
        <DirectoryExplorer />
      </section>

      <section className="box pt-24">
        <div className="rv">
          <div className="tag">
            <b>[SX-03]</b> &nbsp;Cara pakai
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Ketik, bayar, <span className="hl">beres.</span>
          </h2>
        </div>
        <div className="relative mt-10 grid gap-4 md:grid-cols-3 md:gap-0">
          <div className="rv pn p-6 md:rounded-r-none">
            <div className="flex items-center justify-between">
              <span
                className="mono rounded px-2 py-1 text-xs font-bold"
                style={{ background: "var(--lem)" }}
              >
                STEP_01
              </span>
              <span className="mono mut text-xs">~10 dtk</span>
            </div>
            <h3 className="mt-8 text-2xl">Masukkan tujuan</h3>
            <p className="mut mt-2 text-[15px] leading-relaxed">
              Nomor HP, ID pelanggan, atau user ID game. Operator dikenali
              otomatis dari prefix.
            </p>
          </div>
          <div
            className="rv pn p-6 md:rounded-none md:border-l-0"
            style={{ transitionDelay: ".08s" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="mono rounded px-2 py-1 text-xs font-bold"
                style={{ background: "var(--lem)" }}
              >
                STEP_02
              </span>
              <span className="mono mut text-xs">~20 dtk</span>
            </div>
            <h3 className="mt-8 text-2xl">Scan QRIS</h3>
            <p className="mut mt-2 text-[15px] leading-relaxed">
              Buka aplikasi bank atau e-wallet apa pun, scan satu kode. Tanpa
              biaya tambahan.
            </p>
          </div>
          <div
            className="rv pn dark p-6 md:rounded-l-none"
            style={{ transitionDelay: ".16s" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="mono rounded px-2 py-1 text-xs font-bold"
                style={{ background: "var(--lem)", color: "var(--ink)" }}
              >
                STEP_03
              </span>
              <span className="mono text-xs" style={{ color: "#9AA0AE" }}>
                ±5 dtk
              </span>
            </div>
            <h3 className="mt-8 text-2xl">Diproses &amp; terkirim</h3>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "#B8BCC6" }}>
              Sistem meneruskan ke provider. Gagal? Dana dikembalikan otomatis.
            </p>
          </div>
        </div>
      </section>

      <section className="box pt-24">
        <div className="rv">
          <div className="tag">
            <b>[SX-04]</b> &nbsp;Keunggulan
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl">
            Cepat, aman,
            <br />
            nggak bikin pusing.
          </h2>
        </div>
        <div
          className="pn mt-10 grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4"
          style={{ background: "var(--line2)" }}
        >
          {SPECS.map((spec) => (
            <div key={spec.value} className="rv bg-white p-5 sm:p-6">
              <Icon name={spec.icon} />
              <div className="mono mt-6 text-2xl font-bold sm:text-3xl">
                {spec.value}
              </div>
              <div className="mut mt-1 text-sm">{spec.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="box pt-24">
        <div
          className="rv pn tick4 flex flex-col justify-between gap-6 p-8 sm:p-12 lg:flex-row lg:items-center"
          style={{ background: "var(--lem)", borderColor: "var(--ink)" }}
        >
          <div>
            <div className="tag" style={{ color: "#292F3D" }}>
              // siap eksekusi
            </div>
            <h2 className="mt-3 max-w-xl text-4xl sm:text-5xl">
              Transaksi pertamamu cuma butuh satu nomor.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/checkout?s=pulsa" className="b b-ink">
              Isi pulsa sekarang
            </Link>
            <Link href="/bantuan" className="b b-out">
              Baca FAQ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
