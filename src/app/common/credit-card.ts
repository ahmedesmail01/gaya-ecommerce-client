export interface CardBrand {
  name: string;
  /** Matched against the digits only. */
  prefix: RegExp;
  /** Allowed number lengths. */
  lengths: readonly number[];
  cvcLength: number;
}

export const CARD_BRANDS: readonly CardBrand[] = [
  { name: 'Visa', prefix: /^4/, lengths: [13, 16, 19], cvcLength: 3 },
  {
    name: 'Mastercard',
    prefix: /^(5[1-5]|2(2[2-9][1-9]|2[3-9]|[3-6]|7[01]|720))/,
    lengths: [16],
    cvcLength: 3,
  },
  { name: 'American Express', prefix: /^3[47]/, lengths: [15], cvcLength: 4 },
  { name: 'Discover', prefix: /^(6011|65|64[4-9])/, lengths: [16, 19], cvcLength: 3 },
];

/** Strips the spaces and hyphens people type between digit groups. */
export function cardDigits(value: string): string {
  return value.replace(/[\s-]/g, '');
}

export function detectCardBrand(value: string): CardBrand | undefined {
  const digits = cardDigits(value);
  return CARD_BRANDS.find((brand) => brand.prefix.test(digits));
}

/** Luhn checksum, which catches typos and swapped digits. */
export function passesLuhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/** Groups digits for display: 4-6-5 for Amex, 4-4-4-4 otherwise. */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 19);
  const groups = detectCardBrand(digits)?.name === 'American Express'
    ? digits.match(/^(\d{0,4})(\d{0,6})(\d{0,5})/)!.slice(1)
    : (digits.match(/\d{1,4}/g) ?? []);
  return groups.filter(Boolean).join(' ');
}

/** A card is valid through the last day of its expiry month. */
export function isExpired(month: string, year: string, now = new Date()): boolean {
  const m = Number(month);
  const y = Number(year);
  return y < now.getFullYear() || (y === now.getFullYear() && m < now.getMonth() + 1);
}

export function maskCardNumber(value: string): string {
  return `•••• ${cardDigits(value).slice(-4)}`;
}
