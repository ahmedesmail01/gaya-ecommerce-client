import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product';
import { RouterLink } from '@angular/router';
import { Search } from '../search/search';
import { Product } from '../../common/product';

@Component({
  imports: [CurrencyPipe, RouterLink, Search],
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

  protected readonly pageSize = signal(8);

  // Back to the first page whenever the filter changes.
  protected readonly pageNumber = linkedSignal({
    source: () => ({
      keyword: this.searchKeyword(),
      categoryId: this.selectedCategoryId(),
      size: this.pageSize(),
    }),
    computation: () => 0,
  });

  protected readonly productPage = rxResource({
    // A search keyword wins over the selected category.
    // Returning undefined keeps the resource idle (no request yet).
    params: () => {
      const page = this.pageNumber();
      const size = this.pageSize();
      const keyword = this.searchKeyword();
      if (keyword) return { kind: 'search' as const, keyword, page, size };

      const categoryId = this.selectedCategoryId();
      return categoryId === undefined
        ? undefined
        : { kind: 'category' as const, categoryId, page, size };
    },
    stream: ({ params }) =>
      params.kind === 'search'
        ? this.productService.searchProducts(
            params.keyword,
            params.page,
            params.size,
          )
        : this.productService.getProductList(
            params.categoryId,
            params.page,
            params.size,
          ),
    defaultValue: {
      products: [],
      page: { size: 0, totalElements: 0, totalPages: 0, number: 0 },
    },
  });

  protected readonly products = computed(
    () => this.productPage.value().products,
  );

  protected readonly page = computed(() => this.productPage.value().page);

  // Up to 5 page numbers centred on the current page (0-based).
  protected readonly visiblePages = computed(() => {
    const { number, totalPages } = this.page();
    const windowSize = Math.min(5, totalPages);
    const start = Math.min(
      Math.max(number - 2, 0),
      totalPages - windowSize,
    );
    return Array.from({ length: windowSize }, (_, i) => start + i);
  });

  protected goToPage(page: number) {
    const { totalPages } = this.page();
    if (page < 0 || page >= totalPages || page === this.pageNumber()) {
      return;
    }
    this.pageNumber.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected selectCategory(categoryId: number) {
    this.searchKeyword.set('');
    this.selectedCategoryId.set(categoryId);
  }

  constructor() {
    effect(() => console.log('products', this.products()));
    effect(() => console.log('categories', this.categories.value()));
  }

  protected readonly skeletons = Array.from(
    { length: 8 },
    (_, i) => i,
  );

  addToCart(product: Product) {
    console.log("the product added to the cart " 
      + product.name + product.sku
    );

    // todo later
  }
}
