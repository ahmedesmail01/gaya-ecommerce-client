export class CartItem {

    id: number;
    name: string;
    imageUrl: string;
    unitPrice: number;

    quantity: number;

    constructor(id: number, name: string, imageUrl: string, unitPrice: number) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.unitPrice = unitPrice;
        this.quantity = 1;
    }
}
