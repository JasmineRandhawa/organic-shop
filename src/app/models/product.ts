import { Category } from './category';

/*Data Model for Product*/
export interface Product
{
    uId?:string,
    title:string,
    price?:number,
    category:Category,
    imageURL:string
}