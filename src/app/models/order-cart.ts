import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';

/*---Data Model for Shopping Cart---*/
export class OrderCart
{
    constructor(public items: { [productId : string] : ShoppingCartItem } = {} , 
                public cartUId : string = "" ) {
    }
}