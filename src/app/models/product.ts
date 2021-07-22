import { Category } from './category';

/*Data Model for Product*/
export class Product
{
    constructor(public uId:string = "", public title:string = "", public price:number = 0,
                public category:Category = {uId:"", name:""},public imageURL:string ="")
    {

    }

    static createProduct(product:Product)
    {
       return new Product(product.uId, product.title,product.price,product.category,product.imageURL);
    }
}