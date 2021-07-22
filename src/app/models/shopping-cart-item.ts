import { Product } from "./product";

/*Data Model for Shopping Cart Item*/
export class ShoppingCartItem
{
    constructor( public product:Product = new Product(),public quantity:number = 0)
    {

    }
}