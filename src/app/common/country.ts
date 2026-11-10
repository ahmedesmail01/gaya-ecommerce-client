/** A country as returned by `GET /api/countries`. */
export interface Country {
  id: number;
  code: string;
  name: string;
}

/** Client-side postal code rules, keyed by country code. Not served by the API. */
export interface CountryPostalRule {
  code: string;
  name: string;
  /** Postal code format for this country. */
  postalCode: RegExp;
  /** Shown in the hint and error message. */
  postalExample: string;
}

// export const COUNTRIES: readonly CountryPostalRule[] = [
//   { code: 'AU', name: 'Australia', postalCode: /^\d{4}$/, postalExample: '2000' },
//   {
//     code: 'CA',
//     name: 'Canada',
//     postalCode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
//     postalExample: 'K1A 0B1',
//   },
//   { code: 'EG', name: 'Egypt', postalCode: /^\d{5}$/, postalExample: '11511' },
//   { code: 'FR', name: 'France', postalCode: /^\d{5}$/, postalExample: '75001' },
//   { code: 'DE', name: 'Germany', postalCode: /^\d{5}$/, postalExample: '10115' },
//   { code: 'IN', name: 'India', postalCode: /^[1-9]\d{5}$/, postalExample: '110001' },
//   {
//     code: 'SA',
//     name: 'Saudi Arabia',
//     postalCode: /^\d{5}(-\d{4})?$/,
//     postalExample: '12271',
//   },
//   {
//     code: 'GB',
//     name: 'United Kingdom',
//     postalCode: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
//     postalExample: 'SW1A 1AA',
//   },
//   {
//     code: 'US',
//     name: 'United States',
//     postalCode: /^\d{5}(-\d{4})?$/,
//     postalExample: '12345 or 12345-6789',
//   },
// ];

// export function findCountry(code: string): CountryPostalRule | undefined {
//   return COUNTRIES.find((c) => c.code === code);
// }
