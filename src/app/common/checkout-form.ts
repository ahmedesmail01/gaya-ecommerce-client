export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Address {
  /** ISO country code, e.g. 'US'. */
  country: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CheckoutFormModel {
  customer: Customer;
  shippingAddress: Address;
  billingSameAsShipping: boolean;
  billingAddress: Address;
}

export function emptyAddress(): Address {
  return { country: '', street: '', city: '', state: '', zipCode: '' };
}

export function emptyCheckoutForm(): CheckoutFormModel {
  return {
    customer: { firstName: '', lastName: '', email: '' },
    shippingAddress: emptyAddress(),
    billingSameAsShipping: true,
    billingAddress: emptyAddress(),
  };
}
