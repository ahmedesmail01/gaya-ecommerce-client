import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { ProductList } from '../../components/product-list/product-list';

@Component({
  imports: [Hero, ProductList],
  selector: 'app-home',
  template: `
    <app-hero />
    <app-product-list id="collection" class="block scroll-mt-20" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
