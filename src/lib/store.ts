import type { Slug } from "./catalog";

export const ORDERS_KEY = "suknexaidea_orders";
export const QRIS_IMAGE =
  "https://res.cloudinary.com/dqjh7utdb/image/upload/v1792161327/camhvfeu1lcm0ps8ieiz.jpg";
export const ADMIN_WA = "0851357266414";
export const WA_LINK = "https://wa.me/6281357266414";
export const PAID_MESSAGE = "Terima kasih, pembayaran Anda sedang diproses";

export type Order = {
  id: string;
  slug: Slug;
  product: string;
  provider: string;
  item: string;
  target: string;
  amount: number;
  method: "QRIS";
  status: "processing";
  createdAt: number;
};

export const newOrderId = () =>
  `SPL-${Date.now().toString(36).toUpperCase().slice(-6)}`;

export const loadOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
};

export const saveOrder = (order: Order): void => {
  if (typeof window === "undefined") return;
  try {
    const all = loadOrders();
    all.unshift(order);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(all.slice(0, 30)));
  } catch {
    /* storage unavailable */
  }
};

export const findOrder = (id: string): Order | undefined => {
  const key = id.trim().toUpperCase();
  return loadOrders().find((order) => order.id === key);
};

export const waLink = (message: string) =>
  `${WA_LINK}?text=${encodeURIComponent(message)}`;

export const formatTime = (value: number) =>
  new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const formatDate = (value: number) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
