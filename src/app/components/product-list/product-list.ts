import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product';
import { Search } from '../search/search';

@Component({
  imports: [CurrencyPipe, Search],
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

  protected readonly selectedCategoryId = linkedSignal(
    () => this.categories.value()[0]?.id,
  );

  protected readonly searchKeyword = signal('');

  protected readonly products = rxResource({
    // A search keyword wins over the selected category.
    // Returning undefined keeps the resource idle (no request yet).
    params: () => {
      const keyword = this.searchKeyword();
      if (keyword) return { kind: 'search' as const, keyword };

      const categoryId = this.selectedCategoryId();
      return categoryId === undefined
        ? undefined
        : { kind: 'category' as const, categoryId };
    },
    stream: ({ params }) =>
      params.kind === 'search'
        ? this.productService.searchProducts(params.keyword)
        : this.productService.getProductList(params.categoryId),
    defaultValue: [],
  });

  protected selectCategory(categoryId: number) {
    this.searchKeyword.set('');
    this.selectedCategoryId.set(categoryId);
  }

  constructor() {
    effect(() => console.log('products', this.products.value()));
    effect(() => console.log('categories', this.categories.value()));
  }

  protected readonly skeletons = Array.from(
    { length: 8 },
    (_, i) => i,
  );
}
