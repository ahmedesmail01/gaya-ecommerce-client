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

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetails {
  private readonly productService = inject(ProductService);

  // Filled from the URL: /products/5 → id = 5
  readonly id = input.required({ transform: numberAttribute });

  protected readonly product = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.productService.getProduct(id),
  });

  protected readonly quantity = signal(1);
  protected readonly maxQuantity = 10;
}
