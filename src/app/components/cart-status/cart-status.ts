import { Component } from '@angular/core';
import { LucideShoppingCart } from '@lucide/angular';


@Component({
  imports: [  LucideShoppingCart  ],
  selector: 'app-cart-status',
  styleUrl: './cart-status.css',
  templateUrl: './cart-status.html',
})
export class CartStatus {}
