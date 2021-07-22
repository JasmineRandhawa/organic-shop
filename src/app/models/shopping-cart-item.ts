import { Product } from "./product";

/*---Data Model for Shopping Cart Item---*/
export class ShoppingCartItem
{
    constructor(public product : Product = new Product(), public quantity : number = 0){
    }

    // compute total price of a product
    get totalPricePerProduct() : number
    {
      return this.product.price * this.quantity;
    }
}