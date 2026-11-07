import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { CartItem } from '../../common/cart-item';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  // Filled from the URL: /products/5 → id = 5
  readonly id = input.required({ transform: numberAttribute });

  protected readonly product = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.productService.getProduct(id),
  });

  protected readonly quantity = signal(1);
  protected readonly maxQuantity = 10;

  // add to cart with the selected quantity
  protected addToCart() {
    const product = this.product.value();
    if (!product) return;

    const theCartItem = new CartItem(
      product.id,
      product.name,
      product.imageUrl,
      product.unitePrice,
    );
    theCartItem.quantity = this.quantity();

    this.cartService.addToCart(theCartItem);

    // reset the selector for the next add
    this.quantity.set(1);
  }
}
