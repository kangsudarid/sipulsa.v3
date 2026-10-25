import type { Metadata } from "next";
import { LayananClient } from "@/components/LayananClient";

export const metadata: Metadata = {
  title: "Katalog Layanan",
};

export default function LayananPage() {
  return (
    <main className="box pt-10">
      <LayananClient />
    </main>
  );
}
