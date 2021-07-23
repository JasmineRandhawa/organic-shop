import { LoggedInUser } from 'src/app/models/logged-in-user';
import { OrderCart } from 'src/app/models/order-cart';

/*---Data Model for Product---*/
export class Order
{
    constructor(public cart : OrderCart = new OrderCart() ,
                public orderUId:string = "",
                public name : string ="", 
                public address : string = "",
                public user : LoggedInUser = new LoggedInUser(),
                public orderDate : string= "") {

    }
}