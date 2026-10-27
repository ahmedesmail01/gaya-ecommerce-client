import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly productService = inject(ProductService);

  protected readonly categories = rxResource({
    stream: () => this.productService.getProductCategories(),
    defaultValue: [],
  });
  

  protected readonly selectedCategoryId = linkedSignal(()=>this.categories.value()[0]?.id);

  protected readonly products = rxResource({
    params: () => this.selectedCategoryId(),
    stream: ({ params: categoryId }) => this.productService.getProductList(categoryId),
    defaultValue: [],
  });
  

  

  constructor() {
    effect(() => console.log('products', this.products.value()));
    effect(() => console.log('categories', this.categories.value()));
  }

  protected readonly skeletons = Array.from({ length: 8 }, (_, i) => i);
}
