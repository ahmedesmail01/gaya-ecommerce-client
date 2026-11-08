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

export interface CreditCard {
  nameOnCard: string;
  /** As typed, may contain spaces between digit groups. */
  cardNumber: string;
  /** '01'–'12'. */
  expirationMonth: string;
  /** Four digits, e.g. '2028'. */
  expirationYear: string;
  securityCode: string;
}

export interface CheckoutFormModel {
  customer: Customer;
  shippingAddress: Address;
  billingSameAsShipping: boolean;
  billingAddress: Address;
  creditCard: CreditCard;
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
    creditCard: {
      nameOnCard: '',
      cardNumber: '',
      expirationMonth: '',
      expirationYear: '',
      securityCode: '',
    },
  };
}
