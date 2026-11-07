import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Gaya-Store',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories').then(
        (m) => m.Categories,
      ),
    title: 'Gaya-Store',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products').then((m) => m.Products),
    title: 'Gaya-Store',
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/product-details/product-details').then(
        (m) => m.ProductDetails,
      ),
    title: 'Gaya-Store',
  },
  {
    path: 'cart-details',
    loadComponent: () =>
      import('./components/cart-details/cart-details').then(
        (m) => m.CartDetails,
      ),
    title: 'Gaya-Store',
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout').then((m) => m.Checkout),
    title: 'Gaya-Store',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about').then((m) => m.About),
    title: 'Gaya-Store',
  },
  {
    path: '**',
    redirectTo: '/products',
    pathMatch: 'full',
    title: 'Gaya-Store',
  },
];
