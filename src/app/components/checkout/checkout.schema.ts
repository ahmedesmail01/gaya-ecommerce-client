import {
  apply,
  applyWhen,
  email,
  maxLength,
  pattern,
  required,
  schema,
  validate,
  type PathKind,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';
import type { Address, CheckoutFormModel, CreditCard } from '../../common/checkout-form';
import { findCountry } from '../../common/country';
import { cardDigits, detectCardBrand, isExpired, passesLuhn } from '../../common/credit-card';

/** Letters (any language), spaces, apostrophes, dots and hyphens; must start with a letter. */
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}' .-]*$/u;

/** Required, and not just whitespace. */
function requiredText<K extends PathKind>(
  path: SchemaPath<string, SchemaPathRules.Supported, K>,
  label: string,
) {
  required(path, { message: `${label} is required` });
  validate(path, ({ value }) =>
    value() !== '' && value().trim() === ''
      ? { kind: 'blank', message: `${label} cannot be only spaces` }
      : undefined,
  );
}

function personName<K extends PathKind>(
  path: SchemaPath<string, SchemaPathRules.Supported, K>,
  label: string,
) {
  requiredText(path, label);
  maxLength(path, 50, { message: `${label} must be 50 characters or fewer` });
  pattern(path, NAME_PATTERN, {
    message: `${label} can only contain letters, spaces, hyphens and apostrophes`,
  });
}

/** Shared by the shipping and billing addresses. */
export const addressSchema = schema<Address>((a) => {
  required(a.country, { message: 'Select a country' });

  requiredText(a.street, 'Street address');
  maxLength(a.street, 100, { message: 'Street address must be 100 characters or fewer' });

  requiredText(a.city, 'City');
  maxLength(a.city, 60, { message: 'City must be 60 characters or fewer' });
  pattern(a.city, NAME_PATTERN, {
    message: 'City can only contain letters, spaces, hyphens and apostrophes',
  });

  requiredText(a.state, 'State / province');
  maxLength(a.state, 60, { message: 'State / province must be 60 characters or fewer' });

  requiredText(a.zipCode, 'Postal code');
  // The format depends on the selected country and re-checks when it changes.
  pattern(a.zipCode, ({ valueOf }) => findCountry(valueOf(a.country))?.postalCode, {
    message: ({ valueOf }) =>
      `Enter a valid postal code, e.g. ${findCountry(valueOf(a.country))?.postalExample}`,
  });
});

export const creditCardSchema = schema<CreditCard>((c) => {
  personName(c.nameOnCard, 'Name on card');

  requiredText(c.cardNumber, 'Card number');
  validate(c.cardNumber, ({ value }) => {
    const digits = cardDigits(value());
    if (digits === '') return undefined; // reported by required
    if (!/^\d+$/.test(digits)) {
      return { kind: 'cardFormat', message: 'Card number can only contain digits' };
    }
    const brand = detectCardBrand(digits);
    if (!brand) {
      return {
        kind: 'cardBrand',
        message: 'We accept Visa, Mastercard, American Express and Discover',
      };
    }
    if (!brand.lengths.includes(digits.length)) {
      return {
        kind: 'cardLength',
        message: `${brand.name} card numbers are ${brand.lengths.join(' or ')} digits`,
      };
    }
    if (!passesLuhn(digits)) {
      return { kind: 'cardChecksum', message: 'Check your card number for typos' };
    }
    return undefined;
  });

  required(c.expirationMonth, { message: 'Select the expiry month' });
  required(c.expirationYear, { message: 'Select the expiry year' });
  // Shown on the month so the error sits under the expiry fields; re-checks when the year changes.
  validate(c.expirationMonth, ({ value, valueOf }) => {
    const year = valueOf(c.expirationYear);
    return value() && year && isExpired(value(), year)
      ? { kind: 'expired', message: 'This card has expired' }
      : undefined;
  });

  requiredText(c.securityCode, 'Security code');
  // Amex uses a 4-digit code on the front; everyone else 3 on the back.
  validate(c.securityCode, ({ value, valueOf }) => {
    if (value() === '') return undefined;
    const length = detectCardBrand(valueOf(c.cardNumber))?.cvcLength;
    const ok = length ? new RegExp(`^\\d{${length}}$`).test(value()) : /^\d{3,4}$/.test(value());
    return ok
      ? undefined
      : { kind: 'cvc', message: `Security code must be ${length ?? '3 or 4'} digits` };
  });
});

export const checkoutSchema = schema<CheckoutFormModel>((p) => {
  personName(p.customer.firstName, 'First name');
  personName(p.customer.lastName, 'Last name');

  requiredText(p.customer.email, 'Email');
  email(p.customer.email, { message: 'Enter a valid email address' });
  maxLength(p.customer.email, 254, { message: 'Email is too long' });

  apply(p.shippingAddress, addressSchema);

  // Billing is only validated when it differs from shipping.
  applyWhen(
    p.billingAddress,
    ({ valueOf }) => !valueOf(p.billingSameAsShipping),
    addressSchema,
  );

  apply(p.creditCard, creditCardSchema);
});
