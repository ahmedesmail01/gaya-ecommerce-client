import { Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import {
  emptyCheckoutForm,
  type Address,
  type CheckoutFormModel,
} from '../../common/checkout-form';
import { checkoutSchema } from './checkout.schema';

const validAddress: Address = {
  country: 'US',
  street: '1 Main St',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
};

function validModel(): CheckoutFormModel {
  return {
    ...emptyCheckoutForm(),
    customer: { firstName: 'Ahmed', lastName: "O'Neil-Smith", email: 'a@b.co' },
    shippingAddress: { ...validAddress },
    creditCard: {
      nameOnCard: 'Ahmed Esmail',
      cardNumber: '4242 4242 4242 4242',
      expirationMonth: '12',
      expirationYear: String(new Date().getFullYear() + 2),
      securityCode: '123',
    },
  };
}

function createForm(model: CheckoutFormModel) {
  const injector = TestBed.inject(Injector);
  return form(signal(model), checkoutSchema, { injector });
}

const firstError = (state: { errors: () => { message?: string }[] }) =>
  state.errors()[0]?.message;

describe('checkoutSchema', () => {
  it('accepts a complete form', () => {
    expect(createForm(validModel())().valid()).toBe(true);
  });

  it('rejects an empty form', () => {
    expect(createForm(emptyCheckoutForm())().valid()).toBe(false);
  });

  it('requires names and rejects whitespace-only or invalid characters', () => {
    const f = createForm(validModel());
    f.customer.firstName().value.set('');
    expect(firstError(f.customer.firstName())).toBe('First name is required');

    f.customer.firstName().value.set('   ');
    expect(firstError(f.customer.firstName())).toBe('First name cannot be only spaces');

    f.customer.lastName().value.set('Smith1');
    expect(f.customer.lastName().invalid()).toBe(true);

    f.customer.lastName().value.set('a'.repeat(51));
    expect(f.customer.lastName().invalid()).toBe(true);
  });

  it('accepts non-English names', () => {
    const f = createForm(validModel());
    f.customer.firstName().value.set('أحمد');
    f.customer.lastName().value.set('Müller');
    expect(f.customer.firstName().valid()).toBe(true);
    expect(f.customer.lastName().valid()).toBe(true);
  });

  it('validates the email format', () => {
    const f = createForm(validModel());
    f.customer.email().value.set('not-an-email');
    expect(firstError(f.customer.email())).toBe('Enter a valid email address');
  });

  it('validates the postal code against the selected country', () => {
    const f = createForm(validModel());
    const zip = f.shippingAddress.zipCode;

    zip().value.set('K1A 0B1');
    expect(zip().invalid()).toBe(true); // not a US code

    f.shippingAddress.country().value.set('CA');
    expect(zip().valid()).toBe(true); // re-checked after the country changed

    f.shippingAddress.country().value.set('US');
    zip().value.set('12345-6789');
    expect(zip().valid()).toBe(true);
  });

  it('ignores billing while it is the same as shipping', () => {
    const f = createForm(validModel());
    expect(f().valid()).toBe(true);

    f.billingSameAsShipping().value.set(false);
    expect(f.billingAddress().invalid()).toBe(true);
    expect(f().valid()).toBe(false);

    f.billingAddress().value.set({ ...validAddress, country: 'GB', zipCode: 'SW1A 1AA' });
    expect(f().valid()).toBe(true);
  });

  describe('credit card', () => {
    it('validates the card number', () => {
      const f = createForm(validModel());
      const num = f.creditCard.cardNumber;

      num().value.set('');
      expect(firstError(num())).toBe('Card number is required');

      num().value.set('4242 4242 4242 4241');
      expect(firstError(num())).toBe('Check your card number for typos');

      num().value.set('4242 4242 42');
      expect(firstError(num())).toBe('Visa card numbers are 13 or 16 or 19 digits');

      num().value.set('9999 9999 9999 9999');
      expect(num().errors()[0]?.kind).toBe('cardBrand');

      num().value.set('4242-abcd');
      expect(num().errors()[0]?.kind).toBe('cardFormat');

      for (const valid of ['5555555555554444', '378282246310005', '6011111111111117']) {
        num().value.set(valid);
        expect(num().valid(), valid).toBe(true);
      }
    });

    it('rejects an expired card and re-checks when the year changes', () => {
      const f = createForm(validModel());
      const now = new Date();
      const month = f.creditCard.expirationMonth;

      f.creditCard.expirationYear().value.set(String(now.getFullYear() - 1));
      expect(firstError(month())).toBe('This card has expired');

      f.creditCard.expirationYear().value.set(String(now.getFullYear()));
      month().value.set(String(now.getMonth() + 1).padStart(2, '0'));
      expect(month().valid()).toBe(true); // valid through the end of this month
    });

    it('requires a 4-digit security code for Amex and 3 digits otherwise', () => {
      const f = createForm(validModel());
      const cvc = f.creditCard.securityCode;

      cvc().value.set('1234');
      expect(firstError(cvc())).toBe('Security code must be 3 digits');

      cvc().value.set('123');
      f.creditCard.cardNumber().value.set('378282246310005');
      expect(firstError(cvc())).toBe('Security code must be 4 digits'); // re-checked for Amex
      cvc().value.set('1234');
      expect(cvc().valid()).toBe(true);
    });

    it('validates the name on card', () => {
      const f = createForm(validModel());
      f.creditCard.nameOnCard().value.set('');
      expect(firstError(f.creditCard.nameOnCard())).toBe('Name on card is required');
    });
  });
});
