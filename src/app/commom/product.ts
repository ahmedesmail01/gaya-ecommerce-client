export class Product {

    constructor(
        // public id: number,
        public name: string,
        public unitePrice: number,
        public description: string,
        public imageUrl: string,
        public sku: string,
        public active: boolean,
        public unitsInStock: number,
        public dateCreated: Date,
        public lastUpdated: Date
    ) { }
}
