import type { Metadata } from "next";
import { Suspense } from "react";
import { BayarClient } from "@/components/BayarClient";

export const metadata: Metadata = {
  title: "Pembayaran",
};

export default function BayarPage() {
  return (
    <Suspense
      fallback={
        <main className="box pt-8">
          <div className="pn mono mut p-8 text-sm">memuat pembayaran…</div>
        </main>
      }
    >
      <BayarClient />
    </Suspense>
  );
}
