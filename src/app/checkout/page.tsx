import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="box pt-8">
          <div className="pn mono mut p-8 text-sm">memuat checkout…</div>
        </main>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
