import { Component } from '@angular/core';
import { ProductList } from '../../components/product-list/product-list';

@Component({
  imports: [ProductList],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {}
