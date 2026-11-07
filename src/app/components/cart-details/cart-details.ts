import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import type { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-cart-details',
  styleUrl: './cart-details.css',
  templateUrl: './cart-details.html',
})
export class CartDetails {
  private readonly cartService = inject(CartService);

  // same array the service holds, so changes show up here
  protected readonly cartItems = this.cartService.cartItems;

  protected readonly totalPrice = toSignal(this.cartService.totalPrice, {
    initialValue: 0,
  });
  protected readonly totalQuantity = toSignal(this.cartService.totalQuantity, {
    initialValue: 0,
  });

  protected readonly freeShippingThreshold = 50;
  protected readonly freeShipping = computed(
    () => this.totalPrice() >= this.freeShippingThreshold,
  );

  protected increment(item: CartItem) {
    this.cartService.incrementQuantity(item);
  }

  protected decrement(item: CartItem) {
    this.cartService.decrementQuantity(item);
  }

  protected remove(item: CartItem) {
    this.cartService.remove(item);
  }
}
