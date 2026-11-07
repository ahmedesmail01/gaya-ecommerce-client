import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Service()
export class CartService {

    cartItems: CartItem[] = [];
    totalPrice = new BehaviorSubject<number>(0);
    totalQuantity = new BehaviorSubject<number>(0);

    addToCart(theCartItem: CartItem) {
        // check if we already have the item in our cart
        const existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);

        if (existingCartItem) {
            existingCartItem.quantity += theCartItem.quantity;
        } else {
            this.cartItems.push(theCartItem);
        }

        this.computeCartTotal();
    }

    incrementQuantity(theCartItem: CartItem) {
        theCartItem.quantity++;
        this.computeCartTotal();
    }

    decrementQuantity(theCartItem: CartItem) {
        if (theCartItem.quantity <= 1) return;
        theCartItem.quantity--;
        this.computeCartTotal();
    }

    remove(theCartItem: CartItem) {
        const index = this.cartItems.findIndex(item => item.id === theCartItem.id);
        if (index > -1) {
            // splice keeps the same array, so every component holding it sees the change
            this.cartItems.splice(index, 1);
            this.computeCartTotal();
        }
    }

    computeCartTotal() {
        let totalPriceValue = 0;
        let totalQuantityValue = 0;

        for (const item of this.cartItems) {
            totalPriceValue += item.unitPrice * item.quantity;
            totalQuantityValue += item.quantity;
        }

        // publish the totals once, after summing all items
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        // for debugging
        this.logCartData(totalPriceValue, totalQuantityValue);
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        for (const item of this.cartItems) {
            const subTotalPrice = item.unitPrice * item.quantity;
            console.log(`name: ${item.name}, quantity=${item.quantity}, unitPrice=${item.unitPrice}, subTotalPrice=${subTotalPrice}`);
        }
        console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    }
}
