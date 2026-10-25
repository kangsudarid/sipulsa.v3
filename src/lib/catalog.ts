import type { IconName } from "./icons";

export type Slug =
  | "pulsa"
  | "paket-data"
  | "e-wallet"
  | "pln"
  | "pdam"
  | "tv-internet"
  | "game"
  | "bpjs"
  | "multifinance";

export type Category = "isi" | "tagihan" | "hiburan";

export type ProductItem = {
  n: string;
  p: number;
  sub?: string;
};

export type Service = {
  name: string;
  cat: Category;
  catL: string;
  icon: IconName;
  desc: string;
  label: string;
  ph: string;
  targetType: "phone" | "id";
  detect?: boolean;
  bill?: boolean;
  admin?: number;
  prov: string[];
  items?: Record<string, ProductItem[]>;
};

export const formatRp = (n: number) => "Rp" + Math.round(n).toLocaleString("id-ID");
const fmt = (n: number) => n.toLocaleString("id-ID");

const OPERATORS: Record<string, string[]> = {
  Telkomsel: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"],
  Indosat: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
  XL: ["0817", "0818", "0819", "0859", "0877", "0878"],
  Axis: ["0831", "0832", "0833", "0838"],
  Tri: ["0895", "0896", "0897", "0898", "0899"],
  Smartfren: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"],
};

export const OPERATOR_NAMES = Object.keys(OPERATORS);

export const normalizePhone = (value: string) => {
  let v = (value || "").replace(/\D/g, "");
  if (v.startsWith("62")) v = "0" + v.slice(2);
  else if (v.startsWith("8")) v = "0" + v;
  return v;
};

export const detectOperator = (value: string) => {
  const prefix = normalizePhone(value).slice(0, 4);
  if (prefix.length < 4) return null;
  for (const name of OPERATOR_NAMES) {
    if (OPERATORS[name].includes(prefix)) return name;
  }
  return null;
};

const pulsaBase: [number, number][] = [
  [5, 6200],
  [10, 11000],
  [20, 20900],
  [25, 25800],
  [50, 50800],
  [100, 100200],
];

const operatorAdj: Record<string, number> = {
  Telkomsel: 0,
  Indosat: -150,
  XL: -100,
  Axis: -200,
  Tri: -250,
  Smartfren: -300,
};

const pulsa = (operator: string): ProductItem[] =>
  pulsaBase.map(([k, p]) => ({
    n: `Pulsa ${k}rb`,
    p: p + operatorAdj[operator] * (k >= 50 ? 2 : 1),
  }));

const dataBase: [string, number][] = [
  ["Data 3GB · 7 hari", 15000],
  ["Data 8GB · 30 hari", 38000],
  ["Data 15GB · 30 hari", 62000],
  ["Data 25GB · 30 hari", 88000],
  ["Data 50GB · 30 hari", 135000],
  ["Unlimited Harian · 30 hari", 99000],
];

const paket = (operator: string): ProductItem[] =>
  dataBase.map(([n, p]) => ({ n, p: p + operatorAdj[operator] * 10 }));

const nominal = (list: number[], admin: number, label = "Saldo"): ProductItem[] =>
  list.map((v) => ({ n: `${label} ${fmt(v)}`, p: v + admin, sub: `Admin ${formatRp(admin)}` }));

const fill = (list: string[], fn: (value: string) => ProductItem[]) =>
  Object.fromEntries(list.map((x) => [x, fn(x)])) as Record<string, ProductItem[]>;

const itemList = (rows: [string, number][]): ProductItem[] => rows.map(([n, p]) => ({ n, p }));

const wallets = ["DANA", "OVO", "GoPay", "ShopeePay", "LinkAja"];

