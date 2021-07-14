import { Category } from './category';
export interface Product
{
    uId?:string,
    title:string,
    price?:number,
    category:Category,
    imageURL:string
}