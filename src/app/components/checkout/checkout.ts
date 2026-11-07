import { CurrencyPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import {
  emptyCheckoutForm,
  type CheckoutFormModel,
} from '../../common/checkout-form';
import { CartService } from '../../services/cart';
import { FieldErrors } from '../field-errors/field-errors';
import { AddressFields } from './address-fields/address-fields';
import { checkoutSchema } from './checkout.schema';

@Component({
  imports: [CurrencyPipe, RouterLink, FormRoot, FormField, FieldErrors, AddressFields],
  selector: 'app-checkout',
  styleUrl: './checkout.css',
  templateUrl: './checkout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  private readonly cartService = inject(CartService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly cartItems = this.cartService.cartItems;
  protected readonly totalPrice = toSignal(this.cartService.totalPrice, {
    initialValue: 0,
  });
  protected readonly totalQuantity = toSignal(this.cartService.totalQuantity, {
    initialValue: 0,
  });

  private readonly model = signal<CheckoutFormModel>(emptyCheckoutForm());

  protected readonly checkoutForm = form(this.model, checkoutSchema, {
    submission: {
      action: async () => {
        this.placeOrder();
        return undefined;
      },
      onInvalid: () => this.focusFirstInvalidField(),
    },
  });

  protected readonly orderPlaced = signal(false);

  private placeOrder() {
    const value = this.model();
    const order = {
      customer: value.customer,
      shippingAddress: value.shippingAddress,
      billingAddress: value.billingSameAsShipping
        ? value.shippingAddress
        : value.billingAddress,
      items: this.cartItems.map(({ id, quantity, unitPrice }) => ({
        productId: id,
        quantity,
        unitPrice,
      })),
      totalQuantity: this.totalQuantity(),
      totalPrice: this.totalPrice(),
    };

    // Replace with the purchase API call once the backend endpoint exists.
    // eslint-disable-next-line no-console -- placeholder until the order API exists
    console.info('order', order);
    this.orderPlaced.set(true);
  }

  /** Submit marks every field touched; wait for the errors to render, then focus the first one. */
  private focusFirstInvalidField() {
    afterNextRender(
      () =>
        this.host.nativeElement
          .querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      { injector: this.injector },
    );
  }
}
