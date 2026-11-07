import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideShoppingCart } from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  imports: [LucideShoppingCart, RouterLink],
  selector: 'app-cart-status',
  styleUrl: './cart-status.css',
  templateUrl: './cart-status.html',
})
export class CartStatus {
  private readonly cartService = inject(CartService);

  protected readonly quantity = toSignal(this.cartService.totalQuantity, {
    initialValue: 0,
  });
}
