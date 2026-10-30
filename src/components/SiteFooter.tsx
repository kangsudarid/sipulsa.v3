import Link from "next/link";
import { Logo } from "./Logo";
import { ADMIN_WA, WA_LINK } from "@/lib/store";
import { SERVICES, SERVICE_ORDER, type Slug } from "@/lib/catalog";

const refill: Slug[] = ["pulsa", "paket-data", "e-wallet", "game"];
const bills: Slug[] = ["pln", "pdam", "tv-internet", "bpjs", "multifinance"];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="dark mt-24">
      <div className="box py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="foot-logo">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-sm" style={{ color: "#B8BCC6" }}>
              Infrastruktur isi ulang &amp; pembayaran tagihan untuk semua orang.
              Cepat, tercatat, bisa dilacak.
            </p>
          </div>
          <div>
            <div className="tag" style={{ color: "#F3E64B" }}>
              // isi ulang
            </div>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: "#D5D8DF" }}>
              {refill.map((slug) => (
                <li key={slug}>
                  <Link className="hover:text-[#F3E64B]" href={`/checkout?s=${slug}`}>
                    {SERVICES[slug].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="tag" style={{ color: "#F3E64B" }}>
              // tagihan
            </div>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: "#D5D8DF" }}>
              {bills.map((slug) => (
                <li key={slug}>
                  <Link className="hover:text-[#F3E64B]" href={`/checkout?s=${slug}`}>
                    {SERVICES[slug].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="tag" style={{ color: "#F3E64B" }}>
              // sistem
            </div>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: "#D5D8DF" }}>
              <li>
                <Link className="hover:text-[#F3E64B]" href="/lacak">
                  Lacak transaksi
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F3E64B]" href="/bantuan">
                  Dokumentasi bantuan
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-[#F3E64B]"
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp {ADMIN_WA}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="mono mt-14 flex flex-col justify-between gap-3 pt-6 text-xs sm:flex-row"
          style={{ borderTop: "1px solid rgba(247,247,242,.12)", color: "#9AA0AE" }}
        >
          <span>© {year} Sipulsa</span>
          <span>
            v1.3 · {SERVICE_ORDER.length} layanan · uptime 99.9% · build {year}.10
          </span>
        </div>
      </div>
    </footer>
  );
}
