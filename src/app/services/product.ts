import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    ProductCategory: ProductCategory[];
  };
}

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl =
    'http://localhost:8080/api';
  // private readonly searchUrl = 'http://localhost:8080/api/products/search/findByCategoryId';

  getProductList(
    theId: number,
  ): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search/findByCategoryId?id=${theId}`;
    return this.http
      .get<GetResponseProducts>(url)
      .pipe(
        map(
          (response) =>
            response._embedded.products,
        ),
      );
  }

  getProductCategories(): Observable<
    ProductCategory[]
  > {
    const url = `${this.baseUrl}/product-category`;
    return this.http
      .get<GetResponseProductCategory>(url)
      .pipe(
        map(
          (response) =>
            response._embedded.ProductCategory,
        ),
      );
  }
}
