import { LoggedInUser } from './logged-in-user';
import { ShoppingCartItem } from './shopping-cart-item';

/*Data Model for Shopping Cart*/
export interface ShoppingCart
{
    user:LoggedInUser,
    items:ShoppingCartItem[],
    dateCreated:string;
}