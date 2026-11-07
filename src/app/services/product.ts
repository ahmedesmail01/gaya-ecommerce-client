import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface ProductPage {
  products: Product[];
  page: PageInfo;
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: PageInfo;
}

interface GetResponseProductCategory {
  _embedded: {
    ProductCategory: ProductCategory[];
  };
}

function toProductPage(response: GetResponseProducts): ProductPage {
  return { products: response._embedded.products, page: response.page };
}

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl =
    'http://localhost:8081/api';
  // private readonly searchUrl = 'http://localhost:8080/api/products/search/findByCategoryId';

  getProductList(
    theId: number,
    page: number,
    size: number,
  ): Observable<ProductPage> {
    const url = `${this.baseUrl}/products/search/findByCategoryId`;
    return this.http
      .get<GetResponseProducts>(url, {
        params: { id: theId, page, size },
      })
      .pipe(map(toProductPage));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.baseUrl}/products/${id}`,
    );
  }

  searchProducts(
    keyword: string,
    page: number,
    size: number,
  ): Observable<ProductPage> {
    const url = `${this.baseUrl}/products/search/findByNameContaining`;
    return this.http
      .get<GetResponseProducts>(url, {
        params: { name: keyword, page, size },
      })
      .pipe(map(toProductPage));
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