export const SERVICES: Record<Slug, Service> = {
  pulsa: {
    name: "Pulsa",
    cat: "isi",
    catL: "Isi ulang",
    icon: "phone",
    desc: "Isi pulsa semua operator, masuk dalam hitungan detik.",
    label: "Nomor HP",
    ph: "0812 3456 7890",
    targetType: "phone",
    detect: true,
    prov: OPERATOR_NAMES,
    items: fill(OPERATOR_NAMES, pulsa),
  },
  "paket-data": {
    name: "Paket Data",
    cat: "isi",
    catL: "Isi ulang",
    icon: "wifi",
    desc: "Kuota internet harian sampai bulanan, langsung aktif.",
    label: "Nomor HP",
    ph: "0812 3456 7890",
    targetType: "phone",
    detect: true,
    prov: OPERATOR_NAMES,
    items: fill(OPERATOR_NAMES, paket),
  },
  "e-wallet": {
    name: "E-Wallet",
    cat: "isi",
    catL: "Isi ulang",
    icon: "wallet",
    desc: "Top up saldo DANA, OVO, GoPay, ShopeePay & LinkAja.",
    label: "Nomor HP terdaftar",
    ph: "0812 3456 7890",
    targetType: "phone",
    prov: wallets,
    items: fill(wallets, () => nominal([10000, 20000, 25000, 50000, 100000, 200000], 1500)),
  },
  pln: {
    name: "Token PLN",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "bolt",
    desc: "Beli token listrik prabayar, kode token langsung muncul.",
    label: "Nomor meter / ID pelanggan",
    ph: "5123 4567 8901",
    targetType: "id",
    prov: ["PLN Prabayar"],
    items: { "PLN Prabayar": nominal([20000, 50000, 100000, 200000, 500000], 2500, "Token") },
  },
  pdam: {
    name: "PDAM",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "drop",
    desc: "Bayar tagihan air PDAM se-Indonesia tanpa antre.",
    label: "ID pelanggan PDAM",
    ph: "0123456789",
    targetType: "id",
    bill: true,
    admin: 2500,
    prov: ["PDAM Jakarta", "PDAM Surabaya", "PDAM Bandung", "PDAM Medan"],
  },
  "tv-internet": {
    name: "TV & Internet",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "tv",
    desc: "IndiHome, Biznet, First Media, MyRepublic, semua bisa.",
    label: "Nomor pelanggan",
    ph: "1234 5678 90",
    targetType: "id",
    bill: true,
    admin: 2500,
    prov: ["IndiHome", "Biznet", "First Media", "MyRepublic"],
  },
  game: {
    name: "Voucher Game",
    cat: "hiburan",
    catL: "Hiburan",
    icon: "game",
    desc: "Diamond, UC, dan voucher game favoritmu.",
    label: "User ID (dan Zone ID)",
    ph: "12345678 (1234)",
    targetType: "id",
    prov: ["Mobile Legends", "Free Fire", "PUBG Mobile"],
    items: {
      "Mobile Legends": itemList([
        ["86 Diamonds", 24500],
        ["172 Diamonds", 48500],
        ["257 Diamonds", 72000],
        ["344 Diamonds", 97000],
        ["706 Diamonds", 198000],
        ["Weekly Diamond Pass", 34900],
      ]),
      "Free Fire": itemList([
        ["70 Diamonds", 10900],
        ["140 Diamonds", 21500],
        ["355 Diamonds", 51000],
        ["720 Diamonds", 101000],
        ["1450 Diamonds", 196000],
      ]),
      "PUBG Mobile": itemList([
        ["60 UC", 17500],
        ["325 UC", 80500],
        ["660 UC", 167000],
      ]),
    },
  },
  bpjs: {
    name: "BPJS Kesehatan",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "shield",
    desc: "Iuran BPJS Kesehatan per kelas, bisa bayar beberapa bulan.",
    label: "Nomor VA / No. BPJS",
    ph: "8888 8012 3456 7890",
    targetType: "id",
    prov: ["Kelas 1", "Kelas 2", "Kelas 3"],
    items: fill(["Kelas 1", "Kelas 2", "Kelas 3"], (k) => {
      const base = { "Kelas 1": 150000, "Kelas 2": 100000, "Kelas 3": 35000 }[k] as number;
      return [1, 2, 3, 6, 12].map((m) => ({
        n: `${m} bulan`,
        p: base * m + 2500,
        sub: `${formatRp(base)}/bln + admin`,
      }));
    }),
  },
  multifinance: {
    name: "Multifinance",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "car",
    desc: "Cicilan motor & mobil: Adira, FIF, BAF, WOM.",
    label: "Nomor kontrak",
    ph: "010203040506",
    targetType: "id",
    bill: true,
    admin: 3000,
    prov: ["Adira Finance", "FIF Group", "BAF", "WOM Finance"],
  },
};

export const SERVICE_ORDER: Slug[] = [
  "pulsa",
  "paket-data",
  "e-wallet",
  "pln",
  "pdam",
  "tv-internet",
  "game",
  "bpjs",
  "multifinance",
];

export const SERVICE_CODES: Record<Slug, string> = {
  pulsa: "PLS",
  "paket-data": "DAT",
  "e-wallet": "EWL",
  pln: "PLN",
  pdam: "H2O",
  "tv-internet": "NET",
  game: "GME",
  bpjs: "BPJ",
  multifinance: "MFN",
};

export const CATEGORIES: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "isi", label: "Isi ulang" },
  { key: "tagihan", label: "Tagihan" },
  { key: "hiburan", label: "Hiburan" },
];

export const isSlug = (value: string | null | undefined): value is Slug =>
  !!value && SERVICE_ORDER.includes(value as Slug);

export type Bill = {
  nama: string;
  periode: string;
  tagihan: number;
  admin: number;
  total: number;
};

export const simulateBill = (slug: Slug, provider: string, id: string): Bill => {
  let hash = 0;
  for (const c of id + provider) hash = (hash * 31 + c.charCodeAt(0)) % 100000;
  const bills: Partial<Record<Slug, number>> = {
    pdam: 85000,
    "tv-internet": 330000,
    multifinance: 780000,
  };
  const base = bills[slug] ?? 85000;
  const amount = Math.round((base + hash * (slug === "multifinance" ? 3 : 1.5)) / 100) * 100;
  const names = ["Budi Santoso", "Siti Rahma", "Andi Wijaya", "Dewi Lestari", "Rizky Pratama", "Nur Aini"];
  const admin = SERVICES[slug].admin ?? 0;
  return {
    nama: names[hash % names.length],
    periode: hash % 2 === 0 ? "Okt 2026" : "Sep–Okt 2026",
    tagihan: amount,
    admin,
    total: amount + admin,
  };
};

export const minPrice = (slug: Slug): number | null => {
  const service = SERVICES[slug];
  if (service.bill || !service.items) return null;
  let min = Number.POSITIVE_INFINITY;
  for (const key of Object.keys(service.items)) {
    for (const item of service.items[key]) min = Math.min(min, item.p);
  }
  return min;
};
