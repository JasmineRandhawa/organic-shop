import { Category } from 'src/app/models/category';

/*---Data Model for Product---*/
export class Product
{
    constructor(public uId : string = "" , public title : string = "", 
                public price : number = 0,
                public category : Category = { uId : "", name : "" },
                public imageURL : string = "") {

    }
}