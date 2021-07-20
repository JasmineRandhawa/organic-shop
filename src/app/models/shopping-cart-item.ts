import { Product } from "./product";


/*Data Model for Shopping Cart Item*/
export interface ShoppingCartItem
{
    product:Product,
    quantity:number,
}