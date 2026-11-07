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
});
