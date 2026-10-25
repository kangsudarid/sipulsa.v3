import type { Metadata } from "next";
import { Suspense } from "react";
import { LacakClient } from "@/components/LacakClient";

export const metadata: Metadata = {
  title: "Lacak Transaksi",
};

export default function LacakPage() {
  return (
    <Suspense
      fallback={
        <main className="box pt-10">
          <div className="pn mono mut p-8 text-sm">memuat tracker…</div>
        </main>
      }
    >
      <LacakClient />
    </Suspense>
  );
}
