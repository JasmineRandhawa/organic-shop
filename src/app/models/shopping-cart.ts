import { LoggedInUser } from 'src/app/models/logged-in-user';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';

/*---Data Model for Shopping Cart---*/
export class ShoppingCart
{
    items : ShoppingCartItem[] = [];

    constructor(public itemsMap : { [productId : string] : ShoppingCartItem } = {} , 
                public uId : string = "" ,
                public user : LoggedInUser = new LoggedInUser() ,
                public dateCreated : string = "") {
        // populate items list from itemsMap key pair object            
        for (let productId in itemsMap) {
            let itemObj = itemsMap[productId];
            this.items.push(new ShoppingCartItem(itemObj.product, itemObj.quantity));         
        }
    }
    
    //compute items count
    get totalItemsCount() : number {
        let count = 0;
        for (let item in this.items) {
            count += this.items[item].quantity;
        }
        return count;
    }

    //compute total price
    get totalPrice() : number {
        let totalPrice = 0;
        for (let item in this.items) {
            let itemObj = this.items[item];
            totalPrice += itemObj.product.price * itemObj.quantity;
        }
        return totalPrice;
    }

    //is any items in the cart
    get isAnyItems() : boolean {
        return this.totalItemsCount > 0
    }
}