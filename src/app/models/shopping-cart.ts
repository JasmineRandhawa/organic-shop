import { LoggedInUser } from './logged-in-user';
import { ShoppingCartItem } from './shopping-cart-item';

/*Data Model for Shopping Cart*/
export class ShoppingCart
{
    constructor(public items : ShoppingCartItem[], public uId :string ="" ,
                public user:LoggedInUser = new LoggedInUser(),
                public dateCreated : string = "")
    {
        
    }
    
    //compute items count
    get totalItemsCount() : number
    {
        let count = 0;
        for (let item in this.items) {
            count += this.items[item].quantity;
        }
        return count;
    }

    //compute total price
    get totalPrice() : number
    {
        let totalPrice = 0;
        for (let item in this.items) {
            totalPrice += this.items[item].product.price * this.items[item].quantity;
        }
        return totalPrice;
    }

    //is any items in the cart
    get isAnyItems() : boolean
    {
        return this.totalItemsCount > 0
    }
}