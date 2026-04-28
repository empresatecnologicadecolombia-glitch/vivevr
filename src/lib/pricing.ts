/** Deterministic pseudo-random USD amount in [min, max] (whole dollars) for stable UI display. */
export function stableUsdInRange(seed: string, min: number, max: number): number {
  if (min >= max) return min;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const span = max - min + 1;
  const n = (h >>> 0) % span;
  return min + n;
}

export const WORLD_CUP_SEMIFINALS_USD = 8;
export const WORLD_CUP_FINAL_USD = 10;

export const EVENT_TICKET_USD_MIN = 10;
export const EVENT_TICKET_USD_MAX = 15;

/** Boletas, cursos, libros (cada ítem de tienda genérico en ese bloque) */
export const STORE_GENERAL_USD_MIN = 5;
export const STORE_GENERAL_USD_MAX = 15;

/** Salas Pro y sets de streaming / transmisiones premium */
export const PREMIUM_SALA_STREAM_USD_MIN = 10;
export const PREMIUM_SALA_STREAM_USD_MAX = 15;

/** Skins: $5–12 según rango de rareza */
export const SKIN_USD_MIN = 5;
export const SKIN_USD_MAX = 12;

const SKIN_TIERS = ["Común", "Rara", "Épica", "Legendaria"] as const;
const SKIN_TIER_RANGES: readonly [number, number][] = [
  [5, 7],
  [7, 9],
  [9, 11],
  [11, 12],
] as const;

export type SkinRarityLabel = (typeof SKIN_TIERS)[number];

export function skinPriceByRarity(title: string): { usd: number; rarity: SkinRarityLabel } {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (Math.imul(31, h) + title.charCodeAt(i)) | 0;
  }
  const tier = (h >>> 0) % 4;
  const [lo, hi] = SKIN_TIER_RANGES[tier];
  const usd = stableUsdInRange(`skin-tier-${tier}:${title}`, lo, hi);
  return { usd, rarity: SKIN_TIERS[tier] };
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)} USD`;
}

type StoreProduct = { title: string; price: string; [k: string]: unknown };
type StoreCategory = { id: string; products: StoreProduct[]; [k: string]: unknown };

/**
 * Precios por categoría: libros + cursos + boletas 5–15; salas y streaming 10–15; skins 5–12 (rareza).
 */
export function mapStoreCategoriesWithDynamicPrices<T extends StoreCategory>(categories: T[]): T[] {
  return categories.map((cat) => {
    if (cat.id === "biblioteca" || cat.id === "cursos" || cat.id === "tickets") {
      return {
        ...cat,
        products: cat.products.map((p) => {
          const usd = stableUsdInRange(
            `store:${cat.id}:${p.title}`,
            STORE_GENERAL_USD_MIN,
            STORE_GENERAL_USD_MAX,
          );
          return {
            ...p,
            price: formatUsd(usd),
            priceUsd: usd,
          };
        }),
      } as T;
    }
    if (cat.id === "salas-pro" || cat.id === "set-streamer") {
      return {
        ...cat,
        products: cat.products.map((p) => {
          const usd = stableUsdInRange(
            `store:${cat.id}:${p.title}`,
            PREMIUM_SALA_STREAM_USD_MIN,
            PREMIUM_SALA_STREAM_USD_MAX,
          );
          return {
            ...p,
            price: formatUsd(usd),
            priceUsd: usd,
          };
        }),
      } as T;
    }
    if (cat.id === "skins") {
      return {
        ...cat,
        products: cat.products.map((p) => {
          const { usd, rarity } = skinPriceByRarity(p.title);
          return {
            ...p,
            price: formatUsd(usd),
            priceUsd: usd,
            skinRarity: rarity,
          };
        }),
      } as T;
    }
    return cat;
  });
}

/** Educación: mantiene rango 5–10 para cursos (pantalla educación) */
export const EDU_COURSES_USD_MIN = 5;
export const EDU_COURSES_USD_MAX = 10;
